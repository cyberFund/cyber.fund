Meteor.startup(function() {
	Template.marketData.helpers({
		tableSettings: function() {
			return {
				collection: "current-data",
				showFilter: false,
				rowsPerPage: 10,
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
						key: "supply",
						label: "Supply",
						tmpl: Template.systemSupplyChange,
					},
					{
						fieldId: "volume",
						key: "tradeVolume",
						label: "Trade volume",
						tmpl: Template.systemTradeVolume,
					},
					{
						fieldId: "btc-cap",
						key: "cap.btc",
						sort: -1,
						label: "Bitcoins cap",
						tmpl: Template.systemMarketCapBtc,
					},
					{
						fieldId: "btc-cap-change",
						key: "capChange.week.btc",
						label: "Bitcoins cap change",
						tmpl: Template.systemMarketCapChangeBtc,
					},
					{
						fieldId: "usd-cap",
						key: "cap.usd",
						label: "USD cap",
						tmpl: Template.systemMarketCapUsd,
					},
					{
						fieldId: "usp-cap-change",
						key: "capChange.week.usd",
						label: "USD cap change",
						tmpl: Template.systemMarketCapChangeUsd,
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
