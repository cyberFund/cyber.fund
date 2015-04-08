describe("fetching.coinMarketCap", function() {

	describe("proccessData", function() {

		it("should pass array of systems", function(done) {

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

			var callback = function(error, output) {
				expect(error).toBe(null);
				expect(output).toEqual(expectedOutput);
				done();
			};

			fetching.coinMarketCap.processData(fakeData, callback);

		});

	});

});
