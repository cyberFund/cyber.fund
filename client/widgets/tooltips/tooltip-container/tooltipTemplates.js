import cfTooltip from '/imports/api/client/tooltip'
Template["withTooltip"].events({
  "mouseenter .with-tooltip": function(e, t) {
    if (!t.data || !t.data.ttName) return true;

    cfTooltip.timer && (cfTooltip.timer.hostInstance = t) &&

      cfTooltip.timer.reset(function() {
        cfTooltip.fire(function() {
          if (!cfTooltip.instance) {
            cfTooltip.instance =
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
    cfTooltip.timer && cfTooltip.timer.stop();
    if (cfTooltip.instance) {
      Blaze.remove(cfTooltip.instance);
      cfTooltip.instance = null;
    }
  }
});

Template["tooltipContainer"].helpers({
  "tooltipStyleClass": function(kls) {
    return cfTooltip.styleClass(kls);
  },
  getData: function() {
    var ret = _.clone(this.data);
    _.extend(ret, {_period: this._period}); //dirty.
    return ret;
  }
});
