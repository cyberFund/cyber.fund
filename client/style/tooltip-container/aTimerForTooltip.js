var ns = CF
var nsn = "CF"

//I: Isolation

ns .tooltip = ns.tooltip || {}

ns.tooltip .fire = function(action) {
  action();
}

ns.tooltip .getParentInstance = function() {return ns; }

// lol this makes ns CIRCULAR thru ns.tooltip.parent
// however is pretty illustration for caching function call results
Meteor.startup(function(){
  //ns.tooltip .parent = ns.tooltip.getParentInstance()
  //delete ns.tooltip.parent
  console.log( "CF: ", CF);  
})



ns.tooltip .analysis = function(){
  return _.keys [ns.parent];
}

//S: Stylesheet
ns.tooltip .styleClass = function(kla) { // "der-klazz" => ".tooltip-der-klaaz"
  kla = kla | 'default'; // "" => "tooltip-default"
  return ['tooltip', kla].join("-");
}

//T: Timer

// this one implements simple wait for mouse pointer being inside
// chosen element for 300 milliseconds

ns.tooltip .timer = {

  state: 'idle',
  keeper: null,
  hostInstance: null,

  stop: function() {
    if (this.keeper)
    {
      this.state = "clearing timeout on stop"
      Meteor.clearTimeout(this.keeper);
    }
    this.state = 'idle';
  },

  reset: function(action, timeLeft) {
    this.stop();

    var i = this, p = i.getParentInstance();

    this.keeper = Meteor.setTimeout(function() {
       p.fire (action);
    }, timeLeft);
  },
  getParentInstance: function() { return ns.tooltip; }
}
