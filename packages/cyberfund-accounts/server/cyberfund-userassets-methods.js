var ns = CF.UserAssets;
var nsn = "CF.UserAssets."

var logger = CF.Utils.logger.getLogger("meteor-fetching");
var print = logger.print/*function(really) {
  return (really ? new CF.Utils.logger.getLogger('balance updater').print : function() {})
}(true)*/

ns.quantumCheck = function(address) { // moving to CF.Accounts
  try {
    print("checking address", address, true)
    var r = HTTP.call("GET", "http://quantum.cyber.fund:3001?address=" + address);
    if (r.statusCode == 200)
      return r.data;
  } catch (e) {
    print("on checking address " + address + " quantum returned code ",
      e && e.response && e.response.statusCode, true)
    return ['error'];
  }
}
