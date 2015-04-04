Jasmine.onTest(function() {
	describe("publications", function() {

		describe("current-data", function() {

			it("should work nicely", function() {

				MarketData.remove({});
				MarketData.insert({ timestamp: 100, source: "foo", name: "bar" });
				MarketData.insert({ timestamp: 100, source: "foo", name: "qux" });
				MarketData.insert({ timestamp: 200, source: "foo", name: "bar" });
				MarketData.insert({ timestamp: 200, source: "foo", name: "qux" });

				result = publications.getCurrentDataCursor().fetch();

				expect(result[0]).toEqual({ _id: jasmine.any(String), timestamp: 200, source: "foo", name: "bar" });
				expect(result[1]).toEqual({ _id: jasmine.any(String), timestamp: 200, source: "foo", name: "qux" });

				expect(result.length).toBe(2);

			});

		});

	});
});
