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

			it("should get the latest timestamp by default", function() {
				result = processing.getNearestTimestamp();
				expect(result).toBe(500);
			});

			it("should get the latest timestamp for a given source", function() {
				result = processing.getNearestTimestamp("foo");
				expect(result).toBe(400);
			});

			it("should get the nearest timestamp to a given one", function() {
				result = processing.getNearestTimestamp(null, 290);
				expect(result).toBe(300);
			});

			it("should get the nearest timestamp to a given one for a given source", function() {
				result = processing.getNearestTimestamp("bar", 420);
				expect(result).toBe(500);
			});

			it("should return null when there's no such source", function() {
				result = processing.getNearestTimestamp("no such source");
				expect(result).toBeNull();
			});

			it("should return null when there's no such source when given a timestamp", function() {
				result = processing.getNearestTimestamp("no such source", 500);
				expect(result).toBeNull();
			});

			it("should act correctly when given a timestamp less than all in the db", function() {
				result = processing.getNearestTimestamp("foo", 50);
				expect(result).toBe(100);
			});

			it("should act correctly when given a timestamp more than all in the db", function() {
				result = processing.getNearestTimestamp("foo", 1000);
				expect(result).toBe(400);
			});

			it("should treat 0 as a correct timestamp", function() {
				result = processing.getNearestTimestamp("foo", 0);
				expect(result).toBe(100);
			});

		});

		describe("getMedianValue", function() {

			beforeEach(function() {

				MarketData.remove({});
				MarketData.insert({ timestamp: 100, source: "foo", name: "Bitcoin",
					symbol: "BTC", metrics: { foo: 100 } });
				MarketData.insert({ timestamp: 200, source: "foo", name: "Bitcoin",
					symbol: "BTC", metrics: { foo: 200 } });
				MarketData.insert({ timestamp: 300, source: "foo", name: "Bitcoin",
					symbol: "BTC", metrics: { foo: 300 } });
				MarketData.insert({ timestamp: 400, source: "foo", name: "Bitcoin",
					symbol: "BTC", metrics: { foo: 400 } });
				MarketData.insert({ timestamp: 500, source: "foo", name: "Bitcoin",
					symbol: "BTC", metrics: { foo: 500 } });

			});

			it("should get median value for metrics.foo", function() {
				result = processing.getMedianValue("foo", {
					name: "Bitcoin",
					symbol: "BTC",
				}, "metrics.foo", 300);
				expect(result).toBe(400);
			});

		});

	});
});
