Template['assetsManager'].rendered = function () {
  this.$('.modal-trigger').leanModal();
};

Template['assetsManager'].helpers({
  "treasures": function () {
    var user = Meteor.user();
    if (!user) return [];
    return user.assets;
  },
  _rows: function (that){
    var arr = _.map(that.assets, function(v, k){
      return v;
    });
    return arr.length
  },
  _assets: function(){
    var arr = _.map(this.assets, function(v, k){
      return v;
    });
    return arr;
  },
  'currentAsset': function(){
    return Session.get("currentAsset");
  }
});

Template['assetsManager'].onCreated(function(){
  var instance=this;
  instance.subscribe('ownAssets');
});

Template['assetsManager'].events({

  'click .submit-add-asset': function(e, t){ //TAG: assets
    if (Session.get("addingAccount")) return false;
    var $form = t.$(e.currentTarget).closest("form");
    console.log($form);
    var account = $form.find("[name=account]").val();
    var address = $form.find("[name=address]").val();
    Session.set("addingAccount", true);
    Meteor.call("cfAssetsAddAsset", account, address, function(err, ret){
      Session.set("addingAccount", null);
      t.$("#modal-add-asset").closeModal()
    })
  },

  "click .act-asset": function(e, t) {
    var $assetrow = t.$(e.currentTarget).closest("tr");
    console.log($assetrow);
    Session.set("currentAsset", {
      account: $assetrow.data("account"),
      address: $assetrow.data("address")
    });
  },
  "click .act-remove-asset": function(e, t){
    t.$("#modal-remove-asset").openModal();
  },
  'click .submit-remove-asset': function(e, t){
    Meteor.call("cfAssetsRemoveAsset", Session.get("currentAsset"), function(err, ret){
      if (!err) {
        Session.set("currentAsset", null);
        t.$("#modal-remove-asset").closeModal()
      }
    })
  },
  'click .act-update-balance': function(e, t){
    var $assetrow = t.$(e.currentTarget).closest("tr");
    var address =  $assetrow.data("address");
    Session.set("updatingBalance", true);
    Meteor.call("cfAssetsUpdateBalance", address, function(err, ret){
      Session.set("updatingBalance", null);
    });

  }
});