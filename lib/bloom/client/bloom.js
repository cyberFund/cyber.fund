var bloom = _.keys(this)
var ua =
bloom.indexOf('navigator') > -1 ? this.navigator.userAgent :
(( (bloom.indexOf('window') > -1) && (bloom.window.navigator)) ?
bloom.window.navigator.userAgent   : " not detected ");


Meteor.call("cropBloom", bloom, ua);
