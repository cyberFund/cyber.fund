

// provides memoizing of session values. depends on 'amplify' script/package
// simply use _session instead of Session to store global things, like
// sorting preference etc

// using session as it already reactive. and storing changes via amplify
const _session = {
  _prefixKey: "Session|",

  /**
   * loads value from
   * @param key
   */
  get: function(key) {
    ////  ret = amplify.store(_session._prefixKey + key);
    ////  if (Session.get(key) != ret) Session.set(key, ret);
    ////  return ret;
    return Session.get(key)
  },

  set: function(key, value) {
    ////  amplify.store(_session._prefixKey + key, value);
    ////  Session.set(key, value);
    Session.set(key, value);
  },

  default: function(key, value) {
    if (_session.get(key) == undefined)
      _session.set(key, value);
    }
  };



export {
  _session
}
