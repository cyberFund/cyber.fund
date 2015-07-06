Template['portfolioPage'].rendered = function () {

};

Template['portfolioPage'].helpers({
    'foo': function () {

    }
});

Template['portfolioPage'].events({
    'click .check-balance': function (e, t) {
        e.preventDefault();
        var val = $(e.currentTarget).closest("form").find("input#account").val();
        console.log(val);
        Meteor.call("cfCheckBalance", val, function(err, ret){
            console.log(err);
            console.log(ret);
        })
    }
});