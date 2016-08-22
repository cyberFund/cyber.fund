// this functionality was NOT tested
Meteor.startup(function() {
	prerenderio.set('prerenderServiceUrl', 'http://localhost:3000/'));
	// NOTE do not forget, after deploying to cyber.fund prerender.io url settings must be changed
	prerenderio.set('prerenderToken', 'WlGqHB7QNMLn9bkRtLLg'));
})
