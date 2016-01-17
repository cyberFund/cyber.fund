var ns = CF
// for reporting purpose. var nsn = "CF"

//I: Isolation

ns .tooltip = ns.tooltip || {}

ns.tooltip .fire = function(action) {
  action();
}

//S: Stylesheet

ns.tooltip .styleClass =function(kla) { // "der-klazz" => ".tooltip-der-klaaz"
 kla = kla || 'default'; // "" => ".tooltip-default"
 return ['tooltip', kla].join("-");
} // note this only prepends _first_ klassname, and rest of them go unchanged //

//T: Timer

// this one implements simple wait for mouse pointer being inside
// chosen element for 300 milliseconds

ns.tooltip .timer = {

  // too old for this stuff   state: 'idle',
  keeper: null,
  hostInstance: null,

  stop: function() {
    if (this.keeper)
    {
      this.state = "clearing timeout on stop"
      Meteor.clearTimeout(this.keeper);
    }
    // this.state = 'idle';
  },

  getParentObject: function() { return ns.tooltip; },

  reset: function(action, timeLeft) {
    this.stop();
    var i = this, p = i.getParentObject();
    this.keeper = Meteor.setTimeout(function() {
       p.fire (action);
    }, timeLeft);
  }
}
