import unittest
from google.appengine.ext import testbed
from google.appengine.datastore import datastore_stub_util
import model
import datetime
import pickle
import base64
import mock
import decimal


class TestTx(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.testbed.init_taskqueue_stub(root_path='.')
    self.policy = datastore_stub_util.PseudoRandomHRConsistencyPolicy(
      probability=0)
    self.testbed.init_datastore_v3_stub(consistency_policy=self.policy)
    self.amount = 15
    self.zero = 0
    self.asset = 'BTC'
    self.src_balance = 0
    self.taskq = self.testbed.get_stub(testbed.TASKQUEUE_SERVICE_NAME)
    # model.Tx.get_pie_rate = mock.MagicMock(return_value=1)
    # rates.get_rate = mock.MagicMock(return_value=decimal.Decimal('0.0194'))

  def execute_deferred(self, queue='default'):
    tasks = self.taskq.GetTasks(queue)
    self.taskq.FlushQueue(queue)
    while tasks:
      for task in tasks:
        (func, args, kwargs) = pickle.loads(base64.b64decode(task['body']))
        func(*args, **kwargs)
      tasks = self.taskq.GetTasks(queue)
      self.taskq.FlushQueue(queue)

  def tearDown(self):
    self.testbed.deactivate()

  @property
  def src(self):
    balances = [model.Balance(value=self.src_balance, asset=self.asset)]
    kwargs = {'balances': balances}
    return model.PubKey.get_or_insert('src', **kwargs)

  @property
  def dest(self):
    return model.PubKey.get_or_insert('dest')

  def pubkey(self, i):
    balances = [model.Balance(asset=self.asset)]
    return model.PubKey.get_or_insert('dest%s' % i, balances=balances)

  def test_transfer(self):
    tx = model.Tx.transfer_funds(
      src=self.src, dest=self.dest, asset=self.asset, amount=self.amount,
      safe=True, tags=['test:1', 'asset:btc'])
    self.assertEqual(tx.state, 'in_progress')
    self.assertEqual(self.src.key.get().balance(self.asset), -self.amount)
    self.assertEqual(self.dest.key.get().balance(self.asset), self.zero)
    return tx

  def test_transfer_multi_transactional(self):
    self.src_balance = 15
    destinations = [self.pubkey(i) for i in range(0, 15)]

    txs = model.Tx.transfer_multi([
      {'src': self.src, 'dest': d, 'asset': self.asset,
       'amount': 1} for d in destinations], transactional=True)

    self.assertEqual(self.src.key.get().balance(self.asset), 0)
    for tx in txs:
      model.Tx.roll_forward(tx)

    for dest in destinations:
      self.assertEqual(dest.key.get().balance(self.asset), 1)

  def test_roll_forward(self):
    tx = self.test_transfer()
    model.Tx.roll_forward(tx)
    self.assertEqual(self.dest.key.get().balance(self.asset), self.amount)
    self.assertEqual(tx.state, 'finished')
    self.assertEqual(tx.state, tx.other.get().state)

  def test_roll_forward_display_tag(self):
    tx = self.test_transfer()
    self.assertTrue(model.Tag.from_str('display:true') in tx.tags)
    rf = model.Tx.roll_forward(tx)
    self.assertTrue(model.Tag.from_str('display:true') not in rf.tags)
    self.assertTrue(model.Tag.from_str('display:false') in rf.tags)

  def test_tx_with_equal_src_and_dest(self):
    tx = model.Tx.transfer_funds(
      src=self.src, dest=self.src, asset=self.asset, amount=self.amount,
      safe=True, tags=['test:1', 'asset:btc'])
    self.assertEqual(tx.state, 'in_progress')
    self.assertEqual(self.src.key.get().balance(self.asset), -self.amount)

    model.Tx.roll_forward(tx)
    self.assertEqual(self.src.key.get().balance(self.asset), self.zero)
    self.assertEqual(tx.state, 'finished')
    self.assertEqual(tx.state, tx.other.get().state)

  def test_tx_with_equal_src_and_dest_with_custom_txid(self):
    tx = model.Tx.transfer_funds(
      src=self.src, dest=self.src, asset=self.asset, amount=self.amount,
      safe=True, tags=['test:1', 'asset:btc'], txid='customtxid')
    self.assertEqual(tx.state, 'in_progress')
    self.assertEqual(self.src.key.get().balance(self.asset), -self.amount)

    model.Tx.roll_forward(tx)
    self.assertEqual(self.src.key.get().balance(self.asset), self.zero)
    self.assertEqual(tx.state, 'finished')
    self.assertEqual(tx.state, tx.other.get().state)

  def test_tx_with_custom_timestamp(self):
    created = datetime.datetime.strptime(
      '5/16/2011 0:00:00', '%m/%d/%Y %H:%M:%S')
    tx = model.Tx.transfer_funds(
      src=self.src, dest=self.src, asset=self.asset, amount=self.amount,
      safe=True, tags=['test:1', 'asset:btc'], created=created)
    self.assertEqual(tx.created, created)

  def test_roll_back(self):
    tx = model.Tx.transfer_funds(
      src=self.src, dest=self.dest, asset=self.asset, amount=self.amount, safe=True,
      state='pending')
    self.assertEqual(tx.state, 'pending')
    self.assertEqual(self.src.key.get().balance(self.asset), -self.amount)
    self.assertEqual(self.dest.key.get().balance(self.asset), 0)

    self.assertRaises(Exception, lambda: model.Tx.roll_forward(tx))

    model.Tx.roll_back(key=tx.key)
    tx = tx.key.get()
    self.assertEqual(tx.state, 'canceled')
    self.assertEqual(tx.state, tx.other.get().state)
    self.assertEqual(self.src.key.get().balance(self.asset), 0)

  def test_nsf(self):
    tx = lambda: model.Tx.transfer_funds(
          src=self.src, dest=self.dest, asset=self.asset, amount=self.amount)
    self.assertRaises(model.NonSufficientFundsError, tx)
    self.assertEqual(self.src.key.get().balance(self.asset), 0)

  # def test_pie_sell(self):
  #   self.asset = 'LTC'
  #   self.amount = 15
  #   dest = model.PubKey.get_or_insert('dest', tags=[
  #     model.Tag.from_str('asset.rate:PIE')])
  #   tx = model.Tx.transfer_funds(
  #     src=self.src, dest=dest, asset=self.asset, amount=self.amount,
  #     safe=True, txid='customtxid')

  #   self.assertEqual(tx.state, 'in_progress')
  #   self.assertEqual(self.src.key.get().balance(self.asset), -self.amount)
  #   model.Tx.roll_forward(tx)

  #   self.execute_deferred('tx')

  #   _balance = decimal.Decimal('0.291')

  #   self.assertEqual(model.PubKey.get_by_id('src').balance('PIE'), _balance)
  #   self.assertEqual(
  #     model.PubKey.get_by_id('cyberfund-PIE').balance('PIE'), -_balance)

  # def test_pie_buy(self):
  #   self.asset = 'LTC'
  #   self.amount = 15
  #   src = model.PubKey.get_or_insert('src', tags=[
  #     model.Tag.from_str('asset.rate:PIE')])
  #   tx = model.Tx.transfer_funds(
  #     src=src, dest=self.dest, asset=self.asset, amount=self.amount,
  #     safe=True, txid='customtxid')

  #   model.Tx.roll_forward(tx)

  #   self.execute_deferred('tx')

  #   _balance = decimal.Decimal('0.291')

  #   src = model.PubKey.get_by_id('src')
  #   dest = model.PubKey.get_by_id('dest')
  #   pie = model.PubKey.get_by_id('cyberfund-PIE')

  #   self.assertEqual(src.balance('LTC'), -15)
  #   self.assertEqual(dest.balance('LTC'), 15)
  #   self.assertEqual(dest.balance('PIE'), -_balance)
  #   self.assertEqual(pie.balance('PIE'), _balance)

  # def test_pie_real(self):

  #   mtgox_btc = model.PubKey.get_or_insert('d-mtgox-BTC')
  #   coinmkt_btc = model.PubKey.get_or_insert('d-coinmkt-BTC', tags=[
  #     model.Tag.from_str('asset.rate:PIE')])
  #   btce_btc = model.PubKey.get_or_insert('d-btce-BTC', tags=[
  #     model.Tag.from_str('asset.rate:PIE')])
  #   investments_ltc = model.PubKey.get_or_insert('investments-LTC', tags=[
  #     model.Tag.from_str('asset.rate:exchange')])
  #   btce_ltc = model.PubKey.get_or_insert('d-btce-LTC', tags=[
  #     model.Tag.from_str('asset.rate:PIE')])


  #   tx1 = model.Tx.transfer_funds(
  #     src=mtgox_btc, dest=coinmkt_btc, asset='BTC', amount=decimal.Decimal(2.0),
  #     safe=True, txid='1')

  #   tx2 = model.Tx.transfer_funds(
  #     src=mtgox_btc, dest=coinmkt_btc, asset='BTC', amount=decimal.Decimal(4.0),
  #     safe=True, txid='2')

  #   tx3 = model.Tx.transfer_funds(
  #     src=mtgox_btc, dest=coinmkt_btc, asset='BTC', amount=decimal.Decimal(3.0),
  #     safe=True, txid='3')

  #   tx4 = model.Tx.transfer_funds(
  #     src=mtgox_btc, dest=btce_btc, asset='BTC', amount=decimal.Decimal(3.0),
  #     safe=True, txid='4')

  #   tx5 = model.Tx.transfer_funds(
  #     src=btce_btc, dest=investments_ltc, asset='BTC', amount=decimal.Decimal(1.0),
  #     safe=True, txid='5')

  #   tx6 = model.Tx.transfer_funds(
  #     src=investments_ltc, dest=btce_ltc, asset='LTC', amount=decimal.Decimal(10.0),
  #     safe=True, txid='6')

  #   tx7 = model.Tx.transfer_funds(
  #     src=mtgox_btc, dest=btce_btc, asset='BTC', amount=decimal.Decimal(1.0),
  #     safe=True, txid='7')

  #   model.Tx.roll_forward(tx1)
  #   model.Tx.roll_forward(tx2)
  #   model.Tx.roll_forward(tx3)
  #   model.Tx.roll_forward(tx4)
  #   model.Tx.roll_forward(tx5)
  #   model.Tx.roll_forward(tx6)
  #   model.Tx.roll_forward(tx7)

  #   pretty = lambda b: ['%s: %s' % (s.asset, s.value) for s in b]
  #   pie = model.PubKey.get_by_id('cyberfund-PIE')

  #   print 'd-mtgox-BTC', pretty(mtgox_btc.key.get().balances)
  #   print 'd-coinmkt-BTC', pretty(coinmkt_btc.key.get().balances)
  #   print 'btce_btc', pretty(btce_btc.key.get().balances)
  #   print 'investments_ltc', pretty(investments_ltc.key.get().balances)
  #   print 'btce_ltc', pretty(btce_ltc.key.get().balances)
  #   print
  #   print 'cyberfund-PIE', pretty(pie.balances)

  #   print
  #   print 'PIE rate'
  #   print model.Tx.get_pie_rate(pie)

  #   # self.assertEqual(pie.balance('PIE'), -13)
  #   self.assertEqual(pie.balance('LTC'), 10)
  #   self.assertEqual(pie.balance('BTC'), 12)

if __name__ == '__main__':
  unittest.main()
