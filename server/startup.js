import startupDailies from '/imports/api/vetalPrices/syncedCronJob'

import startupMetrics2 from '/imports/api/server/metrics/price_cmc'
import chaingear from '/imports/api/server/chaingear'
import cmc from '/imports/api/server/metrics/cmc'
import crc from '/imports/constants/return_codes'
import {CurrentData} from '/imports/api/collections'
const sampleData =require('/imports/sampleData/cmc.json')
SyncedCron.add({
  name: "cmc scraper",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("1/5 * * * *", false);
  },
  job: function () {
		cmc.fetch(cmcCallback5m)
  }
})

function cmcCallback5m(data){
	if (!data) return
	data.forEach(function(item){
		let system = cmc.matchItemToCG(item);
		let systemId = system && system._id;
		console.log(systemId)
		if ( systemId ) {
			if (item.name != systemId) {
				console.log(item.name + " name")
				console.log(systemId + " systemId")
			} else {
				console.log (systemId + " system Name")
			}
			let metrics = cmc.extractMetrics(item, systemId)
			console.log(metrics)
			console.log("<--")
			let cd_metrics = cmc.getCurrentDataUpdater(metrics, system)
			if (cd_metrics)
			CurrentData.update({_id: systemId}, {$set: cd_metrics})
			let md = cmc.getMarketDataInserter(metrics, system)
			if (md) MarketData.insert(md)
			console.log("-->")
		}
	})
}

Meteor.startup(() => {
  chaingear.reinit()
  startupDailies()

	cmc.fetch(cmcCallback5m)
})
