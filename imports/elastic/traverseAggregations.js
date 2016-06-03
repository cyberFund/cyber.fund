//buckethead

//  == Elasticsearch related feature
//
//    Nested aggegations in Elasticsearch query response are rendered as

//    resultObjcet
//      .aggregations
//        .<aggregationName>
//          .buckets
//            .<aggregationNextLevelName>
//              .buckets
//               .
//               .
//               .
//                .<aggregationLastLevelName>
//                  .hits
//                    .hits

//   with `buckets` and `hits.hits` being arrays. there are other fields with
//   meta data as well, not shown in the structure above
//
//   Function defined below accepts as its parameters
//   whole query responce (as given by [FXIME: paste file path here])
//    and an array of keys, that corresponds to aggregations ladder defined in
//   request
//   It returns joined elements of `hits.hits` arrays, gathered from
//   all buckets of given aggregation chain.

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
