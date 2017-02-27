import {amplify} from 'amplify'
// provides memoizing of session values. depends on 'amplify' script/package
// simply use _session instead of Session to store global things, like
// sorting preference etc

console.log(amplify)

export default _session = {
  _prefixKey: "Session|",

  /**
   * loads value from
   * @param key
   */
  get: function(key) {
    const _session = this;
    ret = amplify.store(_session._prefixKey + key);
    if (Session.get(key) != ret) Session.set(key, ret);
    return ret;
  },

  set: function(key, value) {
    const _session = this;
    amplify.store(_session._prefixKey + key, value);
    Session.set(key, value);
  },

  default: function(key, value) {
    const _session = this;
    if (_session.get(key) == undefined) _session.set(key, value);
  }
};
