var balance = Npm.require("crypto-balance");
CF.checkBalance = balance;

Meteor.methods({
  /**
   * thin wrapper around Lars Kluge' crypto-balance package.
   * @param wallet_
   * @returns {*|promise}
   */
  cfCheckBalance: function (wallet_) { //obsolete, was only used for tests
    return CF.Utils.extrctFromPromise(balance(wallet_));
  },

  /*  retrieves our unique address balance, to display invest stats
   currently let s just
   */
  "getInvestData": function () {
    var dasAddress = "3FvBgYaZV9347L863L4sQx75R6FQDReZKR";
    var result = HTTP.get("https://blockchain.info/rawaddr/" + dasAddress);
    try {
      var ret = JSON.parse(result.content);
      Extras.upsert({_id: 'invest_balance'}, ret)
      return _.omit(ret, ['txs']);
    } catch (e) {

      var ret = Extras.findOne({_id: 'invest_balance'}) || {};
      return _.omit(ret, ['txs'])

    }
  }
});

Meteor.publish('investData', function () {
  return Extras.find( {_id: {$in: ['total_cap','invest_balance']}},  {fields: {'txc': 0}} )
})

Meteor.publish('maxLove', function(){
  return Extras.find( {_id: {$in: ['maxLove']}} )
})
