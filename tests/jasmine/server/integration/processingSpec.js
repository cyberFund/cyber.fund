Jasmine.onTest(function() {
	describe("processing", function() {

		describe("getNearestTimestamp", function() {

			beforeEach(function() {

				MarketData.remove({});
				MarketData.insert({ timestamp: 100, source: "foo" });
				MarketData.insert({ timestamp: 200, source: "foo" });
				MarketData.insert({ timestamp: 400, source: "foo" });
				MarketData.insert({ timestamp: 300, source: "bar" });
				MarketData.insert({ timestamp: 500, source: "bar" });

			});

			it("should get the last timestamp", function() {

				result = processing.getNearestTimestamp();
				expect(result).toBe(500);

			});

		});

	});
});
