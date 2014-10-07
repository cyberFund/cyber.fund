from google.appengine.ext import ndb, deferred
from google.appengine.api import memcache
from webapp2_extras.appengine.auth.models import User
import constants
import cPickle
import logging
import decimal
import datetime


class DecimalProperty(ndb.IntegerProperty):

  float_prec = 8

  def __init__(self, float_prec=None, **kwargs):
    if float_prec is not None:
      self.float_prec = float_prec
    super(DecimalProperty, self).__init__(**kwargs)

  def _validate(self, value):
    return decimal.Decimal(value)

  def _to_base_type(self, value):
    return int(round(value * (10 ** self.float_prec)))

  def _from_base_type(self, value):
    return decimal.Decimal(value) / (10 ** self.float_prec)


class NonSufficientFundsError(Exception):
  pass


class AccountDoesNotExistsError(Exception):
  pass


class InvalidTagError(Exception):
  pass


class TxAlreadyExistsError(Exception):
  pass


class Tag(ndb.Model):
  prop = ndb.StringProperty('p', indexed=True, validator=lambda p, v: v.lower())
  value = ndb.StringProperty('v', indexed=True)

  @classmethod
  def from_str(cls, tag):
    _tag = tag.split(':')
    if len(_tag) != 2:
      raise InvalidTagError('Tag should consist of property and value '
                            'separated by a colon, got "%s" instead.' % tag)
    prop, value = _tag
    prop, value = prop.strip(), value.strip()
    prop, value = prop.replace(' ', '-'), value.replace(' ', '-')
    return cls(prop=prop, value=value)

  def to_str(self):
    return '%s:%s' % (self.prop, self.value)


class Tx(ndb.Model):
  amount = DecimalProperty(name='n', required=True)
  target = ndb.KeyProperty('t', kind='PubKey', required=True)
  other = ndb.KeyProperty('o', kind='Tx')
  state = ndb.StringProperty('s', choices=constants.TX_STATES)

  asset = ndb.StringProperty('a', choices=constants.CURRENCY_LIST)
  tags = ndb.StructuredProperty(Tag, name='g', repeated=True)

  updated = ndb.DateTimeProperty('u', auto_now=True)
  created = ndb.DateTimeProperty('c', auto_now_add=True)

  def to_index(self):
    d = {}
    d['state'] = self.state
    d['asset'] = self.asset
    d['amount'] = abs(float(self.amount))
    d['updated'] = self.updated.strftime('%Y%m%d')
    d['created'] = self.created.strftime('%Y%m%d')
    d['tags'] = [{'prop': t.prop, 'value': t.value} for t in self.tags]
    return {'type': 'tx', 'fields': d, 'id': self.key.id()}

  def tag(self, prop):
    for tag in self.tags:
      if tag.prop == prop:
        return tag.value

  @classmethod
  def is_manual(cls, tx):
    """ Returns True if tx were processed manually.
    """
    _tag = Tag.from_str('import-type:manual')
    if _tag in tx.tags:
      return True
    return False

  # @classmethod
  # def get_pie_rate(cls, exclude, created=None):
  #   """
  #   Args:
  #     exclude: Tuple with (amount, asset) to exclude from rate calculation.
  #   """
  #   accounts = Tx.query(Tx.tags == Tag.from_str('asset.rate:PIE'), Tx.created < created, Tx.tags == Tag.from_str('display:false'))
  #   # get all palances on specified period if time!
  #   accounts = accounts.fetch()
  #   print 'accounts: %s' % accounts
  #   print 'accounts: %s' % Tx.query(Tx.tags == Tag.from_str('asset.rate:PIE'), Tx.tags == Tag.from_str('display:false')).fetch()
  #   if not accounts:
  #     raise EnvironmentError
  #   balances = {}
  #   for account in accounts:
  #     # for balance in account.balances:
  #     balances.setdefault(account.asset, 0)
  #     balances[account.asset] += account.amount
  #   from rates import get_rates
  #   _rates = get_rates(base=balances.keys(), quote=['BTC'])

  #   balance_in_btc = 0
  #   excluded = False
  #   for asset, value in balances.iteritems():
  #     print '______Balances: %s: %s' % (asset, value)
  #     if not excluded and asset == exclude[1]:
  #       excluded = True
  #       print
  #       print '########## excluding... %s - %s = %s' % (value, exclude[0], value - exclude[0])
  #       print
  #       value = value - exclude[0]
  #     _in_btc = decimal.Decimal(_rates.get('%sBTC' % asset)) * value
  #     balance_in_btc += _in_btc
  #   num_of_pies = PubKey.get_or_insert('cyberfund-PIE').balance('PIE')

  #   print
  #   print 'balance_in_btc %s' % balance_in_btc
  #   print 'num_of_pies %s' % abs(num_of_pies)

  #   if num_of_pies == 0:
  #     return 1
  #   else:
  #     return decimal.Decimal(balance_in_btc / abs(num_of_pies))

  @classmethod
  def get_pie_rate(cls, pie):
    num_of_pies = abs(pie.balance('PIE'))

    print 'Number of PIEs', num_of_pies

    if num_of_pies < 1:
      pie_rate = 1
    else:
      balances = {}
      for balance in pie.balances:
        if balance.asset == 'PIE':
          continue
        balances.setdefault(balance.asset, 0)
        balances[balance.asset] += balance.value

      from rates import get_rates
      _rates = get_rates(base=balances.keys(), quote=['BTC'])

      balance_in_btc = 0
      for asset, value in balances.iteritems():
        print value, '*', _rates.get('%sBTC' % asset), '%sBTC' % asset
        _in_btc = decimal.Decimal(_rates.get('%sBTC' % asset)) * value
        balance_in_btc += _in_btc

      pie_rate = decimal.Decimal(balance_in_btc / num_of_pies)
    return pie_rate

  @classmethod
  def transfer_pie(cls, account, amount, asset, txid, buy=None, created=None):
    # assert is in transaction
    # TODO: use historic rates here, acording to tx timestamp
    # TODO: calculate rates acording to exchanges
    txid = '%s_pie' % txid
    print 'txid: %s (%s)' % (txid, 'buy' if buy else 'sell')

    print account
    pie_key = ndb.Key(PubKey, 'cyberfund-PIE')
    pie = pie_key.get()
    if pie is None:
      pie = PubKey(key=pie_key)

    pie_rate = cls.get_pie_rate(pie)

    print 'PIE/BTC rate: %s' % pie_rate

    from rates import get_rate
    # TODO: use single rates fetch

    if asset == 'BTC':
      amount_in_btc = amount
    else:
      _rate = get_rate(base=asset, quote='BTC')
      print 'RATE: %s' % _rate
      if _rate is None:
        logging.critical('Error while fetching rate for %s', asset)
        raise EnvironmentError

      amount_in_btc = decimal.Decimal(amount * _rate)

    print 'asset: %s %s' % (amount, asset)
    print 'in btc: %s' % amount_in_btc

    pie_amount = amount_in_btc / pie_rate
    print 'pie_amount: %s' % pie_amount

    params = {
      'asset': 'PIE',
      'amount': pie_amount,
      'safe': True,
      'txid': txid,
      # 'tags': ['pie:%s' % 'buy' if buy else 'sell']
    }

    if created:
      params['created'] = created

    if buy:
      params['src'] = account
      params['dest'] = pie
    else:
      params['src'] = pie
      params['dest'] = account

    pie.balance_update(asset, amount + pie.balance(asset))
    pie.put()

    try:
      result = cls.transfer_funds(**params)
    except TxAlreadyExistsError:
      result = None

    cls.roll_forward(result)

    return result

    # return result
    # if result:
      # return cls.roll_forward(result)
    # if result:
    #   return result

  @classmethod
  def transfer_funds(cls, src, dest, asset, amount, safe=None, txid=None,
                     tags=None, state=None, created=None):
    """
    Args:
      src: NDB object of source account. (instance of PubKey)
      dest: NDB object of destination account. (instance of PubKey)
      asset: String with asset.
      amount: Amount of funds to transfer. Decimal.
      safe: If True, negative balance allowed for source account.
      txid: Optional unique transaction ID.
      tags: List of tags.
      state: Tx state value. By default state is in_progress, this means
        that transfer will be completed immediately. But if state will be
        pending it will not be processed until changed to in_progress.
      created: Datetime object or None.

    Returns:
      Created transfer NDB object.
    """
    assert 0 < amount < 92233720368
    # max possible balance: 92233720368

    if tags is None:
      tags = []
    _tags = [
      Tag.from_str('src:%s' % src.key.id()),
      Tag.from_str('dest:%s' % dest.key.id()),
      Tag.from_str('asset:%s' % asset),
      Tag.from_str('display:true')]
    _tags += [Tag.from_str(t) for t in tags]

    # user label type public key

    for t in src.tags:
      if t.prop in ['user', 'label', 'type']:
        _tags.append(Tag(prop='src-%s' % t.prop, value=t.value))
      else:
        _tags.append(t)

    for t in dest.tags:
      if t.prop in ['user', 'label', 'type']:
        _tags.append(Tag(prop='dest-%s' % t.prop, value=t.value))
      else:
        _tags.append(t)

    tags = []
    for tag in _tags:
      if tag not in tags:
        tags.append(tag)

    if state is None:
      state = 'in_progress'
    assert state in constants.TX_STATES

    logging.info('Transfering %s from %s to %s' % (amount, src.key, dest.key))
    logging.info('Using transaction ID: %s' % txid)

    @ndb.transactional()
    def _tx():
      account = src.key.get()
      if account is None:
        raise AccountDoesNotExistsError(src.key.id())

      if account.balance(asset) < amount and not safe:
        raise NonSufficientFundsError('NSF on source account. (%s < %s)' % (
          account.balance(asset), amount))

      value = account.balance(asset) - amount

      account.balance_update(asset, value)

      if txid is not None:
        transfer = Tx(key=ndb.Key(Tx, txid, parent=account.key))
        if transfer.key.get():
          _err_msg = 'Transaction with ID %s already exists.' % txid
          logging.warning(_err_msg)
          raise TxAlreadyExistsError(_err_msg)
      else:
        transfer = Tx(parent=account.key)
      transfer.amount = -amount
      transfer.state = state
      transfer.target = dest.key

      transfer.tags = tags
      transfer.asset = asset

      if type(created) is datetime.datetime:
        transfer.created = created

      ndb.put_multi([account, transfer])
      return transfer
    return _tx()

  @classmethod
  def transfer_multi(cls, txs, transactional=None, xg=None, silent=None):
    """ Process multiple transactions as a single batch.
    With transactional set to True it's only possible to transfer funds from
    one source account to unlimited number of destination accounts.
    This limit can be expanded up to 5 source accounts by setting xg to True.

    Args:
      txs: List of dictionaries with transaction keyword arguments.
      transaction: Will be processed in a single transaction if True.
      xg: Enable cross-group transactions if True.
      silent:

    Returns:
      List of created transfer NDB objects.
    """
    result = []

    def _tx():
      for kwargs in txs:
        if silent is None:
          result.append(cls.transfer_funds(**kwargs))
        else:
          try:
            result.append(cls.transfer_funds(**kwargs))
          except ValueError:
            pass

    if transactional:
      ndb.transaction(lambda: _tx(), xg=xg)
    else:
      _tx()

    return result

  @classmethod
  @ndb.transactional(xg=True)
  def roll_back(cls, key):
    """ Roll back previous started money transfer.
    It's only possible to roll back the transfer in "pending" state.

    Args:
      key: Key pointing to transfer object.
    """

    logging.info('Rolling back the transfer with key %s.', key)

    transfer = key.get()
    assert transfer.state == 'pending'

    _id = '%s_rollback' % transfer.key.id()
    _parent = transfer.key.parent()
    _tags = [t for t in transfer.tags if t.prop != 'display']
    _tags.append(Tag.from_str('display:false'))
    dest_transfer = Tx.get_by_id(_id, parent=_parent)
    if not dest_transfer:
      dest_transfer = Tx(key=ndb.Key(Tx, _id, parent=_parent))
      dest_transfer.amount = -transfer.amount
      dest_transfer.target = transfer.key.parent()
      dest_transfer.state = 'canceled'
      dest_transfer.other = transfer.key

      dest_transfer.asset = transfer.asset
      dest_transfer.tags = _tags

      account = transfer.key.parent().get()

      value = account.balance(transfer.asset) - transfer.amount
      account.balance_update(transfer.asset, value)

      transfer.state = 'canceled'
      transfer.other = dest_transfer.key

      ndb.put_multi([account, dest_transfer, transfer])
    return dest_transfer

  @classmethod
  def roll_forward(cls, transfer, src=None):
    """ We pass in the transfer entity returned by transfer_funds.
    First, the function tries to fetch an existing Transfer for the destination
    account - this might already exist if a previous attempt to roll the
    transaction forward failed - using the receiving account as the parent,
    and specifying a key name based on the key of the paying account's Transfer
    entity. We need to specify a key name in order to ensure there can only be
    one matching Transfer entity for the destination account.

    If the receiving account has no matching Transfer, we create one,
    specifying the amount and target based on the first Transfer, and setting
    the 'other' field to the first Transfer. Then, we fetch the Account, add
    the transferred amount to its funds, and put both the new Transfer and the
    updated Account back to the datastore.

    Finally, outside the transaction, we get the returned dest_transfer entity,
    and update the original Transfer entity to reference it. We don't need to
    use another transaction when we store this entity back to the datastore,
    because the only possible modification of a Transfer after creating it is
    to set the 'other' field, which is what we're doing.

    Args:
      transfer: Finished transfer object with current state.
      src:
    """
    assert transfer.state == 'in_progress'
    if src is None:
      src = transfer.key.parent().get()

    @ndb.transactional(xg=True)
    def _tx():
      _id = '%s_rollforward' % transfer.key.id()
      _parent = transfer.target
      _tags = [t for t in transfer.tags if t.prop != 'display']
      _tags.append(Tag.from_str('display:false'))
      dest_transfer = Tx.get_by_id(_id, parent=_parent)
      if not dest_transfer:
        dest_transfer = Tx(key=ndb.Key(Tx, _id, parent=_parent))
        dest_transfer.amount = -transfer.amount
        dest_transfer.target = transfer.key.parent()
        dest_transfer.state = 'finished'
        dest_transfer.other = transfer.key

        dest_transfer.asset = transfer.asset
        dest_transfer.tags = _tags

        if cls.is_manual(transfer):
          dest_transfer.created = transfer.created

        account = transfer.target.get()

        _pie_key = ndb.Key(PubKey, 'cyberfund-PIE')
        _asset = transfer.asset

        if src.is_exchange or account.is_exchange or (src.is_pie and account.is_pie):

          if src.is_pie:
            _pie = _pie_key.get()
            if _pie is None:
              _pie = PubKey(key=_pie_key)
            _pie.balance_update(_asset, transfer.amount + _pie.balance(_asset))
            _pie.put()

          elif account.is_pie:
            _pie = _pie_key.get()
            if _pie is None:
              _pie = PubKey(key=_pie_key)
            _pie.balance_update(_asset, -transfer.amount + _pie.balance(_asset))
            _pie.put()

        elif src.is_pie:
          # buy
          _params = {
            'account': account,
            'buy': True,
            'amount': -transfer.amount,
            'asset': transfer.asset,
            'txid': transfer.key.id(),
            # '_queue': 'tx',
            # '_transactional': True,
          }
          cls.transfer_pie(**_params)
          # deferred.defer(cls.transfer_pie, **_params)
        elif account.is_pie:
          # sell
          _params = {
            'account': src,
            'buy': False,
            'amount': -transfer.amount,
            'asset': transfer.asset,
            'txid': transfer.key.id(),
            'created': dest_transfer.created,
            # '_queue': 'tx',
            # '_transactional': True,
          }
          # deferred.defer(cls.transfer_pie, **_params)
          cls.transfer_pie(**_params)

        value = account.balance(transfer.asset) - transfer.amount
        account.balance_update(transfer.asset, value)

        ndb.put_multi([account, dest_transfer])
      return dest_transfer
    dest_transfer = _tx()
    transfer.other = dest_transfer.key
    transfer.state = 'finished'
    transfer.put()
    return dest_transfer

  @classmethod
  def execute_unapplied_transactions(cls, count):
    q = cls.query(cls.other == None, cls.state == 'in_progress')
    q = q.order(cls.created)
    q = q.fetch(count)
    for transfer in q:
      logging.info(transfer.created)
      cls.roll_forward(transfer)
    if q:
      cls.execute_unapplied_transactions_async(count)

  @classmethod
  def execute_unapplied_transactions_async(cls, count=500):
    deferred.defer(cls.execute_unapplied_transactions, count, _queue='default')


class Balance(ndb.Model):
  value = DecimalProperty(default=0)
  asset = ndb.StringProperty(choices=constants.CURRENCY_LIST, required=True,
                             validator=lambda p, v: v.upper())


class PubKey(ndb.Model):
  balances = ndb.StructuredProperty(Balance, name='b', repeated=True)
  tags = ndb.StructuredProperty(Tag, name='t', repeated=True)
  private_key = ndb.StringProperty('p', indexed=False)

  updated = ndb.DateTimeProperty('u', auto_now=True)
  created = ndb.DateTimeProperty('c', auto_now_add=True)

  @property
  def is_pie(self):
    """ Returns True if PIE should be issued.
    """
    _tag = Tag.from_str('asset.rate:PIE')
    if _tag in self.tags:
      return True
    return False

  @property
  def is_exchange(self):
    _tag = Tag.from_str('asset.rate:exchange')
    if _tag in self.tags:
      return True
    return False

  def tag(self, prop):
    for tag in self.tags:
      if tag.prop == prop:
        return tag.value

  @property
  def label(self):
    for tag in self.tags:
      if tag.prop == 'label' and tag.value:
        return tag.value.replace('-', ' ')

  @property
  def type(self):
    for tag in self.tags:
      if tag.prop == 'type' and tag.value:
        return tag.value.replace('-', ' ')

  @property
  def user(self):
    for tag in self.tags:
      if tag.prop == 'user':
        return tag.value

  def balance(self, asset):
    for balance in self.balances:
      if balance.asset == asset:
        return balance.value
    else:
      return 0

  def balance_update(self, asset, value):
    print 'BALANCE_UPDATE: %s %s' % (asset, value)
    for balance in self.balances:
      if balance.asset == asset:
        balance.value = value
        break
    else:
      self.balances.append(Balance(asset=asset, value=value))


class User(User):
  name = ndb.StringProperty(indexed=False)
  birthday = ndb.DateProperty(indexed=False)
  picture = ndb.StringProperty(indexed=False)
  phone = ndb.StringProperty(indexed=False)
  gender = ndb.StringProperty(indexed=False)
  country = ndb.StringProperty(indexed=False)
  city = ndb.StringProperty(indexed=False)
  role = ndb.StringProperty(indexed=False, default='Default')

  @property
  def email(self):
    """ Return first auth_id which starts with "email:".
    """
    for auth_id in self.auth_ids:
      if auth_id.startswith('email:'):
        return auth_id.replace('email:', '')


class CachedDatastore(ndb.Model):
  value = ndb.PickleProperty()
  updated = ndb.DateTimeProperty(auto_now=True)

  @classmethod
  def set(cls, key, value):
    o = cls(key=ndb.Key(cls, key), value=value)
    return o.put()

  @classmethod
  def get(cls, key):
    return cls.get_by_id(key) or {}


class Cached(object):
  """
  Compressed reads from memcache faster than uncompressed and saves some memory.

  Example of usage:
    data = Cached.get('data_id')
    if data is None:
      # get data from datastore or other slow source
      data = Cached.set(key=ndb.Key(Cached, 'data_id'), value={'value': 'to_cache'})
  """

  @classmethod
  def get(cls, key):
    result = memcache.get(key)
    if result:
      result = result.decode('zip')
      result = cPickle.loads(result)
      return result

  @classmethod
  def set(cls, key, value, time=0):
    value = cPickle.dumps(value)
    value = value.encode('zip')
    return memcache.set(key, value, time)

  @classmethod
  def delete(cls, key, seconds=0):
    return memcache.delete(key, seconds)
