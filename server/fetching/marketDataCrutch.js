import printError from '/imports/api/server/printError'
const request = Npm.require("request");
const config = {
  xcm: {
    url: "http://api.cyber.fund/xcm"
  },
  cmc: {
    url: ""
  }
}
SyncedCron.add({
  name: "cmc fetches 1",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("0/5 * * * *", false);
  },
  job: function () {

  }
});

/*
response metadata sample
I20170226-18:30:02.067(2)?   caseless:
I20170226-18:30:02.067(2)?    { dict:
I20170226-18:30:02.067(2)?       { date: 'Sun, 26 Feb 2017 16:30:00 GMT',
I20170226-18:30:02.067(2)?         'content-type': 'application/json;charset=UTF-8',
I20170226-18:30:02.067(2)?         'transfer-encoding': 'chunked',
I20170226-18:30:02.068(2)?         connection: 'keep-alive',
I20170226-18:30:02.068(2)?         server: 'Apache-Coyote/1.1',
I20170226-18:30:02.068(2)?         'x-kong-upstream-latency': '6',
I20170226-18:30:02.068(2)?         'x-kong-proxy-latency': '0',
I20170226-18:30:02.068(2)?         via: 'kong/0.8.0' } },

*/
function count(it){
  return it.length();
}

function xcm_async_callback(error, response){
  //let Count = count(response)
  try {
    var obj = response.body
    if (typeof obj === 'string') obj = JSON.parse();
  } catch(e) {
    printError(' during xcm scrape - json transform', e)
    throw(e)
    console.log(response.body)
    return;
  }
  console.log(count(obj))
  console.log(`xcm async callback, data.length: ${Count} `)
}

SyncedCron.add({
  name: "xcm fetches 2",
  schedule: function (parser) {
    // parser is a later.parse object
    return parser.cron("0/1 * * * *", false);
  },
  job: function () {
    request.get(config.xcm.url, xcm_async_callback)
  }
})
