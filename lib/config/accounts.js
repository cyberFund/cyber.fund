AccountsTemplates.configure({
  texts: {
    button: {
      changePwd: "Password Text",
      enrollAccount: "Enroll Text",
      forgotPwd: "Forgot Pwd Text",
      resetPwd: "Reset Pwd Text",
      signIn: "Sign In Text",
      signUp: "Sign Up Text",
    }
  }
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

// Options
AccountsTemplates.configure({
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
  //homeRoutePath: '/',
  //showAddRemoveServices: false,
  //showPlaceholders: true,

  negativeValidation: true,
  positiveValidation:true,
  negativeFeedback: false,
  positiveFeedback:false,

  // Privacy Policy and Terms of Use
  //privacyUrl: 'privacy',
  //termsUrl: 'terms-of-use',
  //texts: {

 //this shit soes not work as documented.
  //},

});