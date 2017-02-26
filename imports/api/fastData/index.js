import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

export default FastData = new Meteor.Collection("fast_market_data");
FastData._ensureIndex({"timestamp": 1}, {expireAfterSeconds: 86400});
FastData._ensureIndex({"systemId": 1});
