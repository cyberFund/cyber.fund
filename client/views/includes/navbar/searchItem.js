Template['searchItem'].rendered = function () {
  
};

Template['searchItem'].helpers({
  'searchSettings': function () {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: '',
          collection: 'CurrentData',
          field: "aliases.CurrencyName",
          subscription: "search-sys",
          matchAll: false,
          template: Template.searchSystemItem,
          noMatchTemplate: Template.searchNoMatchedSearch
        }
      ]
    };
  }
});

Template['searchItem'].events({
  "autocompleteselect input#search": function(event, template, doc) {
    Router.current().router.go("system1", {name_: Blaze._globalHelpers._toU(doc.system) })
    template.$("input#search").val("");
  }
});