var helpers = {
  segmentIoPublicKey: function() {
    return Meteor.settings.public
    && Meteor.settings.public.analytics
    && Meteor.settings.public.analytics["Segment.io"]
    && Meteor.settings.public.analytics["Segment.io"].apiKey
    || "not found";
  }
};

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
