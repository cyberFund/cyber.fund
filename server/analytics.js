Meteor.methods({
  _trackAnalytics: function(params){
    _.extend(params, {
      userId: this.userId || 'anonymous'
    });

    analytics.track(params);
  }
});
