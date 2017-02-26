
export default function SessionVariable(key) {
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
