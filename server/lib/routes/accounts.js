// todo: dispose of

import {CurrentData} from '/imports/api/collections'
import Acounts from '/imports/api/collections/Acounts'
import {findByUsername} from '/imports/api/utils/user'
import url from 'url'
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
    description: "currently, api paths are prefixed with /api03/\n" +
        "/api03/account/:_id returns data for certain account;\n" +
        "/api03/username/:username/accounts  returns list of public account ids \n" +
        "/api03/username/:username/accounts/full  returns list of public accounts \n\n" +
        "private accounts are currently invisible.\n\n\n"+
        "/api03/crowdsale/:system_name return s crowdsale part of certain system - if any. Within system name spaces d converted to underscores.\n"+
        "/api03/cyberrating/top25 returns basic metrics of top cyberrated systems\n"
}

var drink = function(bottle, label, args) {
    //todo traverse dotted names.
    var drop = bottle[label];
    if (typeof drop == 'function') return drop.apply(bottle, args);
    return drop
}

///////////////////////// querystrings domain

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

                return result.meta[item] = drink(bottle, item, drinkmap)
            } // result.meta[item] =

          //  if (debug) print("key", keyId, true)
          //  if (debug) print("item", item)
            result.meta[item] = drink(bottle, item)
        })
        // if (debug) print("whole urlqueryparams", options.meta)
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
var getAccountIdsByUsername = function(username, options) {
    //only allow publics until auth/security for apis are not established.
    var user = findByUsername(username);
    if (!user) return [];

    return Acounts.find({
        refId: user._id,
        isPrivate: {
            $ne: true
        }
    }).map(function(account) {
        return account._id;
    })
}

var getAccountsByUsername = function(username, options) {
    //only allow publics until auth/security for apis are not established.
    var user = findByUsername(username);
    if (!user) return [];

    return Acounts.find({
        refId: user._id,
        isPrivate: {
            $ne: true
        }
    }).fetch()
}


//////////////////////////////////// routes domain

Picker.route('/api03/account/:_id', function(params, req, res, next) {
    var bottle = accountsApi;
    var options = normalizeOptions(url.parse(req.url, true).query);

    var ret = Acounts.findOne(getAccountById(params._id, options)) || {
        error: "not found",
        NB: "private accounts not working yet"
    };

    if (ret.meta) {
        _.extend(ret.meta, {
            request: {
                _id: params._id
            }
        }); // todo: log instead echoing
    }

    ret = applyOptionsFinal(bottle, ret, options);
    res.end(JSON.stringify(ret, null, (options.pretty ? options.tabs ?
        parseInt(options.tabs) : 2 : null)));
});
// todo: middleware
Picker.route('/api03/username/:username/accounts', function(params, req, res, next) {
    var bottle = accountsApi;
    var options = normalizeOptions(url.parse(req.url, true).query);

    var ret = {
        accounts: getAccountIdsByUsername(params.username, options)
    }

    ret = applyOptionsFinal(bottle, ret, options);
    if (ret.meta) {
        _.extend(ret.meta, {
                request: {
                    username: params.username
                }
            }) // todo: log instead echoing
    }
    res.end(JSON.stringify(ret, null, (options.pretty ? options.tabs ?
        parseInt(options.tabs) : 2 : null)));
});

Picker.route('/api03/username/:username/accounts/full', function(params, req, res, next) {
    var bottle = accountsApi;
    var options = normalizeOptions(url.parse(req.url, true).query);

    var ret = {
        accounts: getAccountsByUsername(params.username, options)
    }

    ret = applyOptionsFinal(bottle, ret, options);
    if (ret.meta) {
        _.extend(ret.meta, {
                request: {
                    username: params.username
                }
            }) // todo: log instead echoing
    }
    res.end(JSON.stringify(ret, null, (options.pretty ? options.tabs ?
        parseInt(options.tabs) : 2 : null)));
});

Picker.route('/api03/crowdsale/:system_name', function(params, req, res, next) {
    var options = normalizeOptions(url.parse(req.url, true).query);
    var getSystem = function(system_name){
      return CurrentData.findOne({_id: system_name.replace(/\_/g, ' ')}, {fields: {crowdsales: 1, metrics: 1}}) || {
        error: "not found"
      };
    }
    var ret = getSystem(params.system_name);
    res.setHeader('Content-Type', 'application/json');
    ret = JSON.stringify(ret, null, (options.pretty ? options.tabs ?
        parseInt(options.tabs) : 2 : null))

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(ret)),
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = 200;
    res.end(ret);
});

Picker.route('/api03/cyberrating/top25', function(params, req, res, next) {
    var options = normalizeOptions(url.parse(req.url, true).query);
    var data = CurrentData.find({"calculatable.RATING.sum": {$gt: 1.4}},
    {fields: {"metrics.cap":1, "metrics.price":1, "metrics.supply":1,
      "metrics.tradeVolumePrevious.month": 1,
      "calculatable.RATING.sum": 1, "calculatable.RATING.vector.LV.num":1},
    sort: {"metrics.cap.btc":-1}, limit: 30})

    var ret = data.fetch()

    res.end(JSON.stringify(ret, null, (options.pretty ? options.tabs ?
        parseInt(options.tabs) : 2 : null)));
});


Picker.route('/api03', function(params, req, res, next) {
    res.end(drink(accountsApi, 'description'));
});

import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';
import {Extras} from '/imports/api/collections'
console.log('scriptspath', process.env.CF_SCRIPTS_PATH);

if (process.env.CF_SCRIPTS_PATH) {
  Picker.route('/webhooks/github/01', function(params, req, res, next) {
      if (req.method == 'POST') {
          console.log("new push to chaingear repo detected. ");
          var scriptToRun = path.join(process.env.CF_SCRIPTS_PATH, 'chg-update.sh');
          fs.exists(scriptToRun, Meteor.bindEnvironment(function(exists) {
              if (exists) {
                  exec(scriptToRun, function(error, stdout, stderr) {
                      console.log(stdout, stderr, error)
                  });
                  //Extras.remove({ _id: 'chaingearEtag'});
              }
              else {
                  console.error("NO SCRIPT TO HANDLE CHAINGEAR PUSH EXISTS");
              }
          }));
      }
      res.end("ok")
  });
}
