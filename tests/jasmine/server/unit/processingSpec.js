describe("processing", function() {

	describe("getNearestTimestamp", function() {

		it("should get the last timestamp using MarketData.findOne", function() {

			spyOn(MarketData, "findOne").and.returnValue({ timestamp: 100 });

			result = processing.getNearestTimestamp();
			expect(result).toBe(100);

		});

	});

});
