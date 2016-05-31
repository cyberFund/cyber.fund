Template["withTooltip"].events({
  "mouseenter .with-tooltip": function(e, t) {
    if (!t.data || !t.data.ttName) return true;

    CF.tooltip.timer && (CF.tooltip.timer.hostInstance = t) &&

      CF.tooltip.timer.reset(function() {
        CF.tooltip.fire(function() {
          if (!CF.tooltip.instance) {
            CF.tooltip.instance =
              Blaze.renderWithData(Template["tooltipContainer"], {
                ttName: t.data.ttName,
                data: _.extend(_.clone(t.data.data), {_period: t.data._period}),
                class: t.data.class
              }, t.$(".with-tooltip")[0]);
          }
        }, 300);
      });

    return false;
  },

  "mouseleave .with-tooltip": function(e, t) {
    CF.tooltip.timer && CF.tooltip.timer.stop();
    if (CF.tooltip.instance) {
      Blaze.remove(CF.tooltip.instance);
      CF.tooltip.instance = null;
    }
  }
});

Template["tooltipContainer"].helpers({
  "tooltipStyleClass": function(kls) {
    return CF.tooltip.styleClass(kls);
  },
  getData: function() {
    var ret = _.clone(this.data);
    _.extend(ret, {_period: this._period}); //dirty.
    console.log(ret);
    console.log(this);
    return ret;
  }
});
