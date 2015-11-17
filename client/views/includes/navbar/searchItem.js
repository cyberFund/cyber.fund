Template['searchItem1'].rendered = function () {

};

Template['searchItem1'].helpers({
  'searchSettings': function () {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        /*{
          token: '!',
          collection: 'CurrentData_',
          field: "token.token_symbol",
          subscription: "search-sym",
          matchAll: false,
          template: Template.searchSystemBySymbolItem,
          noMatchTemplate: Template.searchNoMatchedSearch
        },*/
        {
          token: '',
          collection: 'CurrentData',
          field: "token.token_name",
          subscription: "search-sys",
          matchAll: false,
          template: Template.searchSystemBySymbolItem, //Template.searchSystemItem,
          noMatchTemplate: Template.searchNoMatchedSearch
        },
      ]
    };
  }
});

Template['searchItem1'].events({
  "autocompleteselect input#search": function(event, template, doc) {
    analytics.track("Searched", {
      systemName: doc.system
    });
    template.$("input#search").val("");
    FlowRouter.go("system/:name_", {name_: Blaze._globalHelpers._toUnderscores(doc.system) })
  }
});

Template['searchItem2'].helpers({
  'searchSettings': function () {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: '',
          collection: 'CurrentData',
          field: "token.token_name",
          subscription: "search-sys",
          matchAll: false,
          template: Template.searchSystemBySymbolItem, //Template.searchSystemItem,
          noMatchTemplate: Template.searchNoMatchedSearch
        },
      ]
    };
  }
});

Template['searchItem2'].events({
});
