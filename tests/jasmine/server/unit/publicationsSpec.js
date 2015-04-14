describe("publications", function() {

	describe("getCurrentDataCursor", function() {

		beforeEach(function() {

			spyOn(processing, "getNearestTimestamp").and.returnValue(12345);

		});

		it("should return MarketData collection cursor", function() {

			var fakeCursor = { fake: "cursor" };

			spyOn(MarketData, "find").and.returnValue(fakeCursor);

			result = publications.getCurrentDataCursor();

			expect(result).toBe(fakeCursor);

		});

		it("should use correct defaults", function(done) {

			spyOn(MarketData, "find").and.callFake(function(query, options) {

				expect(query).toEqual({
					timestamp: 12345,
				});

				expect(options).toEqual({ sort: { timestamp: -1 } });

				done();

			});

			publications.getCurrentDataCursor();

		});

	});

});
