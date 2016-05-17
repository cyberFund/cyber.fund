Meteor.startup(function () {
  CF.Utils._session.default("coinSorter", {"metrics.cap.btc": -1});
});
