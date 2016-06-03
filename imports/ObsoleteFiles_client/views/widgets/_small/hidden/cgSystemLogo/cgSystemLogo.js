Template['cgSystemLogo'].rendered = function () {

};

Template['cgSystemLogo'].helpers({
    img_url: function () {
      return CF.Chaingear.helpers.cgSystemLogoUrl(this.system)
    }
});

Template['cgSystemLogo'].events({
    'click .bar': function (e, t) {

    }
});
