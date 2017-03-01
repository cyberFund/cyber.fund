import {_session} from '/imports/api/client/utils/base'
Template["thSorter"].helpers({
  grok: function(sorting, field) {
    var sorter = _session.get(sorting);
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  },
  forceImline: function() {
    return true; //!this.
  }
});

Template["thSortable"].events({
  "click th.sorter": function(e, t) {
    var $e = $(e.currentTarget);

    // what we sort
    var sortingMatter = $e.attr("data-sorting-matter") || "random";

    // sorting key
    var newSorter = $e.attr("data-sorter");
    var tableId = $e.closest("table").attr("id");
    var sort = _session.get(sortingMatter);

    if (sort[newSorter]) {
      sort[newSorter] = -sort[newSorter];
    } else {
      sort = {};
      sort[newSorter] = -1;
    }

    analytics.track("Sorted " + tableId, {
      sort: sort
    });

    _session.set(sortingMatter, sort);
  }
});
