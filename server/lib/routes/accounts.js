var url = Meteor.npmRequire('url');
var print = CF.Utils.logger.print;
var debug = false;

/////////////////////  vending machine domain
var accountsApi = {
  version: "0.125",
  double: function(item) {
    if (typeof item == "string")
      try {
        item = parseFloat(item);
      } catch (e) {
        return "2*" + item;
      }
    if (typeof item == "number")
      return (2 * item).toString()
  },
  description: "currently, api paths are prefixed with /api03/\n"+
    "/api03/account/:_id returns data for certain account;\n" +
    "/api03/username/:username/accounts  returns list of public accounts\n\n" +
    "private accounts are currently invisible."
}

var drink = function(bottle, label, args) {
  //todo traverse dotted names.
  var drop = bottle[label];
  if (typeof drop == 'function') return drop.apply(bottle, args);
  return drop
}

///////////////////////// querystrings domain
Meteor.startup(function() {
  //print ('double accountsApi.version', drink( accountsApi, 'double', [drink (accountsApi, 'version')]) );
})

// comma separated string (no spaces so far..), not css
var cssToArray = function(str) {
   return (typeof str == 'string') ? str.split(',') : str;
}

// if passed single string (not array) - pretend it s ,-split
// expecting query string' s value

var qpvToArray = function(query, key) {
  if (query[key]) {
    query[key] = cssToArray(query[key])
  }
  return query;
}

// turn strings to arrays where needed
var normalizeOptions = function normalizeOptions(options) {
  options = qpvToArray(options, 'meta');
  return options;
}

var extractParams = function(qpv) {
  var match = qpv.match(/\((.*?)\)/)
  return match;
}

var applyOptionsFinal = function applyOptionsFinal(bottle, result, options) {
  if (options.meta) {
    result.meta = result.meta || {}

    options.meta.forEach(function(item, keyId) {
      var gotcha = extractParams(item);
      if (gotcha) {
        var drinkmap = cssToArray(gotcha[1]).map(function(param) {
          return drink(bottle, param)
        });
        var item = item.slice(0, gotcha["index"]);

        if (debug) print("gotcha", extractParams(item), true)
        if (debug) print("item", item, true);
        if (debug) print("drinkmap", drinkmap)

        return result.meta[item] = drink(bottle, item, drinkmap)
      } // result.meta[item] =

      if (debug) print("key", keyId, true)
      if (debug) print("item", item)
      result.meta[item] = drink(bottle, item)
    })
    if (debug) print("whole urlqueryparams", options.meta)
  }
  return result;
}


/////////////////////////////// subject area domain
// 1
var getAccountById = function(_id, options) {
  //only allow publics until auth/security for apis are not established.
  return {
    _id: _id,
    isPrivate: {
      $ne: true
    }
  }
}

// 2
var getAccountIdsByUsername = function (username, options) {
  //only allow publics until auth/security for apis are not established.
  var user = CF.User.findOneByUsername(username);
  if (!user) return [];

  return CF.Accounts.collection.find({
    refId: user._id,
    isPrivate: {$ne: true}
  }).map(function(account){
    return account._id;
  })
}


//////////////////////////////////// routes domain

Picker.route('/api03/account/:_id', function(params, req, res, next) {
  console.log('here')
  var bottle = accountsApi;
  var options = normalizeOptions(url.parse(req.url, true).query);

  var ret = CF.Accounts.collection.findOne(getAccountById(params._id, options)) || {
    error: "not found",
    NB: "private accounts not working yet"
  };

  if (ret.meta) {
    _.extend(ret.meta, {request: {_id: params._id}}); // todo: log instead echoing
  }

  ret = applyOptionsFinal(bottle, ret, options);
  res.end(JSON.stringify(ret, null, (options.pretty ? options.tabs ?
    parseInt(options.tabs) : 2 : null)));
});
        // todo: middleware
Picker.route('/api03/username/:username/accounts', function(params, req, res, next){
  var bottle = accountsApi;
  var options = normalizeOptions(url.parse(req.url, true).query);

  var ret = {accounts: getAccountIdsByUsername(params.username, options)}

  ret = applyOptionsFinal(bottle, ret, options);
  if (ret.meta) {
    _.extend(ret.meta, {request: {username: params.username}}) // todo: log instead echoing
  }
  res.end(JSON.stringify(ret, null, (options.pretty ? options.tabs ?
    parseInt(options.tabs) : 2 : null)));
});

Picker.route('/api03', function(params, req, res, next){
  res.end(drink(accountsApi, 'description'));
});

Picker.route('/webhooks/github/01', function(params, req, res, next){
    if (req.method=='POST') {
        console.log ("hoooooooooook ")
        Extras.remove({_id:'chaingearEtag'});
        console.log(Extras.find({_id:'chaingearEtag'}))
        res.end("ok")
    }
    else res.end('ok')
});
