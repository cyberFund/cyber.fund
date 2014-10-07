import decimal
from google.appengine.ext import ndb
import constants
import handler
import model
import logging
from google.appengine.api import urlfetch
import urllib
import json


class Deposit(handler.Base):
  def get(self):
    try:
      name = 'Unknown'
      if self.user_model:
        name = self.user_model.name
      _address = model.PubKey.query(
        model.PubKey.tags == model.Tag(prop='user', value=self.uid),
        model.PubKey.tags == model.Tag(prop='type', value='blockchain'),
      )
      _address = _address.get()
      if _address:
        address = _address.key.id()
      else:
        callback = ('https://cyberfundio.appspot.com/deposit/blockchain/callback'
                    '?secret=%s' % constants.BLOCKCHAIN_SECRET)
        params = {'method': 'create',
                  'address': constants.MASTER_BTC,
                  'callback': callback}
        params = urllib.urlencode(params)
        result = urlfetch.fetch('https://blockchain.info/api/receive?%s' % params)
        result = json.loads(result.content)
        assert result.get('destination') == constants.MASTER_BTC
        assert result.get('callback_url') == callback
        address = result.get('input_address')
        assert address is not None
        address = model.PubKey(key=ndb.Key(model.PubKey, address),
                               tags=[
                                model.Tag(prop='type', value='blockchain'),
                                model.Tag(prop='label', value=name),
                                model.Tag(prop='user', value=self.uid),
                               ])
        address = address.put().id()

    except ValueError:
      return self.render('deposit-error.html')
    return self.render('deposit.html', address=address,
                       master=constants.MASTER_BTC,
                       secret=constants.BLOCKCHAIN_SECRET)


class BlockchainCallback(handler.Base):
  def get(self):
    assert self.request.get('destination_address') == constants.MASTER_BTC
    assert self.request.get('secret') == constants.BLOCKCHAIN_SECRET
    address = self.request.get('input_address')
    transaction_hash = self.request.get('transaction_hash')
    input_transaction_hash = self.request.get('input_transaction_hash')
    amount = decimal.Decimal(self.request.get('value')) / 100000000
    confirmations = int(self.request.get('confirmations'))

    if confirmations < constants.CONFIRMATIONS_REQUIRED:
      return self.request.get('waiting for >= %s confirmations' % confirmations)

    logging.info(self.request.GET.values())

    src = model.PubKey.get_by_id(address)
    dest = model.PubKey.get_or_insert(constants.MASTER_BTC, tags=[
      model.Tag(prop='label', value='cyberfund'),
      model.Tag(prop='type', value='invest'),
    ])

    @ndb.transactional(xg=True)
    def _tx():
      model.Tx.transfer_funds(
        src=src, dest=dest, asset='BTC', amount=amount, safe=True, txid=input_transaction_hash)
      return True

    if _tx():
      self.response.write('*ok*')
    model.Tx.execute_unapplied_transactions_async()
