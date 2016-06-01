//buckethead
function flattenAggregations(resultObject, keysIn){
  let keys = keysIn.slice();
  console.log(keys);
  let results = resultObject['aggregations'];

  function gimmeBuckets(buckets, key){
    function gimme(bucket, key){
      return bucket[key] && bucket[key].buckets
    }
    if (_.isArray(buckets)) {
      return _.flatten(_.map(buckets, (bucket) => {
        return gimme(bucket, key)
      }));
    }

    if (_.isObject(buckets)) {
      return gimme(buckets, key);
    } else {
      throw (`error traversing aggregation - no such key ${key} in sequence ${keysIn} and given result`)
    }
  }

  function gimmeHits(buckets, key){
    function gimme(bucket, key){
      return bucket[key] && bucket[key].hits && bucket[key].hits.hits;
    }
    if (_.isArray(buckets)) {
      return _.flatten(_.map(buckets, (bucket) => {
        return gimme(bucket, key);
      }))
    }
    if (_.isObject(buckets)) {
      return gimme(buckets, key)
    }
  }

  do {
    console.log(keys);
    key = keys.shift();
    results = keys.length > 0 ? gimmeBuckets(results, key) : gimmeHits(results, key)
    console.log(results)
  } while (keys.length > 0)
  return results;
}
exports.flatten = flattenAggregations
