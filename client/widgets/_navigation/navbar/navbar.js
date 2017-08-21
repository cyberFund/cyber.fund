import {Meteor} from 'meteor/meteor'
import Acounts from '/imports/api/collections/Acounts'

function subscribeList(instance, arr){
  arr.forEach(function(it){
    if (typeof it == 'string')
      instance.subscribe(it)
    else console.log(typeof it, it)
  })
  return instance
}

function collapseSideNav(instance){
  try {
    return instance && instance.$ 
    && instance.$('.button-collapse').sideNav()
    && instance 
  } catch {
    return instance
  }
}

function isActiveOwnProfile(){
  var user = Meteor.user(); if (!user) return ''
  var username = user.username
  if (!username) return ''
  return (location.pathname == '/@'+username) ? 'active': ''
}


Template.navbar.onCreated(function(){
  var instance = this
  subscribeList( instance, 
    ["coinsCount", "ownAssets", "systemsLookup"]
  )
})


Template['navbar'].onRendered(function () {
  let instance = this
  collapseSideNav(instance)
});


// track signups
Tracker.autorun(function(c){
  var user = Meteor.user();
  if (user && user.firstLogin) {
    analytics.track('Sign Up',
      {userId: Meteor.userId()});
    Meteor.call("afterFirstLogin");
    c.stop();
  }
});

Template['navbar'].helpers({
  isActiveOwnProfile: isActiveOwnProfile
});

Template['navbar'].events({
  'click #nav-mobile a': function (e, t) {
    Meteor.setTimeout(function triggerClick(){
      $('#sidenav-overlay').trigger('click');
    }, 280)
  },
  'click #login-button': function(e, t){
    analytics.track('Sign In', {
      from: 'navbar'
    });
    Meteor.loginWithTwitter({
      loginStyle: 'redirect'
    })
  }/*
  'click #login-button': function(e, t){
    analytics.track('redirect to Sign In', {
      from: 'navbar'
    });
    FlowRouter.go('/sign-in')
  }*/
});
