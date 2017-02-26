Template['cgSystemLogo'].rendered = function () {

};

import {cgSystemLogoUrl} from '/imports/api/chaingear/v.old/client/cyberfund-chaingear-client'

Template['cgSystemLogo'].helpers({
    img_url: function () {
      return cgSystemLogoUrl(this.system)
    }
});

Template['cgSystemLogo'].events({
    'click .bar': function (e, t) {

    }
});
