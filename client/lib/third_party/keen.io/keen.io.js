var keenflag = new ReactiveVar();

Meteor.startup(function() {
  if (Keen) {
    Keen.ready(function() {
      keenflag.set(true);
    });
  }
});

Template['keenIo'].onRendered(function() {
  var instance = this;
  var client = new Keen({
    projectId: "55c8be40d2eaaa07d156b99f",
    readKey: "4083b4d7a1ce47a40aabf59102162e3848d0886d457e4b9b57488361edfa28a1e49d2b100b6008299aa38303cd6254d4aa993db64137675d9d8d65928f283573c3932f413ec06050e8e3e9a642485cb6090d742d84da78f247aeb05f709e69f6c2085e9324a277e654bb12434f094412"
  });

  instance.autorun(function() {
    if (!keenflag.get()) return;
    var key = FlowRouter.getParam("name_");
    if (!key) return;

    // Create a query instance
    var count = new Keen.Query("count", {
      eventCollection: "Viewed System Page",
      filters: [{
        "operator": "contains",
        "property_name": "path",
        "property_value": key
      }],
      interval: "daily",
      timeframe: "this_21_days"
    });

    // Basic charting w/ `client.draw`:
    client.draw(
      count,
      document.getElementById(Template.currentData().id || 'keen-chart'),
      {
        chartType: "columnchart",
        title: "Page Visits",
        label: 'test'
      });
  })
})
