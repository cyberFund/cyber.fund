import {Extras} from '/imports/api/collections'

const Ids = ['total_cap', 'maxLove']

Meteor.publish("extras_01", function(){
	console.log('trace')
  return Extras.find({_id: {$in: Ids}})
})
