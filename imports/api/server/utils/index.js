// #
import Future from 'fibers/future';

var exp = {
  /**
   * aimed to return resolved promises from methods. i.e. if method uses promises inside
   * , we can use `return extractFromPromise(promise)` to return value from method, not promise.
   * @param promise - promise
   * @returns promise {*}
   */
  extractFromPromise: function (promise, callback) {
    if (promise.then && typeof promise.then === 'function') {
      console.log(789789879879789879)
      promise.then(function)
      var fut = new Future();
      promise.then(function(result) {
        fut["return"](result);
      }, function(error) {
        fut["throw"](error);
      });
      return fut.wait();
    } else { //in case promise already resolved
      console.log(234234234234)
      return promise;
    }
  },
  escapeRegExp: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
}

module.exports = exp;
