import chaingear from '/imports/api/server/chaingear'
import crc from '/imports/constants/return_codes'
const _source = 'cmc2017'
const sampleData =require('/imports/sampleData/cmc.json')
var cmcids = null;
function matchItemToCG(item) {

  /*if (!cmcids) {
    console.log(`matchItemToCG: /imports/api/server/metrics/cmc was not initialized properly. use reinit method`)
    return;
  }*/
  return _.find(chaingear.data(), function(cg_item) {
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

var cmc = {
  data: {
    cmcids: {}
  },
  reinit: function(){
    let store = {}
    sampleData.forEach(function(data){

      let match = matchItemToCG(data)
      if (data.id == 'bitcoin') {
        console.log(data)
        console.log(match)
      }
      if (match && match.system) store[data.id] = match.system
    })
    this.data.cmcids = store;
    console.log(this)
  }
}

module.exports = cmc
