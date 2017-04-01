import {Meteor} from 'meteor/meteor'
function _toSpaces(str) {
  return !!str ? str.replace(/_/g, " ") : "";
}
function systemName() {
  return _toSpaces(FlowRouter.getParam('name_'));
}

Template['peekPrices'].helpers({
  _markets: function(){ return Template.instance().markets.get() }
})
