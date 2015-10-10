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

  var value = amplify.store(_Session._prefixKey + key);

  var valueS = Session.get(key);

  if (value != valueS) { // needs sync

    if (value == undefined) { // if !saved at amplify
      // write session value to amplify store
      amplify.store(_Session._prefixKey + key, valueS);
      return valueS;
    }
    else { //if amplify differs from session
      Session.set(key, value); //write store value to session
      return Session.get(key);
    }
  }

  return valueS; //probably weird, but will work after they sync.
};

_Session.set = function (key, value) {
  amplify.store(_Session._prefixKey + key, value);
  Session.set(key, value);
};

_Session.default = function (key, value) {
  var v = _Session.get(key);
  if ((v == undefined) && (value != undefined)) {
    _Session.set(key, value);
  }
};