from google.appengine.ext import ndb, deferred
from google.appengine.api import urlfetch
import constants
import decimal
import handler
import hashlib
import logging
import model
import json
import csv
import sys
import re
from cStringIO import StringIO
import gspread
import datetime


class AccountDoesNotExistsError(Exception):
  pass


def hash_color(string):
  string = string or 'None'
  string = ''.join([i if ord(i) < 128 else '_' for i in string])
  md5 = hashlib.md5()
  md5.update(string)
  return md5.hexdigest()[:6]


def invert_color(color):
  """ http://gamedev.stackexchange.com/questions/38536/given-a-rgb-color-x-how-to-find-the-most-contrasting-color-y
  """
  _NUMERALS = '0123456789abcdefABCDEF'
  _HEXDEC = {v: int(v, 16) for v in (x + y for x in _NUMERALS for y in _NUMERALS)}
  LOWERCASE, UPPERCASE = 'x', 'X'

  def to_rgb(triplet):
    return _HEXDEC[triplet[0:2]], _HEXDEC[triplet[2:4]], _HEXDEC[triplet[4:6]]

  def to_hex(rgb, lettercase=LOWERCASE):
    return format(rgb[0] << 16 | rgb[1] << 8 | rgb[2], '06' + lettercase)

  rgb = to_rgb(color)
  r, g, b = rgb
  r, g, b = float(r) / 255, float(g) / 255, float(b) / 255

  gamma = 2.2
  lum = 0.2126 * pow(r, gamma) + 0.7152 * pow(g, gamma) + 0.0722 * pow(b, gamma)

  return 'black' if lum > 0.5 else 'white'


class Admin(handler.Base):
  def get(self):
    return self.redirect('/admin/transactions')


class Json(handler.Base):
  def accounts(self):
    pub_keys = model.PubKey.query().fetch(500)
    text = lambda k: '%s -- %s (%s)' % (k.label, ','.join(['%s: %s' % (b.asset.upper(), b.value) for b in k.balances]), k.key.id())
    accounts = [{'id': k.key.id(), 'text': text(k)} for k in pub_keys]
    return self.render_json(accounts)

  def assets(self):
    a = constants.CURRENCY_DICT
    a = [{'id': c, 'text': '%s (%s)' % (a[c].get('label'), c)} for c in a]
    return self.render_json(a)

  def tags(self):
    txs = model.Tx.query().fetch(500)
    tags = set()
    for tx in txs:
      for tag in tx.tags:
        tags.add(tag.to_str())
    tags = [{'id': t, 'text': t} for t in tags]
    return self.render_json(tags)

  def unapplied(self):
    qry = model.Tx.query()
    qry = qry.filter(model.Tx.other == None)
    qry = qry.filter(model.Tx.state == 'in_progress')
    return self.render_json({'count': qry.count(99)})

  def pie(self):
    r = model.Tx.get_pie_rate(model.PubKey.get_or_insert('cyberfund-PIE'))
    return self.render_json({'rate': float(r)})


class TxsHandler(handler.Base):
  def get(self):
    TX_PER_PAGE = constants.TX_PER_PAGE

    filters = self.request.get('tags').split(',')
    filters = [f for f in filters if f]

    qry = model.Tx.query(model.Tx.tags == model.Tag.from_str('display:true'))
    for filtr in filters:
      if len(filtr.split(':')) != 2:
        continue
      prop, value = filtr.split(':')
      if prop and value:
        qry = qry.filter(model.Tx.tags == model.Tag(prop=prop, value=value))
      elif prop:
        qry = qry.filter(model.Tx.tags.prop == prop)
      elif value:
        qry = qry.filter(model.Tx.tags.value == value)
    qry = qry.order(-model.Tx.created)

    txs = qry.fetch(TX_PER_PAGE, offset=self.cursor * TX_PER_PAGE)
    next_curs = self.cursor + 1 if len(txs) == TX_PER_PAGE else ''

    tmpl_params = {
      'txs': txs,
      'next_curs': next_curs,
      'hash_color': hash_color,
      'invert_color': invert_color,
    }

    if self.request.get('response') == 'json':
      page = {'page': self.render_to_string(
        'admin/transactions-ajax.html', **tmpl_params)}
      return self.render_json(page)

    return self.render('admin/transactions.html', **tmpl_params)

  def post(self):
    model.Tx.execute_unapplied_transactions_async()
    return self.redirect('/admin/transactions')


class TxPutHandler(handler.Base):
  def post(self):
    txid = self.request.get('txid') or None
    src = self.request.get('src')
    dest = self.request.get('dest')
    amount = decimal.Decimal((self.request.get('amount')))
    asset = self.request.get('asset')
    safe = self.request.get('safe') or False
    pending = self.request.get('pending') or False
    created = self.request.get('created')
    created = datetime.datetime.strptime(created, '%m/%d/%Y %H:%M:%S')

    tags = self.request.get('tags').split(',')
    tags = [t for t in tags if t]
    tags.append('import-type:manual')

    src = model.PubKey.get_by_id(src)
    dest = model.PubKey.get_by_id(dest)

    if src is None or dest is None:
      return self.redirect('/admin/transactions?ERROR_SRC_OR_DEST_NOT_FOUND')

    state = 'in_progress'
    if pending:
      state = 'pending'

    model.Tx.transfer_funds(src=src, dest=dest, asset=asset, state=state,
                            amount=amount, safe=safe, txid=txid, tags=tags,
                            created=created)

    model.Tx.execute_unapplied_transactions_async()

    return self.redirect('/admin/transactions')


class TxRollbackHandler(handler.Base):
  def get(self):
    key = ndb.Key(urlsafe=self.request.get('key'))
    model.Tx.roll_back(key)
    return self.redirect('/admin/transactions')


class TxProcessHandler(handler.Base):
  @ndb.transactional
  def get(self):
    key = ndb.Key(urlsafe=self.request.get('key'))
    tx = key.get()
    tx.state = 'in_progress'
    tx.put()
    return self.redirect('/admin/transactions')


class TxFlushHandler(handler.Base):
  @classmethod
  def flush(cls):
    more = False
    keys = model.Tx.query().fetch(500, keys_only=True)
    if len(keys) >= 500:
      more = True
    keys += model.PubKey.query().fetch(500, keys_only=True)
    ndb.delete_multi(keys)
    if more:
      deferred.defer(cls.flush, _queue='default')

  def post(self):
    keys = model.Tx.query().fetch(500, keys_only=True)
    keys += model.PubKey.query().fetch(500, keys_only=True)
    ndb.delete_multi(keys)
    deferred.defer(self.flush, _queue='default')
    return self.redirect('/admin/transactions')


class TxImportHandler(handler.Base):

  SERVICE_ACCOUNT_EMAIL = constants.SERVICE_ACCOUNT_EMAIL
  SERVICE_ACCOUNT_PASSWORD = constants.SERVICE_ACCOUNT_PASSWORD
  SPREADSHEET_URL_KEY = re.compile(r'key=([^&#]+)|d/([^&#]+)/')
  DATETIME_FORMAT = '%m/%d/%Y %H:%M:%S'

  @classmethod
  def download(cls, url):
    result = urlfetch.fetch(url=url, validate_certificate=False, deadline=60)
    result = result.content

    f = StringIO(result)

    reader = csv.reader(f)
    rows = [row for row in reader]
    header = [h.strip() for h in rows[0]]
    rows = rows[1:]

    logging.info(url)

    required_headers = ['Tx ID', 'Sender public key', 'Recipient public key',
                        'Amount', 'Asset', 'Timestamp', 'Tx Type']
    if not set(required_headers).issubset(set(header)):
      logging.error('Invalid CSV headers. Required headers are: %s', required_headers)
      logging.error(header)
      return

    gc = gspread.login(cls.SERVICE_ACCOUNT_EMAIL, cls.SERVICE_ACCOUNT_PASSWORD)
    sid = re.compile(r'id=([^&#]+)').search(url).group(1)
    worksheet = gc.open_by_key(sid).sheet1

    cells = worksheet.cols([1, 2])

    for row in rows:
      txid = row[header.index('Tx ID')]

      if not txid:
        continue

      _row = None
      for cell in cells:
        if cell.col == 1 and cell.value == txid:
          _row = cell.row

      try:
        src = row[header.index('Sender public key')]
        dest = row[header.index('Recipient public key')]
        amount = decimal.Decimal(row[header.index('Amount')])
        asset = row[header.index('Asset')].upper()
        created = row[header.index('Timestamp')]
        created = datetime.datetime.strptime(created, cls.DATETIME_FORMAT)

        tag_headers = ['Ref', 'Tag', 'Operation type', 'Item name',
                       'Supply order', 'Invoice', 'Estimate.qty', 'Chipset',
                       'Supplier article', 'Tx Type']

        tags = set()
        tags.add('import-type:manual')
        for i, h in enumerate(header):
          if h in tag_headers:
            for tag in row[i].split(','):
              tag = tag.strip()
              if tag:
                tags.add('%s:%s' % (h, tag))

        cache_off = {'use_cache': False, 'use_memcache': False}
        _src = ndb.Key(model.PubKey, src).get(**cache_off)
        _dest = ndb.Key(model.PubKey, dest).get(**cache_off)

        if _src is None:
          raise AccountDoesNotExistsError(src)
        if _dest is None:
          raise AccountDoesNotExistsError(dest)

        tx = {'src': _src,
              'dest': _dest, 'asset': asset,
              'amount': amount, 'safe': True,
              'created': created}
        if txid:
          tx['txid'] = txid
        if tags:
          tx['tags'] = tags

        model.Tx.transfer_funds(**tx)

        for cell in cells:
          if cell.row == _row and cell.col == 2:
            logging.info('writing into %s %s', cell.row, cell.col)
            cell.value = 'Success'
      except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        logging.error('%s: %s', exc_type.__name__, e)
        for cell in cells:
          if cell.row == _row and cell.col == 2:
            logging.info('writing into %s %s', cell.row, cell.col)
            cell.value = '%s: %s' % (exc_type.__name__, e)

    worksheet.update_cells(cells)
    logging.info('Write results: success')
    model.Tx.execute_unapplied_transactions_async()

  def post(self):
    url = self.request.get('csv')
    return deferred.defer(self.download, url, _queue='default')


class PubKeysHandler(handler.Base):
  def get(self):
    filters = self.request.get('tags').split(',')
    filters = [f for f in filters if f]
    pub_keys = model.PubKey.query()
    for filtr in filters:
      if len(filtr.split(':')) != 2:
        continue
      prop, value = filtr.split(':')
      if prop and value:
        pub_keys = pub_keys.filter(model.PubKey.tags == model.Tag(prop=prop, value=value))
      elif prop:
        pub_keys = pub_keys.filter(model.PubKey.tags.prop == prop)
      elif value:
        pub_keys = pub_keys.filter(model.PubKey.tags.value == value)
    pub_keys = pub_keys.fetch(500)

    pub_keys.sort(key=lambda x: (x.type, x.label))

    tags = set()
    for pubkey in pub_keys:
      for tag in pubkey.tags:
        tags.add(tag.to_str())
    tags = [{'id': t, 'text': t} for t in tags]
    tags = json.dumps(tags)
    addr = bitcoin.generate_bitcoin_addr()
    return self.render('admin/pubkeys.html', pub_keys=pub_keys, tags=tags,
                       addr=addr, hash_color=hash_color,
                       invert_color=invert_color)

  def post(self):
    pub_key = self.request.get('pubkey')
    priv_key = self.request.get('privkey') or None
    tags = []
    for tag in [t for t in self.request.get('tags').split(',') if t]:
      tag = model.Tag.from_str(tag)
      if tag not in tags:
        tags.append(tag)

    key = ndb.Key(model.PubKey, pub_key)
    pk = key.get()
    if not pk:
      pk = model.PubKey(key=key, private_key=priv_key)
    pk.tags = tags
    pk.put()

    return self.redirect('/admin/accounts')


class PubKeysImportHandler(handler.Base):
  def post(self):
    url = self.request.get('csv')

    result = urlfetch.fetch(url=url, validate_certificate=False)
    result = result.content

    f = StringIO(result)

    reader = csv.reader(f)
    rows = [row for row in reader]
    header = rows[0]
    rows = rows[1:]

    required_headers = ['Public key', 'Private key', 'Label', 'User', 'Label', 'User', 'Type']
    tag_headers = ['Label', 'User', 'Type', 'Tag', 'Cost type', 'Acc number', 'Card number', 'Vendor.Type', 'Asset.Rate', 'Exchange']
    if not set(required_headers).issubset(set(header)):
      logging.error('Invalid CSV headers.')
      logging.error(header)
      return self.abort(500)

    pub_keys = []

    for row in rows:
      pub_key = row[header.index('Public key')]
      if not pub_key:
        continue
      priv_key = row[header.index('Private key')]

      tags = []
      for i, h in enumerate(header):
        if h in tag_headers:
          for tag in row[i].split(','):
            if tag.strip():
              tag = model.Tag.from_str('%s:%s' % (h.lower(), tag.strip()))
              if tag not in tags:
                tags.append(tag)

      key = ndb.Key(model.PubKey, pub_key)
      pk = model.PubKey(key=key, private_key=priv_key, tags=tags)
      pub_keys.append(pk)

    for pk in ndb.get_multi([p.key for p in pub_keys]):
      if pk:
        for _pk in pub_keys:
          if pk == _pk:
            _pk.balances = pk.balances

    return ndb.put_multi(pub_keys)


class AssetsHandler(handler.Base):
  def get(self):
    # params = {
    #   'size': 0,
    #   'aggregations': {
    #     'all': {
    #       'global': {},
    #       'aggregations': {
    #         'assets': {
    #           'terms': {
    #             'field': 'asset',
    #             'size': 0,
    #           },
    #           'aggregations': {
    #             'amounts': {
    #               'sum': {
    #                 'script': 'abs(doc["amount"].value)',
    #               }
    #             }
    #           }
    #         },
    #       }
    #     },
    #   }

    # }

    # payload = json.dumps(params)

    # url = 'http://107.178.220.198:9200/cyberfund/_search'
    # r = urlfetch.fetch(
    #   url=url,
    #   headers={'Content-Type': 'application/json'},
    #   deadline=60,
    #   method=urlfetch.POST,
    #   payload=payload)
    # results = json.loads(r.content)
    # return self.render_json(results)

    txs = model.Tx.query(model.Tx.tags == model.Tag.from_str('display:true'))
    txs = txs.fetch(1000)

    assets = {}
    for tx in txs:
      assets.setdefault(tx.asset, 0)
      assets[tx.asset] += abs(tx.amount)

    return self.render('admin/assets.html', assets=assets,
                       assets_dict=constants.CURRENCY_DICT)


class OperationsHandler(handler.Base):
  def get(self):
    txs = model.Tx.query(model.Tx.tags == model.Tag.from_str('display:true'))
    txs = txs.fetch(1000)

    operations = {}
    for tx in txs:
      operations.setdefault(tx.tag('operation-type'), {})
      operations[tx.tag('operation-type')].setdefault(tx.asset, {})
      operations[tx.tag('operation-type')][tx.asset].setdefault(tx.state, 0)
      operations[tx.tag('operation-type')][tx.asset][tx.state] += abs(tx.amount)

    return self.render('admin/operations.html', operations=operations)
