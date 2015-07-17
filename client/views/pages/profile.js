Template['profile'].rendered = function () {
  
};

Template['profile'].helpers({
  'userRegistracionCount': function () {
    return Session.get("userRegistracionCount")
  }
});

Template['profile'].events({
  'click .bar': function (e, t) {
    
  }
});