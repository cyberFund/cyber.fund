Jasmine.onTest(function() {
	describe("fetching", function() {

		it("should fetch, process and save correct data", function(done) {

			var fakeUrl = "fake url";
			var fakeSource = "fake source name";
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

			fetching.fetchData(fakeUrl, fakeOptions, function(error, result) {

				fetching.processData(result, fakeSource, function(error, result) {

					expect(result).toEqual(expectedOutput);
					fetching.saveData(result, function(error, result) {

						expect(error).toBe(null);
						expect(result).toBe(true);
						done();

					});

				});

			});

		});

	});
});
