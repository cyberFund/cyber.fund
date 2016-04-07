Accounts.onLogin(function(){
  console.log(FlowRouter)
  analytics.track('Sign In', {
    from: 'undefined'
  });
})
