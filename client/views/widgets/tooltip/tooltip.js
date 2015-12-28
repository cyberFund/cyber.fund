CF.tooltip = CF.tooltip || {}
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
  fire: function(action) {
    action();
  }

};

Template['withTooltip'].onRendered(function() {})

Template['withTooltip'].helpers({
  'tooltipStyleClass': function(kla) {
    ret = ['tooltip'];
    ret.push(kla ? kla : 'default');

    CF.Utils.logger.print("class for tooltip", kla, true)
    CF.Utils.logger.print("ret len", ret)
    return ret.join("-");
  }
})

Template['withTooltip'].events({
  'click .with-tooltip': function(e, t) {},

  'mouseenter .with-tooltip': function(e, t) {
    t.data && t.data.ttName || function(){
      var print = CF.Utils.logger.print;
      print("t.data", t.data);
      return true;
    }();

    CF.tooltip.hostInstance = t;
    CF.tooltip.timer && CF.tooltip.timer
      .reset(function() {
        CF.tooltip.timer.fire(function() {
          if (!CF.tooltip.instance) {
            CF.tooltip.instance =
              Blaze.renderWithData(Template['tooltipContainer'], {
                ttName: t.data.ttName,
                data: t.data.data,
                class: t.data.class
              }, t.$(".with-tooltip")[0])
          }
        }, 300);
      });
      return false;
  },

  'mouseleave .with-tooltip': function(e, t) {
    CF.tooltip.timer && CF.tooltip.timer.stop()
    if (CF.tooltip.instance) {
      Blaze.remove(CF.tooltip.instance);
      CF.tooltip.instance = null;
    }
  }
})
