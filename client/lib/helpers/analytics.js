var helpers = {
  segmentIoPublicKey: function() {
    try {
      return Meteor.settings.public
        .analyticsSettings["Segment.io"].apiKey
    } catch (e) {
      return "not found";
    }
  }
};

_.each(helpers, function(helper, key) {
  Template.registerHelper(key, helper);
});
