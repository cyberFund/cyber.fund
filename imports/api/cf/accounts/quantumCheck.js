import Acounts from '/imports/api/collections/Acounts'
import {_k, normalizeOptionsPerUser} from '/imports/api/utils'
import {findByRefId} from '/imports/api/utils/accounts'
import {updateBalances} from '/imports/api/utils/accounts'
import {updateBalanceAccount} from '/imports/api/cf/accounts/utils'
import {Meteor} from 'meteor/meteor'

var quantumCheck = function (address) {
  function transform(data) {
    _.each(data, function(asset) {
      if (typeof asset.quantity == "string")
        asset.quantity = parseFloat(asset.quantity);
    });
    return data;
  }

  try {
    var r = HTTP.call("GET", "http://quantum.cyber.fund:3001?address=" + address);
    if (r.statusCode == 200) {
    //  print("address", address);
      return transform(r.data);
    } else {
      return ["error", {
        statusCode: r.statusCode
      }];
    }
  } catch (e) {
  //  print("on checking address " + address + " quantum returned code ",
    //  e.response && e.response.statusCode, true);
    return ["error", {
      statusCode: e.response && e.response.statusCode
    }];
  }
}



module.exports = {
  quantumCheck: quantumCheck
}
