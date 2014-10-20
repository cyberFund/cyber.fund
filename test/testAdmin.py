import unittest
from google.appengine.ext import testbed
from google.appengine.datastore import datastore_stub_util
import model
import admin
import _temp


class TestAdmin(unittest.TestCase):

  def setUp(self):
    self.testbed = testbed.Testbed()
    self.testbed.activate()
    self.policy = datastore_stub_util.PseudoRandomHRConsistencyPolicy(
      probability=0)
    self.testbed.init_datastore_v3_stub(consistency_policy=self.policy)
    self.amount = 15
    self.zero = 0
    self.BTC = 'BTC'
    self.src_balance = 0

  def tearDown(self):
    self.testbed.deactivate()

if __name__ == '__main__':
  unittest.main()
