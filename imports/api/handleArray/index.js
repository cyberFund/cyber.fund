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
