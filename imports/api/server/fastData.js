import FastData from '/imports/api/fastData'
FastData._ensureIndex({"timestamp": 1}, {expireAfterSeconds: 86400});
FastData._ensureIndex({"systemId": 1});
FastData._ensureIndex({"source": 1, "quote": 1, timestamp: 1});
FastData._ensureIndex({"source": 1, "base": 1, "quote": 1, timestamp: 1});
FastData._ensureIndex({"source": 1, "timestamp": 1});
export default FastData
