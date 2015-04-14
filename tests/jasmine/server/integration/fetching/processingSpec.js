Jasmine.onTest(function() {
	describe("processing", function() {

		describe("getNearestDocument", function() {

			beforeEach(function() {

				MarketData.remove({});
				MarketData.insert({ timestamp: 100, source: "foo",
					name: "Fakecoin", symbol: "FCK", metrics: { foo: 100 } });
				MarketData.insert({ timestamp: 100, source: "foo",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 100 } });
				MarketData.insert({ timestamp: 200, source: "foo",
					name: "Fakecoin", symbol: "FCK", metrics: { foo: 200 } });
				MarketData.insert({ timestamp: 200, source: "foo",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 200 } });
				MarketData.insert({ timestamp: 400, source: "foo",
					name: "Fakecoin", symbol: "FCK", metrics: { foo: 400 } });
				MarketData.insert({ timestamp: 400, source: "foo",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 400 } });
				MarketData.insert({ timestamp: 300, source: "bar",
					name: "Fakecoin", symbol: "FCK", metrics: { foo: 300 } });
				MarketData.insert({ timestamp: 300, source: "bar",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 300 } });
				MarketData.insert({ timestamp: 500, source: "bar",
					name: "Fakecoin", symbol: "FCK", metrics: { foo: 500 } });
				MarketData.insert({ timestamp: 500, source: "bar",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 500 } });

			});

			it("should get any latest document by default", function() {
				var result = processing.getNearestDocument();
				expect(result.timestamp).toBe(500);
				expect(result.source).toBe("bar");
			});

			it("should get any latest document for a given source", function() {
				var result = processing.getNearestDocument("foo");
				expect(result.timestamp).toBe(400);
				expect(result.source).toBe("foo");
			});

			it("should get the nearest document to a given timestamp", function() {
				var result = processing.getNearestDocument(null, 290);
				expect(result.timestamp).toBe(300);
				expect(result.source).toBe("bar");
			});

			it("should get the nearest document to a given timestamp with a given source", function() {
				var result = processing.getNearestDocument("bar", 420);
				expect(result.timestamp).toBe(500);
				expect(result.source).toBe("bar");
			});

			it("should return null when there's no such source", function() {
				var result = processing.getNearestDocument("no such source");
				expect(result).toBeNull();
			});

			it("should return null when there's no such source when given a timestamp", function() {
				var result = processing.getNearestDocument("no such source", 500);
				expect(result).toBeNull();
			});

			it("should act correctly when given a timestamp less than all in the db", function() {
				var result = processing.getNearestDocument("foo", 50);
				expect(result.timestamp).toBe(100);
			});

			it("should act correctly when given a timestamp more than all in the db", function() {
				var result = processing.getNearestDocument("foo", 1000);
				expect(result.timestamp).toBe(400);
			});

			it("should treat 0 as a correct timestamp", function() {
				var result = processing.getNearestDocument("foo", 0);
				expect(result.timestamp).toBe(100);
			});

			it("should get the latest document of a given system", function() {
				var result = processing.getNearestDocument(null, null, { name: "Bestcoin", symbol: "YAY" });
				expect(result).toEqual({ _id: jasmine.any(String), timestamp: 500, source: "bar",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 500 } });
			});

			it("should get the nearest document of a given system to a timestamp", function() {
				var result = processing.getNearestDocument(null, 290, { name: "Bestcoin", symbol: "YAY" });
				expect(result).toEqual({ _id: jasmine.any(String), timestamp: 300, source: "bar",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 300 } });
			});

			it("should get the nearest document of given system and source to a timestamp", function() {
				var result = processing.getNearestDocument("foo", 310, { name: "Bestcoin", symbol: "YAY" });
				expect(result).toEqual({ _id: jasmine.any(String), timestamp: 400, source: "foo",
					name: "Bestcoin", symbol: "YAY", metrics: { foo: 400 } });
			});

			it("should get the nearest document of given system and source, only given field", function() {
				var result = processing.getNearestDocument("foo", 290, { name: "Bestcoin", symbol: "YAY" },
					"metrics.foo");
				expect(result).toEqual(200);
			});

			it("should get the latest document of given system and source, only given field", function() {
				var result = processing.getNearestDocument("foo", null, { name: "Bestcoin", symbol: "YAY" },
					"metrics.foo");
				expect(result).toEqual(400);
			});

		});

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
				var result = processing.getNearestTimestamp();
				expect(result).toBe(500);
			});

			it("should get the latest timestamp for a given source", function() {
				var result = processing.getNearestTimestamp("foo");
				expect(result).toBe(400);
			});

			it("should get the nearest timestamp to a given one", function() {
				var result = processing.getNearestTimestamp(null, 290);
				expect(result).toBe(300);
			});

			it("should get the nearest timestamp to a given one for a given source", function() {
				var result = processing.getNearestTimestamp("bar", 420);
				expect(result).toBe(500);
			});

			it("should return null when there's no such source", function() {
				var result = processing.getNearestTimestamp("no such source");
				expect(result).toBeNull();
			});

			it("should return null when there's no such source when given a timestamp", function() {
				var result = processing.getNearestTimestamp("no such source", 500);
				expect(result).toBeNull();
			});

			it("should act correctly when given a timestamp less than all in the db", function() {
				var result = processing.getNearestTimestamp("foo", 50);
				expect(result).toBe(100);
			});

			it("should act correctly when given a timestamp more than all in the db", function() {
				var result = processing.getNearestTimestamp("foo", 1000);
				expect(result).toBe(400);
			});

			it("should treat 0 as a correct timestamp", function() {
				var result = processing.getNearestTimestamp("foo", 0);
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
				var result = processing.getMedianValue("foo", {
					name: "Bitcoin",
					symbol: "BTC",
				}, "metrics.foo", 300);
				expect(result).toBe(400);
			});

		});

		describe("addPostprocessor and doPostprocessing", function() {

			it("should work nicely", function() {
				var fakeData = { fake: "data" };

				var proc1 = jasmine.createSpy();
				var proc2 = jasmine.createSpy();

				processing.addPostprocessor(proc1);
				processing.addPostprocessor(proc2);

				processing.doPostprocessing("foo", 12345, fakeData);

				expect(proc1.calls.count()).toBe(1);
				expect(proc1).toHaveBeenCalledWith("foo", 12345, fakeData);
				expect(proc2.calls.count()).toBe(1);
				expect(proc2).toHaveBeenCalledWith("foo", 12345, fakeData);

				processing.doPostprocessing("bar", 12345, fakeData);

				expect(proc1.calls.count()).toBe(2);
				expect(proc1.calls.mostRecent().args[0]).toBe("bar");
				expect(proc1.calls.mostRecent().args[1]).toBe(12345);
				expect(proc1.calls.mostRecent().args[2]).toBe(fakeData);
				expect(proc2.calls.count()).toBe(2);
				expect(proc2.calls.mostRecent().args[0]).toBe("bar");
				expect(proc2.calls.mostRecent().args[1]).toBe(12345);
				expect(proc2.calls.mostRecent().args[2]).toBe(fakeData);
			});

		});

	});
});
