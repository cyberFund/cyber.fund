Template['portfolioPage'].rendered = function () {

};

Template['portfolioPage'].helpers({
});

Template['portfolioPage'].events({
  'click .check-balance': function (e, t) {
    e.preventDefault();
    var val = $(e.currentTarget).closest("form").find("input#account").val();

    Meteor.call("cfCheckBalance", val, function (err, ret) {

    })
  }
});