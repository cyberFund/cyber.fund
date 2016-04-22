Template['welcome'].events({
  'click .login-button': function (e, t) {
      analytics.track('redirect to Sign In', {
        from: 'welcome'
      });
      FlowRouter.go('/sign-in')/*Meteor.loginWithTwitter({
        loginStyle: 'redirect'
      })*/
  }
});
