Tracker.autorun(function(){
	Meteor.subscribe('userDetails');
});

if (Package['iron:router']) {

	Package['iron:router'].Router.onRun(function() {
		var router = this;
		Tracker.afterFlush(function () { analytics.page(router.route.getName()); });
		this.next();
	});
}