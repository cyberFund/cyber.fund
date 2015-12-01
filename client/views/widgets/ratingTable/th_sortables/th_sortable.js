Template['thea_d'].helpers({
  sorter: function (field) {
    var sorter = _Session.get("ratingPageSort");
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  }
});

Template['thea_d'].events({
  'click th.sorter': function (e, t) {
    console.log('hhh');
    var newSorter = $(e.currentTarget).data('sorter');
    var sort = _Session.get("ratingPageSort");
      if (sort[newSorter]) {
          sort[newSorter] = -sort[newSorter];
      } else {
          sort = {};
          sort[newSorter] = -1;
      }
    analytics.track("Sorted Rating", {
      sort: sort
    });
    _Session.set('ratingPageSort', sort);
  }
});
