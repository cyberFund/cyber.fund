Template['welcome'].events({
  'click .login-button': function (e, t) {
      Meteor.loginWithTwitter({
        loginStyle: 'redirect'
      })
  }
});