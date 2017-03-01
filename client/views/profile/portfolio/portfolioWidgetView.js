import {cfIsAccountHidden} from '/imports/api/client/cf/account'
import cfCDs from '/imports/api/currentData/selectors'
import {portfolioTableData, userProfileData} from '/imports/api/client/utils/portfolio'
import {extractAssets, findById, findByRefId} from '/imports/api/cf/account/utils'

function hiddenToggle (accountId){
  if (!accountId) return;
  Session.set("hideAccount_"+(accountId), !Session.get("hideAccount_"+(accountId)));
};

Template["portfolioWidgetView"].helpers({
  shouldShowCheckboxes: function(){
    return findByRefId(CF.Profile.currentUid()).count() > 1;
  },
  sumB: function() {
    var assets = portfolioTableData();
    var sum = 0;
    if (_.keys(assets).length) {
      _.each(assets, function(asset) {
        sum += asset.vBtc || 0;
      });
    }
    return sum;
  },
  sumU: function() {
    var assets = portfolioTableData();
    var sum = 0;
    if (_.keys(assets).length) {
      _.each(assets, function(asset) {
        sum += asset.vUsd || 0;
      });
    }
    return sum;
  },
  filteredAccountsData: function() {
    return userProfileData();
  },
  flat: function() {
    return extractAssets(this);
  },
  flattenData: portfolioTableData
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
    return findByRefId(CF.Profile.currentUid()).count() > 1;
  }
});

Template["pwvRow"].events({
  "change .count-account": function(e, t) {
    hiddenToggle(t.$(e.currentTarget).attr("account-id"));
  }
});
