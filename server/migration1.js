Meteor.startup(function() {
/*  CurrentData.find({}).forEach(function(item) {
    if (item._id != item.system) {
      Extras.upsert({
        _id: "new_" + item.system
      }, {
        newId: item.system,
        oldId: item._id,
        state: 'init',
        type: 'migration1'
      })
    }
  });
  Meteor.setTimeout(function() {
    Extras.find({
      state: 'init',
      type: 'migration1'
    }).forEach(function(extra) {
      FastData.update({
        systemId: extra.oldId
      }, {
        $set: {
          systemId: extra.newId
        }
      }, {
        multi: true
      });

      MarketData.update({
        systemId: extra.oldId
      }, {
        $set: {
          systemId: extra.newId
        }
      }, {
        multi: true
      });

      Extras.update({
        _id: "new_" + extra.newId
      }, {
        $set: {
          state: "migrated"
        }
      });

      var cd = CurrentData.findOne({
        _id: extra.oldId
      });
      cd._id = extra.newId;
      CurrentData.remove({
        _id: extra.oldId
      })
      CurrentData.insert(cd);
    });
  }, 10000)*/
});
