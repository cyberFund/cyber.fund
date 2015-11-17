Template['welcome'].events({
  'click .login-button': function (e, t) {
      analytics.track('Sign In', {
        from: 'welcome'
      });
      Meteor.loginWithTwitter({
        loginStyle: 'redirect'
      })
  }
});