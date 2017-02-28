import { Mongo } from 'meteor/mongo'
import { metrics } from '/imports/api/collections/Metrics'
var Metrics = new Mongo.Collection('Metrics')
module.exports = Metrics
