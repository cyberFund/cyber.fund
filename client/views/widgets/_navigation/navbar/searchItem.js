Template['searchItem1'].rendered = function () {

};

Template['searchItem1'].helpers({
  'searchSettings': function () {
    return {
      position: "bottom",
      limit: 5,
      rules: [
        {
          token: '',
          collection: 'CurrentData',
          field: "token.name",
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
    var system = doc._id;

    analytics.track("Searched", {
      systemName: system
    });

    template.$("input#search").val("");
    FlowRouter.go("/system/:name_", {name_:
      Blaze._globalHelpers._toUnderscores(system) })
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
          field: "token.name",
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
