import {CurrentData} from '/imports/api/collections'
var ns = CF.CurrentData.calculatables;

ns.lib.calcs.calcLV = function calcLV(system) {
  var sel = {
    _id: 'maxLove'
  };

  function getMax() {
    var n = 0,
      system = '';
    CurrentData.find({}, {
        fields: {
          _usersStarred: 1,
          system: 1
        }
      })
      .forEach(function(item) {
        if (item._usersStarred && item._usersStarred.length > n) {
          n = item._usersStarred.length;
          system = item.system;
        }
      });
    Extras.upsert(sel, {
      system: system,
      value: n
    });
  }

  var n = system._usersStarred ? system._usersStarred.length : 0;
  var maxLove = Extras.findOne(sel);
  if (!maxLove) {
    maxLove = {
      _id: 'maxLove',
      value: n,
      system: system._id
    };
    Extras.insert(maxLove);
  }
  if (maxLove.value < n) {
    Extras.update(sel, {
      system: system._id,
      value: n
    });
  }
  if (maxLove.system == system._id
    && n < maxLove.value) {
    getMax()
  }
  return {
    num: n,
    sum: (n / maxLove.value) || 0
  }
}
