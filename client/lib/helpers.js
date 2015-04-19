Meteor.startup(function() {

	var parseNumber = function(stringOrNumber, places) {
		var asFloat = parseFloat(stringOrNumber);
		places = places === undefined ? 0 : places;
		var rounded = isNaN(asFloat) ? 0 : parseFloat(asFloat.toFixed(places));
		return rounded;
	};

	var formatNumber = function(stringOrNumber, places) {
		var formatted = parseNumber(stringOrNumber, places).toString()
			.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return formatted;
	};

	Template.registerHelper("formatNumber", function(stringOrNumber, places) {
		return formatNumber(stringOrNumber, places);
	});

	Template.registerHelper("percents", function(part, whole) {
		return whole ? parseFloat((part / whole * 100).toFixed(3)) : 0;
	});

	Template.registerHelper("lowercase", function(str) {
		return str.toLowerCase();
	});

});
