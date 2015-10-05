Template['welcome'].events({
  'click .login-button': function (e, t) {
      analytics.track('Sign in', {
        from: 'welcome'
      });
      Meteor.loginWithTwitter({
        loginStyle: 'redirect'
      })
  }
});