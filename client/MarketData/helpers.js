Meteor.startup(function() {

	Template.marketData.onCreated(function() {
		this.subscribe("current-data");
	});

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

	Template.marketData.helpers({

		tableSettings: function() {
			return {
				collection: MarketData,
				showFilter: false,
				rowsPerPage: Number.MAX_VALUE,
				showNavigation: "never",
				fields: [
					{
						fieldId: "icon",
						label: "",
						sortable: false,
						tmpl: Template.systemIcon,
					},
					{
						fieldId: "name",
						key: "name",
						label: "System",
					},
					{
						fieldId: "rating",
						key: "metrics.rating",
						label: "Rating",
						tmpl: Template.systemRating,
					},
					{
						fieldId: "supply",
						key: "metrics.availableSupplyNumber",
						label: "Supply",
						sort: -1,
						tmpl: Template.systemSupplyChange,
					},
					{
						fieldId: "volume",
						key: "metrics.volume24.btc",
						label: "Trade volume",
						tmpl: Template.systemTradeVolume,
						fn: parseNumber,
					},
					{
						fieldId: "btc-cap",
						key: "metrics.marketCap.btc",
						label: "Bitcoins cap",
						tmpl: Template.systemMarketCapBtc,
						fn: parseNumber,
					},
					{
						fieldId: "btc-cap-change",
						key: "metrics.marketCapChange.7d.btc",
						label: "Bitcoins cap change",
						fn: parseNumber,
					},
					{
						fieldId: "usd-cap",
						key: "metrics.marketCap.usd",
						label: "USD cap",
						tmpl: Template.systemMarketCapUsd,
						fn: parseNumber,
					},
					{
						fieldId: "usp-cap-change",
						key: "metrics.marketCapChange.7d.usd",
						label: "USD cap change",
						fn: parseNumber,
					},
					{
						fieldId: "chart",
						label: "",
						sortable: false,
						tmpl: Template.systemCapChangeChart,
					},
				],
			};
		},

	});

});
