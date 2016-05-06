var disableButton = function disableButton(t){
  t.$(".query-balance").addClass("disabled");
}

var enableButton =  function enableButton(t){
  if (t.timeout) Meteor.clearTimeout(t.timeout);
  t.$(".query-balance").removeClass("disabled");
}
Template['balanceChecker1'].onCreated(function(){
  var t = this
  t.lastAddress = new ReactiveVar();
  t.lastStatus = new ReactiveVar();
  t.lastData = new ReactiveVar();
  t.queryingAddress = new ReactiveVar(); 
})

Template['balanceChecker1'].helpers({
  lastAddress: function(){ return Template.instance().lastAddress.get(); },
  lastStatus: function(){ return Template.instance().lastStatus.get(); },
  lastData: function(){ return Template.instance().lastData.get(); },
  queryingAddress: function(){ return Template.instance().queryingAddress.get(); }
});

Template['balanceChecker1'].events({
  'click .query-balance': function (e, t){
    e.preventDefault();
    if (t.$(e.currentTarget).hasClass("disabled")) return;
    var addr = t.$("input").val().split('&')[0].trim();
    if (!addr) {
      Materialize.toast("Please input an address", 4000); return;
    }
    /* cors do not work so far
    $.ajax({
      url: "http://quantum.cyber.fund:3001?address="+addr,
      complete: function(a, b){
        console.log(a);
        console.log(b);
      }
    })*/
    $(e.currentTarget).addClass('disabled');

    disableButton(t);

    t.timeout = Meteor.setTimeout(function(){
      enableButton(t);
    }, 15000)

    t.queryingAddress.set(addr);
    Meteor.call("checkBalance", addr, function (err, result){
      t.lastAddress.set(addr);
      t.lastStatus.set(result[0] == 'error' ? result[1].statusCode : '')
      t.lastData.set(t.lastStatus.get() ? null : result);
      t.queryingAddress.set('')
      console.log(result);
      enableButton(t);
    })
  }
})
