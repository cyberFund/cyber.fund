const selectorService = require("../../imports/userFunds").selectorService;
const updateUserFunds = require("../../imports/userFunds/userHistory").updateUserFunds;
const handleArrayWithInterval = require("../../imports/api/handleArray").handleArrayWithInterval

function dealWithPopulars(){
  handleArrayWithInterval( _.pluck( Meteor.users.find(selectorService, {fields: {_id: 1}}).fetch(), '_id'), 8000, updateUserFunds)
}

SyncedCron.add({
  name: 'hourly user history',
  schedule: function (parser) {
    return parser.text('every hour');
  },
  job: function () {
    dealWithPopulars()
  }
})

function dealWithAll(){
  handleArrayWithInterval( _.pluck( Meteor.users.find({}, {fields: {_id: 1}}).fetch(), '_id'), 8000, updateUserFunds)
}

SyncedCron.add({
  name: 'daily user history',
  schedule: function (parser) {
    return parser.cron("17 1 * * *", false);
  },
  job: function () {
    dealWithAll
  }
});

// dev test only
Meteor.startup(function(){
  dealWithAll();
})
