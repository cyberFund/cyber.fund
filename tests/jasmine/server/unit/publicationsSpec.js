describe("publications", function() {

	describe("getLatestTimestamp", function() {

		it("should get the last timestamp using MarketData.findOne", function() {

			spyOn(MarketData, "findOne").and.callFake(function(query, options) {

				expect(query).toEqual({});
				expect(options).toEqual({
					sort: { timestamp: -1 },
					fields: { timestamp: 1 },
				});

				return { timestamp: 12345 };

			});

			result = publications.getLatestTimestamp();

			expect(result).toBe(12345);

		});

	});

	describe("getCurrentDataCursor", function() {

		beforeEach(function() {

			spyOn(publications, "getLatestTimestamp").and.returnValue(12345);

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

				expect(options).toEqual({
					sort: { timestamp: -1 },
					limit: 10,
					offset: 0,
				});

				done();

			});

			publications.getCurrentDataCursor();

		});

	});

});
