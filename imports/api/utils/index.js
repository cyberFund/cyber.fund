module.exports = {
  _k: function _k(array) {
    return array.join('.');
  },
  normalizeOptionsPerUser: function normalizeOptionsPerUser(options) {
    options = options || {}
    if (typeof options == 'string') //suppose it s username
      options = {
      username: options
    }

    if (options.username)
      options.userId = CF.User.idByUsername(options.username)
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
  }
}
