import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'

Meteor.startup(function() {
	CF.keenflag = new ReactiveVar()
	Keen.ready(function() {
		CF.keenflag.set(true)
	})
})
