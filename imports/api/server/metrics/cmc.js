import chaingear from '../chaingear'
import crc from '/imports/constants/return_codes'
var cmcids = null;
function matchItemToCG(item) {
  if (!cmcids) {
    console.log(`matchItemToCG: /imports/api/server/metrics/cmc was not initialized properly. use reinit method`)
    return;
  }
  return _.find(chaingear.data, function(cg_item) {
    if ((!cg_item.aliases) ||
     (!cg_item.token) ||
     (!cg_item.aliases.coinmarketcap)) return false;
    if (cg_item.aliases.coinmarketcap.indexOf("+") == -1)
      return (cg_item.aliases.coinmarketcap == item.name) //&& (item.symbol == cg_item.token.symbol)
    else {
      var _split = cg_item.aliases.coinmarketcap.trim().split("+");
      return (_split[0] == item.name) && (_split[1] == item.symbol)
    }
  });
}

module.exports = {
  data: {
    cmcids: cmcids
  },
  reinit: function(){
    let cgData = chaingear.data;
    let store = {}

    sample.forEach(function(data){
      let match = matchItemToCG(data)
      if (match && match.system) store[data.id] = match.system
    })
    cmcids = store;
    console.log(Object.count())
  }
}
