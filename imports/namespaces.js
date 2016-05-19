const collection = new Mongo.collection('Metrics');

var Metrics = {
  collection: collection
  schema: {
    refId: "string",
    type: "string",
    subtype: "string",
    updatedOn: "date",
    data: "mixed"
  }
};

exports.Metrics = Metrics;

Metrics.v = 1
