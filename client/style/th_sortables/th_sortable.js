Template['thSorter'].helpers({
  grok: function(sorting, field){
    var sorter = _Session.get(sorting);
    if (!_.isObject(sorter)) return "";
    if (sorter[field] == -1) return "↓ ";
    if (sorter[field] == 1) return "↑ ";
    return "";
  }
})
