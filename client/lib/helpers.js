Meteor.startup(function() {

	var parseNumber = function(stringOrNumber) {
		var asFloat = parseFloat(stringOrNumber);
		var asInt = isNaN(asFloat) ? 0 : Math.round(asFloat);
		return asInt;
	};

	var formatNumber = function(stringOrNumber) {
		var formatted = parseNumber(stringOrNumber).toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return formatted;
	};

	Template.registerHelper("formatNumber", function(stringOrNumber) {
		return formatNumber(stringOrNumber);
	});

	Template.registerHelper("percents", function(part, whole) {
		return whole ? parseFloat((part / whole * 100).toFixed(3)) : 0;
	});

});
