var helpers = {
  segmentIoPublicKey: function() {
    return Meteor.settings
    && Meteor.settings.public
    && Meteor.settings.public["Segment.io"]
    && Meteor.settings.public["Segment.io"].apiKey
    || "not found";
  }
};

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
