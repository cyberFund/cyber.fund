Template['tooltipContainer'].onRendered(function() {
  console.log("rendered tooltip of class " + this.data.class || "");
});

Template['tooltipContainer'].helpers({
  'tooltipStyleClass': CF.tooltip.styleClass
})

Template['withTooltip'].events({
  'click .with-tooltip': function(e, t) {},

  'mouseenter .with-tooltip': function(e, t) {
    if (!t.data || !t.data.ttName) return true;

    CF.tooltip.timer && (CF.tooltip.timer.hostInstance = t) &&

    CF.tooltip.timer.reset(function() {
      CF.tooltip.fire(function() {
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
