import winston from 'winston'

//buckethead

//  == Elasticsearch related feature
//
//    Nested aggegations in Elasticsearch query response are rendered as

//    resultObject
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

//                                  sample usage
//
// const flatten = require("..//imports/api/elastic/traverseAggregations").flatten
//
// fetchXchangeData = () => {
//   const data = CF.Utils.extractFromPromise(cfEs.sendQuery ("xchangeData"));
//   if (data && data.aggregations)
//     return flatten(data, ['by_quote', 'by_base', 'by_market', 'latest']);
//   else
//     return []
// }

function flattenAggregations(resultObject, keysIn){

  let keys = keysIn.slice();
  //print ("running with keys", keys, true);
  let lengths = [];
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
    key = keys.shift();
    results = keys.length > 0 ? gimmeBuckets(results, key) : gimmeHits(results, key)
    lengths.push(results.length);
  } while (keys.length > 0)
  //print_ ("resulting buckets by level", lengths, true)
  return results;
}

exports.flatten = flattenAggregations
