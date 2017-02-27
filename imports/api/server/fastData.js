import FastData from '/imports/api/fastData'
FastData._ensureIndex({"timestamp": 1}, {expireAfterSeconds: 86400});
FastData._ensureIndex({"systemId": 1});
export default FastData
