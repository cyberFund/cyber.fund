describe("fetching", function() {

	describe("get", function() {

		it("should call HTTP.get with correct url and options", function() {

			var url = "fake url";
			var options = { foo: "bar" };
			var callback = function() {};

			spyOn(HTTP, "get");

			fetching.get(url, options, callback);

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

			fetching.get(url, options, callback);

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

			fetching.get(url, options, callback);

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

			fetching.get(url, options, callback);

		});

	});

	describe("saveToDb", function() {

		it("should insert provided data into fetching.collection", function(done) {

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

			spyOn(fetching, "getCollection").and.callFake(function() {
				return {
					rawCollection:function() {
						return {
							insert: function(data, callback) {
								expect(data).toBe(fakeData);
								callback(null, []);
							},
						};
					},
				};
			});

			fetching.saveToDb(fakeData, callback);

		});

	});

});
