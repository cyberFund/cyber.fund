var logger = CF.Utils.logger.getLogger("Q")

Meteor.methods({
  getQuotes: function(id) {
    logger.print("got request with", id)

    return {
      id: id,
      markets: [{
          market: "t1",
          quotes: {
            "a": 1,
            "b": 2
          }
        }, {
        market: "t2",
        quotes: {
          "a": 6,
          "c": 2
        }
      }]
    }
  }
})
