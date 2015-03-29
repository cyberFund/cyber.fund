Jasmine.onTest(function() {
	describe("publications", function() {

		describe("current-data", function() {

			beforeEach(function() {


			});

			it("should work nicely", function() {

				spyOn(MarketData, "findOne").and.returnValue({ timestamp: 12345 });

				spyOn(MarketData, "find").and.callFake(function(query, options) {

					expect(query).toEqual({
						timestamp: 12345,
					});

					expect(options).toEqual({ sort: { timestamp: -1 } });

					return { fake: "cursor" };

				});

				result = publications.getCurrentDataCursor();

				expect(result).toEqual({ fake: "cursor" });

			});

		});

	});
});
