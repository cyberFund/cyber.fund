Template['cgSystemLogo'].rendered = function () {

};

Template['cgSystemLogo'].helpers({
    img_url: function () {
      function cgSystemLogoUrl (that) {
        var icon = (that.icon ? that.icon : that._id) || '';
        icon = icon.toString().toLowerCase();
        return "https://static.cyber.fund/logos/" + icon + ".png";
      }
      return cgSystemLogoUrl(this.system)
    }
});

Template['cgSystemLogo'].events({
    'click .bar': function (e, t) {

    }
});
