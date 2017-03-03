import {username} from '/imports/api/utils/user'
import {currentUsername} from '/imports/api/cf/profile'

var isOwnAssets = function(){
  return currentUsername() == username();
}

var exp = {
  isOwnAssets: isOwnAssets
}

module.exports = exp
