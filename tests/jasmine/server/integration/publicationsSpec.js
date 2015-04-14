Jasmine.onTest(function() {
	describe("publications", function() {

		describe("current-data", function() {

			it("should work nicely", function() {

				var bar, qux;

				MarketData.remove({});
				MarketData.insert({ timestamp: 100, source: "foo", name: "bar" });
				MarketData.insert({ timestamp: 100, source: "foo", name: "qux" });
				MarketData.insert({ timestamp: 200, source: "foo", name: "bar" });
				MarketData.insert({ timestamp: 200, source: "foo", name: "qux" });

				result = publications.getCurrentDataCursor().fetch();

				if (result[0].name === "bar") {
					bar = result[0];
					qux = result[1];
				} else {
					bar = result[1];
					qux = result[0];
				}
				expect(bar).toEqual({ _id: jasmine.any(String), timestamp: 200, source: "foo", name: "bar" });
				expect(qux).toEqual({ _id: jasmine.any(String), timestamp: 200, source: "foo", name: "qux" });

				expect(result.length).toBe(2);

			});

		});

	});
});
