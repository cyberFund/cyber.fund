import startupDailies from '/imports/api/vetalPrices/syncedCronJob'
import startupMetrics from   '/imports/api/server/startup/metrics'
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
    cmc.fetch(function(data){
      if (!data) return
      data.forEach(function(data){
        let systemId = cmc.systemIdFromCmcId(data.id);
        if ( systemId ) {

          //console.log(`systemId: ${cmc.systemIdFromCmcId(data.id)}; cmcId: ${data.id}`)
          let metrics = cmc.applyMetrics(cmc.extractMetrics(data))
          CurrentData.update({_id: systemId}, {$set: metrics})
          console.log(metrics)
        }
      })
    })
  }
})
Meteor.startup(() => {
  chaingear.reinit()
  startupDailies()
  startupMetrics()
})
