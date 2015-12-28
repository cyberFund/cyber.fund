CF.tooltip = CF.tooltip || {}

CF.tooltip.fire = function(action) {
  action();
}

CF.tooltip.timer = {
  state: 'idle',
  keeper: null,
  hostInstance: null,
  stop: function() {
    this.state = 'idle';
    if (this.keeper) Meteor.clearTimeout(this.keeper);
  },
  reset: function(action, timeLeft) {
    this.stop();
    this.keeper = Meteor.setTimeout(function() {
      action();
    }, timeLeft);
  },
  };
