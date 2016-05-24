// data array; function to handle single item; delay in ms.
// suitable for small arrays, and when we re sure calls won't interfere one another
// (i.e. call period > delay*array.length)
exports.handleArrayWithInterval = function handleArrayWithInterval(array, delay, handler, handlerAfter){
  if (delay) {
    var current = 0;
    var length = array.length;

    var interval = Meteor.setInterval(function(){
      if (current < length) {
        var item = array[current];
        handler(item);
        ++current;
      } else {
        Meteor.clearInterval(interval);
        if (handlerAfter) handlerAfter(array);
      }
    }, delay);
  } else { // no delay

    _.each(array, function(item){
      handler(item);
    });
    if (handlerAfter) handlerAfter(array);
  }
};
