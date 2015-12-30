Template['thea_d2'].helpers({
  sorter: function (field) {
    var sorter = _Session.get("coinSorter");
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  }
});

Template['thea_d2'].events({
  'click th.sorter': function (e, t) {
    var newSorter = $(e.currentTarget).data('sorter');
    var sort = _Session.get("coinSorter");
      if (sort[newSorter]) {
          sort[newSorter] = -sort[newSorter];
      } else {
          sort = {};
          sort[newSorter] = -1;
      }
    analytics.track("Sorted Rating", {
      sort: sort
    });
    _Session.set('coinSorter', sort);
  }
});
