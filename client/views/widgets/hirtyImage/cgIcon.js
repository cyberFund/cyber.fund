Template['cgIcon'].rendered = function () {

};

Template['cgIcon'].helpers({
    'img_url': function () {
        return CF.Chaingear.helpers.cgIcon(this.data)
    }
});

Template['cgIcon'].events({
    'click .bar': function (e, t) {

    }
});