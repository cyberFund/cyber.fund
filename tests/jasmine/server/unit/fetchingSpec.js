describe("fetching", function() {

	describe("fetchData", function() {

		it("should call HTTP.get with the same url and options", function() {

			var url = "fake url";
			var options = { foo: "bar" };
			var callback = function() {};

			spyOn(HTTP, "get");

			fetching.fetchData(url, options, callback);

			expect(HTTP.get.calls.count()).toEqual(1);
			expect(HTTP.get).toHaveBeenCalledWith(url, options, jasmine.any(Function));

		});

		it("should pass parsed data to the callback", function(done) {

			var url = "fake url";
			var options = { foo: "bar" };
			var rawResult = { data: { timestamp: "12345", markets: [] } };

			var callback = function(error, data) {
				expect(error).toBe(null);
				expect(data).toBe(rawResult.data);
				done();
			};

			spyOn(HTTP, "get").and.callFake(function(url, options, callback) {
				callback(null, rawResult);
			});

			fetching.fetchData(url, options, callback);

		});

		it("should pass error to the callback if there is one", function(done) {

			var url = "fake url";
			var options = { foo: "bar" };
			var rawError = { error: "fake error" };

			var callback = function(error, data) {
				expect(error).toBe(rawError);
				done();
			};

			spyOn(HTTP, "get").and.callFake(function(url, options, callback) {
				callback(rawError);
			});

			fetching.fetchData(url, options, callback);

		});

		it("should pass error to the callback if there is no data", function(done) {

			var url = "fake url";
			var options = { foo: "bar" };
			var rawResult = { body: "Not found!" };

			var callback = function(error, data) {
				expect(error instanceof Error).toBe(true);
				expect(data).toBeUndefined();
				done();
			};

			spyOn(HTTP, "get").and.callFake(function(url, options, callback) {
				callback(null, rawResult);
			});

			fetching.fetchData(url, options, callback);

		});

	});

	describe("proccessData", function() {

		it("should pass array of systems", function(done) {

			var fakeSource = "fake source name";

			var fakeData = {
				timestamp: 12345,
				markets: [
					{
						position: 2,
						name: "Fakecoin",
						symbol: "FCK",
						marketCap: { foo: "bar" },
						timestamp: 12345,
					},
					{
						position: 1,
						name: "Bestcoin",
						symbol: "YAY",
						marketCap: { qux: "baz" },
						timestamp: 12345,
					},
				],
			};

			var expectedOutput = [
				{
					name: "Fakecoin",
					symbol: "FCK",
					timestamp: 12345,
					source: fakeSource,
					metrics: {
						marketCap: { foo: "bar" },
					},
				},
				{
					name: "Bestcoin",
					symbol: "YAY",
					timestamp: 12345,
					source: fakeSource,
					metrics: {
						marketCap: { qux: "baz" },
					},
				},
			];

			var callback = function(error, output) {
				expect(error).toBe(null);
				expect(output).toEqual(expectedOutput);
				done();
			};

			fetching.processData(fakeData, fakeSource, callback);

		});

		it("should pass error if no source provided", function(done) {

			var fakeData = {
				timestamp: 12345,
				markets: [
					{
						position: 2,
						name: "Fakecoin",
						symbol: "FCK",
						marketCap: { foo: "bar" },
						timestamp: 12345,
					},
					{
						position: 1,
						name: "Bestcoin",
						symbol: "YAY",
						marketCap: { qux: "baz" },
						timestamp: 12345,
					},
				],
			};

			fetching.processData(fakeData, null, function(error, output) {
				expect(error instanceof Error).toBe(true);
				expect(output).toBeUndefined();

				fetching.processData(fakeData, "", function(error, output) {
					expect(error instanceof Error).toBe(true);
					expect(output).toBeUndefined();
					done();
				});

			});

		});

	});

	describe("saveData", function() {

		it("inserts provided data into MarketData", function(done) {

			var fakeData = [
				{
					name: "Fakecoin",
					symbol: "FCK",
					timestamp: 12345,
					source: "fake source name",
					metrics: {
						marketCap: { foo: "bar" },
					},
				},
				{
					name: "Bestcoin",
					symbol: "YAY",
					timestamp: 12345,
					source: "fake source name",
					metrics: {
						marketCap: { qux: "baz" },
					},
				},
			];

			var callback = function(error, result) {
				expect(error).toBe(null);
				expect(result).toBe(true);
				done();
			};

			spyOn(MarketData, "rawCollection").and.callFake(function() {
				return {
					insert: function(data, callback) {
						expect(data).toBe(fakeData);
						callback(null, []);
					},
				};
			});

			fetching.saveData(fakeData, callback);

		});

	});

});
