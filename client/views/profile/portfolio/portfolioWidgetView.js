import {cfIsAccountHidden} from '/imports/api/cfAccount'
import cfCDs from '../../../../imports/currentData/selectors'
var ns = CF.UserAssets;


Template["portfolioWidgetView"].helpers({
  shouldShowCheckboxes: function(){
    return CF.Accounts.findByRefId(CF.Profile.currentUid()).count() > 1;
  },
  sumB: function() {
    var assets = CF.Accounts.portfolioTableData();
    var sum = 0;
    if (_.keys(assets).length) {
      _.each(assets, function(asset) {
        sum += asset.vBtc || 0;
      });
    }
    return sum;
  },
  sumU: function() {
    var assets = CF.Accounts.portfolioTableData();
    var sum = 0;
    if (_.keys(assets).length) {
      _.each(assets, function(asset) {
        sum += asset.vUsd || 0;
      });
    }
    return sum;
  },
  filteredAccountsData: function() {
    return CF.Accounts.userProfileData();
  },
  flat: function() {
    return CF.Accounts.extractAssets(this);
  },
  flattenData: CF.Accounts.portfolioTableData
});

Template["pwvRow"].onRendered(function() {
  var t = this;
  t.$(".count-account").prop("checked", !cfIsAccountHidden(t.data._id));
});

Template["pwvRow"].helpers({
  showAccount: function() {
    return Session.get("hideAccount_" + this._id) ? "" : "checked";
  },
  shouldShowCheckboxes: function(){ //TODO dedupe
    return CF.Accounts.findByRefId(CF.Profile.currentUid()).count() > 1;
  }
});

Template["pwvRow"].events({
  "change .count-account": function(e, t) {
    CF.Accounts.hiddenToggle(t.$(e.currentTarget).attr("account-id"));
  }
});
