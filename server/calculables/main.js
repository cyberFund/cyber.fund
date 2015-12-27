Meteor.startup(function() {
  if (Meteor.settings.byPassStartupCalculations) {
    console.log ("initial calculations of CurrentData.calculables were " +
      "disabled from meteor settings");
    return;
  }
  CF.CurrentData.calculatables.triggerCalc('firstDatePrice');
  CF.CurrentData.calculatables.triggerCalc('nLinksWithTag');
  CF.CurrentData.calculatables.triggerCalc('nLinksWithType');
  CF.CurrentData.calculatables.triggerCalc('RATING');



  var print = CF.Utils.logger.print
  print ("settings", Meteor.settings)
  if (Meteor.settings.printCF) print ("CF", CF);

});
