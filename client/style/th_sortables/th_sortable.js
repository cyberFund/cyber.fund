Template['thSorter'].helpers({
  grok: function(sorting, field){
    var sorter = _Session.get(sorting);
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  }
})

Template['thSortable'].events({
  'click th.sorter': function (e, t) {
    var $e = $(e.currentTarget);
    var sortingMatter = $e.data('sortingMatter') || "random"; // what we sort
    var newSorter = $e.data('sorter'); // sorting key
    var tableId = $e.closest("table").attr("id");
    var sort = _Session.get( sortingMatter );

    if (sort[ newSorter ]) {
        sort[ newSorter ] = -sort[ newSorter ];
    } else {
        sort = {}; sort[ newSorter ] = -1;
    }


    analytics.track("Sorted " + tableId, {
      sort: sort
    });
    _Session.set( sortingMatter, sort);
  }
})
