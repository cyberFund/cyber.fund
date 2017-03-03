import {findByUsername, idByUsername} from '/imports/api/utils/user'

var exp = {
  _k: function _k(array) {
    return array.join('.');
  },
  normalizeOptionsPerUser: function (options) {
    options = options || {}
    if (typeof options == 'string') //suppose it s username
      options = {
      username: options
    }

    if (options.username)
      options.userId = findByUsername(options.username) ? findByUsername(options.username)._id : options.username
    if (!options.userId) {
      if (options.uid) {
        console.log("subscriptions:normalizeOptionsPerUser - .uid was passed, please pass .userId instead");
        options.userId = options.uid
      }
      if (options._id) {
        console.log("subscriptions:normalizeOptionsPerUser - ._id was passed, please pass .userId instead");
        options.userId = options._id
      }
    }
    return options
  },

  /**
   *
   * @param obj
   * @returns {{}} object with keys flattened. ok to use in conjunction with
   * collection.update({..}, {$set: flatten(obj)})
   */
  flatten: function(obj) {
    if (!_.isObject(obj)) return;

    var result = {};

    function add(key, prop) {
      result[key] = prop;
    }

    function iter(currentKey, object) {
      _.each(object, function(v, k) {

        var key = currentKey ? currentKey + "." + k : k;
        if (_.isArray(v)) {
          add(key, v);
        } else {
          if (_.isObject(v) && !(_.isDate(v) || _.isArray(v)) ) {
            iter(key, v);
          } else {
            add(key, v);
          }
        }
      });
    }

    iter("", obj);
    return result;
  }
}

module.exports = exp;
