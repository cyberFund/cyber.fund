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
          field: "aliases.CurrencyName",
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
    Router.current().router.go("System", {name_: Blaze._globalHelpers._toU(doc.system) })
    template.$("input#search").val("");
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
          field: "aliases.CurrencyName",
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