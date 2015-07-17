Tracker.autorun(function(){
	Meteor.subscribe('userDetails');
	if (Meteor.user()) {
		Meteor.call("getUserNumber", function(err, ret){
			Session.set("userRegistracionCount", ret)
		})
	}
});

if (Package['iron:router']) {

	Package['iron:router'].Router.onRun(function() {
		var router = this;
		Tracker.afterFlush(function () { analytics.page(router.route.getName()); });
		this.next();
	});
}