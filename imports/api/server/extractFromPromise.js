"use strict";

/**
 * aimed to return resolved promises from methods. i.e. if method uses promises inside
 * , we can use `return extractFromPromise(promise)` to return value from method, not promise.
 * @param promise - promise
 * @returns promise {*}
 */
import Future from 'fibers/future'

export default function extractFromPromise(promise) {
  if (promise.then) {
    var fut = new Future();
    promise.then(function (result) {
      fut["return"](result);
    }, function (error) {
      fut["throw"](error);
    });
    return fut.wait();
  } else { //in case promise already resolved
    return promise;
  }
}
