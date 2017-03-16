import {Meteor} from 'meteor/meteor'
const Users = Meteor.Users
function getRefId({userId, user}){
	if (user) return user._id
	if (userId) return userId
}

var portfolioUtils = {}

module.exports = portfolioUtils
