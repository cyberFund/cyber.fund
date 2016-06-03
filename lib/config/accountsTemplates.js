/*AccountsTemplates.configure({
  texts: {
    navSignIn: "log in",
    navSignOut: "log out",
    socialSignIn: "try beta",

    title: {
      signIn: "Sign In",
    }
  },
  hideSignUpLink: false,
  enablePasswordChange: true,
  showForgotPasswordLink: true
});

// Options
AccountsTemplates.configure({
  defaultLayout: 'layoutFullWidth',
  defaultLayoutRegions: {},
  defaultContentRegion: 'main',
  defaultLayoutRegions: {
       nav: 'navbar',
       footer: 'footer'
   },
  //defaultLayout: 'emptyLayout',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,
  sendVerificationEmail: false,

  //enforceEmailVerification: true,
  //confirmPassword: true,
  //continuousValidation: false,
  //displayFormLabels: true,
  //forbidClientAccountCreation: false,
  //formValidationFeedback: true,
  homeRoutePath: '/',
  showAddRemoveServices: true,
  //showPlaceholders: true,

  negativeValidation: true,
  positiveValidation:true,
  negativeFeedback: true,
  positiveFeedback:true,

  // Privacy Policy and Terms of Use
  //privacyUrl: 'privacy',
  //termsUrl: 'terms-of-use',
  //texts: {

  //},

});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');

AccountsTemplates.configureRoute('signIn', {
  redirect: '/profile'

});
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');




if (Meteor.isServer){
    Meteor.methods({
        "userExists": function(username){
            return !!Meteor.users.findOne({username: username});
        },
    });
}

AccountsTemplates.addField({
    _id: 'username',
    type: 'text',
    required: true,
    minLength: 3,
    placeholder: {
        signUp: "At least four characters"
    },
    func: function(value){
        if (Meteor.isClient) {
            console.log("Validating username...");
            var self = this;
            Meteor.call("userExists", value, function(err, userExists){
                if (!userExists)
                    self.setSuccess();
                else
                    self.setError(userExists);
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("userExists", value);
    },
});
*/
