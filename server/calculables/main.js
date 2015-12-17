Meteor.startup(function() {
  if (Meteor.settings.byPassStartupCalculations) {
    console.log ("initial calculations of CurrentData.calculables were disabled from meteor settings");
    return;
  }
  CF.CurrentData.calculatables.triggerCalc('firstDatePrice');
  CF.CurrentData.calculatables.triggerCalc('nLinksWithTag');
  CF.CurrentData.calculatables.triggerCalc('RATING');
});
