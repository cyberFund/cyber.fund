// data array; function to handle single item; delay in ms.
// suitable for small arrays, and when we re sure calls won't interfere one another
// (i.e. call period > delay*array.length)
import {Meteor} from 'meteor/meteor'
exports.handleArrayWithInterval = function handleArrayWithInterval(array, delay, handler, handlerAfter){

  function withDelay(array, delay, handler, handlerAfter){

    const length = array.length;
    var current = 0;
    var callbacksCount = 0;
    var callbacksAverage = 0;

    function callbackCounter(){
        --callbacksCount;
        callbacksAverage += callbacksCount/length;
        if (current === length) {
          //print("callbacksAverage", callbacksAverage)
        }
    }

    var interval = Meteor.setInterval(function(){
      if (current < length) {
        var item = array[current];
        ++callbacksCount;
        ++current;
        handler(item, callbackCounter);
      } else {
        Meteor.clearInterval(interval);
        if (handlerAfter) handlerAfter(array, function(){
          //print("done pushing items to handler, handled items", current)
        });
      }
    }, delay);
  }

  function withoutDelay(array, handler, handlerAfter){
    _.each(array, function(item){
      handler(item);
    });
    if (handlerAfter) handlerAfter(array);
  }

  if (delay) {
    withDelay(array, delay, handler, handlerAfter);
  } else {
    withoutDelay(array, handler, handlerAfter);
  }
};
