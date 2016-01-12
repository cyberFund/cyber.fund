Template['ratingTableHead'].helpers({
  __sorter: function () { return "coinSorter";}
});

Template['ratingTableHead'].events({
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
