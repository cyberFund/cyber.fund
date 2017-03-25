import cmc from '/imports/api/server/metrics/cmc'
import {
  CurrentData,
  MarketData,
  Extras
} from '/imports/api/collections'
import {
  handleArrayWithInterval
} from '/imports/api/handleArray'

function cmcCallback5m(data) {
  if (!data) return
  data.forEach(function (item) {
    let system = cmc.matchItemToCG(item);
    let systemId = system && system._id;
    if (systemId) {
      let metrics = cmc.extractMetrics(item, systemId)
      let cd_metrics = cmc.getCurrentDataUpdater(metrics, system)
      let md = cmc.getMarketDataInserter(metrics, system)
      if (cd_metrics) CurrentData.update({
        _id: systemId
      }, {
        $set: cd_metrics
      })
      if (md) MarketData.insert(md)
    }
  })
}

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


const timestamp_min = 1488026402
const timestamp_max = 1490449203

function cmcCallback5mHistory(data, cb) {
  if (!data) return
  data.forEach(function (item) {
    let system = cmc.matchItemToCG(item);
    let systemId = system && system._id;
    if (systemId) {
      let metrics = cmc.extractMetrics(item, systemId)
      let md = cmc.getMarketDataInserter(metrics, system)

      if (md) MarketData.insert(md)
    }
  })
  cb()
}


import dir from 'node-dir'
// read dir, use node-dir module
// save file names to arrray.
function extraIdFromTs32(ts32){
	return 'cmc5m_'+ts32
}

const FAILED = 'failed'
const PARSED = 'parsed'
const PROCESSING = 'processing'
const DONE = 'done'
import fs from 'fs'
/*
dir.files(datapath, Meteor.bindEnvironment(function (err, files) {
  if (err) return
  // take files per one.
  handleArrayWithInterval(files, 500, function (filename, cbFunc) {
    let ts32 = filename.split('/')
      .pop()
      .split('.')[0]

    let extraDoc = Extras.findOne({_id: extraIdFromTs32(ts32)})
		if (extraDoc) {
			if (extraDoc.status == FAILED || extraDoc.status = DONE) return;
		}
		extraDoc = {_id: extraIdFromTs32(ts32)}
		try {
			data = require(filepath)
		} catch(e) {
			extraDoc.status = FAILED
			//Extras.insert
			cbFunc()
			return
		}

  })
}))

*/

// check if record exists. if exists - check status is 'saved' or 'failed'
// if none -
// store in extras collection, use _id: cmc5m_<ts> as id, e.g. 'cmc5m_1488026402'
// in extras collection:
// per document per file open - try parsing json. if ok - set status to json_parsed.
// else set status to failed
// call cmcCallback5mHistory with data loaded. upon end, set state to saved

// hourlies:
// start from timestamp_min
// proceeed to timestamp_max
// get start of hour (momentjs)
// get start of next hour (momentjs)
// check start of next hour is still smaller than timestamp_max
// per system: find interval: '5m', systemId: systemId, timestamp: within hour.
//
// calculate averages. exclude 0 values from calculation.
// store with timestamp 'start of hour + 30*60*1000', interval: hourly
// into same MarketData collection

// dailies
// start from timestamp_min
// proceeed to timestamp_max
// get start of day (momentjs)
// get start of next day (momentjs)
// check start of next day is still smaller than timestamp_max
