Template['tooltipContainer'].onRendered(function() {
  //dynamic render, see .with-tooltip class
  console.log("rendered tooltip of class " + this.data.class || "");
});

var ww = 0
Template['withTooltip'].onRendered(function() {
  console.log("tooltips: " + ww++ );
});

var ttt = 0;
Template['tooltip'].onRendered(function() {
  // dynamic only renders per hover, i.e. one template instance is present

  console.log("static tooltips: " + ttt++);
});

Template['withTooltip'].helpers({ // "" => ".tooltip-default
  'tooltipStyleClass': CF.tooltip.styleClass
})

CF.tooltip.styleClass =function(kla) { // "der-klazz" => ".tooltip-der-klaaz"
 kla = kla | 'default';
 return ['tooltip', kla].join("-");
}

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
