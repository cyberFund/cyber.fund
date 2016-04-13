Template['radarCard'].rendered = function () {

};

Template['radarCard'].helpers({
  name_: function () { //TODO: move to global helpers ?
    return Blaze._globalHelpers._toUnderscores(this._id);
  }
});

Template['radarCard'].events({
  'click .bar': function (e, t) {

  }
});
