import _ from 'lodash'
import { HTTP } from 'meteor/http'

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

module.exports = quantumCheck
