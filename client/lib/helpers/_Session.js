// provides memoizing of session values. depends on 'amplify' script/package
// simply use _Session instead of Session to store global things, like
// sorting preference etc

// using session as it already reactive. and storing changes via amplify
_Session = {
  _prefixKey: 'Session|'
};

/**
 * loads value from
 * @param key
 */
_Session.get = function (key) {
  return amplify.store(_Session._prefixKey + key);
};

_Session.set = function (key, value) {
  amplify.store(_Session._prefixKey + key, value);
};

_Session.default = function (key, value) {
  if (_Session.get(key) == undefined) _Session.set(key, value);
};
