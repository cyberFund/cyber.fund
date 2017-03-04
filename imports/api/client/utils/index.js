import { Session } from 'meteor/session'
var SessionVariable = function(key) {
  if (!key) throw ("no key provided for SessionVariable constructor");
  var me = this;
  this._sessname = key;

  this.get = function() {
    return Session.get(me._sessname);
  };
  this.set = function(v) {
    Session.set(me._sessname, v);
  };
};

var cfCurrentAddress = new SessionVariable("cfAccountsCurrentAddress");
var cfCurrentAsset = new SessionVariable("cfAccountsCurrentAsset");
var cfCurrentId = new SessionVariable("cfAccountsCurrentId");

module.exports = {
  SessionVariable: SessionVariable,
  cfCurrentAsset: cfCurrentAsset,
  cfCurrentAddress: cfCurrentAddress,
  cfCurrentId: cfCurrentId,
}
