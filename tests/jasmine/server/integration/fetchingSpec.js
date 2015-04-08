Jasmine.onTest(function() {
	describe("fetching", function() {

		it("should be able to fetch CoinMarketCap correctly", function(done) {

			var fakeUrl = "fake url";
			var fakeOptions = { foo: "bar" };
			var callback = function() {};

			var fakeRawData = {
				data: {
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
				},
			};

			var expectedOutput = [
				{
					name: "Fakecoin",
					symbol: "FCK",
					timestamp: 12345,
					source: "CoinMarketCap",
					metrics: {
						marketCap: { foo: "bar" },
					},
				},
				{
					name: "Bestcoin",
					symbol: "YAY",
					timestamp: 12345,
					source: "CoinMarketCap",
					metrics: {
						marketCap: { qux: "baz" },
					},
				},
			];

			spyOn(HTTP, "get").and.callFake(function(url, options, callback) {
				callback(null, fakeRawData);
			});

			spyOn(MarketData, "rawCollection").and.callFake(function() {
				return {
					insert: function(data, callback) {
						callback(null, []);
					},
				};
			});

			fetching.get(fakeUrl, fakeOptions, function(error, result) {
				expect(error).toBe(null);

				fetching.coinMarketCap.processData(result, function(error, result) {
					expect(error).toBe(null);
					expect(result).toEqual(expectedOutput);

					fetching.saveToDb(result, function(error, result) {
						expect(error).toBe(null);
						expect(result).toBe(true);
						done();
					});

				});

			});

		});

	});
});
