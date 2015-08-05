Template['cgSystemLogo'].rendered = function () {

};

Template['cgSystemLogo'].helpers({
    'img_url': function () {
        return CF.Chaingear.helpers.cgSystemLogo(this.data)
    }
});

Template['cgSystemLogo'].events({
    'click .bar': function (e, t) {

    }
});