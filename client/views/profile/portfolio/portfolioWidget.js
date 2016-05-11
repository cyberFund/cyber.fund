/**
 *
 * @param accountsData - accounts object
 * @returns {number} assets value in bitcoins
 */

Template['portfolioWidget'].helpers({
  subReady: function(){ return CF.subs.Assets && CF.subs.Assets.ready() },
  showAccountsAdvertise: function() {
    var instance = Template.instance();
    if (CF.subs.Assets.ready()) {
        var user = Meteor.users.findOne({
          _id: CF.Profile.currentUid()
        });
        if (!user) return false;
        return !(CF.Accounts._findByUserId(user._id).count())
    } else return false
  },
  isOwnAssets: function(){
    return CF.Profile.currentUid() == Meteor.userId();
  }
})
