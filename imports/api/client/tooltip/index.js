import {Meteor} from 'meteor/meteor'
var tooltip = {}

tooltip.fire = function (action) {
  action();
}

//S: Stylesheet

tooltip.styleClass = function (kla) { // "der-klazz" => ".tooltip-der-klazz"
  kla = kla || 'default'; // "" => ".tooltip-default"
  return ['tooltip', kla].join("-");
} // note this only prepends _first_ klassname, and rest of them go unchanged //

//T: Timer

// this one implements simple wait for mouse pointer being inside
// chosen element for 300 milliseconds

tooltip.timer = {

  // too old for this stuff   state: 'idle',
  keeper: null,
  hostInstance: null,

  stop: function () {
    if (this.keeper) {
      this.state = "clearing timeout on stop"
      Meteor.clearTimeout(this.keeper);
    }
    // this.state = 'idle';
  },

  getParentObject: function () {
    return tooltip;
  },

  reset: function (action, timeLeft) {
    this.stop();
    var i = this,
      p = i.getParentObject();
    this.keeper = Meteor.setTimeout(function () {
      p.fire(action);
    }, timeLeft);
  }
}

module.exports = tooltip
