var bloom = _.keys(this)

var ua =  bloom.indexOf('navigator') > -1 ? this.navigator.userAgent : " not detected "

Meteor.call("cropBloom", bloom, ua);
