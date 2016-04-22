function systemName() {
  return Blaze._globalHelpers._toSpaces(FlowRouter.getParam('name_'));
}

Template['peekPrices'].onCreated(function(){
  var instance = this;
  instance.markets = new ReactiveVar
  instance.autorun(function(computation){
    var id = systemName() ;

    Meteor.call("getQuotes", id, function(err, res){
      console.log(err)
      if (res) instance.markets.set( res.markets )
      console.log(instance)
    });
  });
})

Template['peekPrices'].helpers({
  _markets: function(){ return Template.instance().markets.get() }
})
