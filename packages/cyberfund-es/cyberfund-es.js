// Write your package code here!
CF.ES = {};
var ns = CF.ES;
var esLib = Npm.require("elasticsearch");

Meteor.startup(function () {
    if (!ns._client) ns._client = ns._getClient();
});

_.extend(CF.ES, {
    _getClient: function () {
        return new esLib.Client(
            {
                host: 'http://' +
                process.env.ES_USERNAME +
                ':' + process.env.ES_PASSWORD +
                '@es.index.cyber.fund'
            });
    },
    /**
     * idea is: if we re going to provide some data to client via meteor methods
     * - let s extract what really needed first.
     * not used so far..
     * @param queryName
     * @returns {*}
     */
    getTransform: function (queryName) {
        if (ns.queries[queryName] && _.isFunction(ns.queries[queryName].transform)) {
            return ns.queries[queryName].transform;
        }
        return function bypass(data) {
            return data;
        }
    },
    /**
     * get query result based on its name and params
     * @param queryName - query name to get results from
     * @param params -
     * @returns  promise
     */
    sendQuery: function (queryName, params) {
        if (!ns.queries[queryName]) return {};
        var queryObject = ns.queries[queryName].getQueryObj(params);
        //console.log(ns._client);
        return ns._client.search(queryObject);
    },

    isClientQueryAllowed: function (queryName) {
        return ns.queries[queryName] && ns.queries[queryName].client_allowed;
    }
});

Meteor.methods({
    //method to provide client ability to execute es queries. probably, not needed.
    esQuery: function (queryName, params) {
        if (ns.isClientQueryAllowed(queryName)) {
            //if (params.transform)
            //  var transform = ns.queries.getTransform(params.transform);
            //return transform(CF.Utils.extractFromPromise(ns.sendQuery(queryName, params)))
            return CF.Utils.extractFromPromise(ns.sendQuery(queryName, params))
        }
        else return {
            error: "query " + queryName + " not allowed"
        }
    }
});

var most_recent_values = {
    "latest": {
        "top_hits": {
            "size": 1,
            "sort": [{"timestamp": {"order": "desc"}}], // sort order here interfers with ranges!!!11
            "_source": {
                "include": [
                    "supply_current",
                    "price_usd",
                    "price_btc",
                    "volume24_btc",
                    "volume24_usd",
                    "cap_btc",
                    "cap_usd"
                ]
            }
        }
    }
};
var latest_values = {
    "index": 'marketcap-read',
    "type": 'market',
    "size": 0,
    "body": {
        "aggs": {
            "by_system": {
                "terms": {
                    "field": "sym_sys",
                    "size": 0
                },
                "aggs": {
                    "by_time": {
                        "range": {
                            "field": "timestamp",
                            "ranges": [
                                // NOTE: resulting ranges seem being influenced by timestamp sorting we do in nested
                                // 'most_recent_values' aggregation. thus, re-indexing of `by_time` buckets is needed.

                                {"from": "now-1d","to": "now"}, // latest goes from here
                                {"from":"now-7d", "to": "now-1d"} //yesterday's goes from here.
                                //{"to": "now-7d"} //week ago..
                            ]
                        },
                        "aggs": most_recent_values
                    }
                }
            }
        }
    }
};

_.extend(ns, {
    queries: {
        /**
         * extends query object, if there are recognized parameters
         * this probably won't stay for long, but seems as good idea for handling aggregations.
         */
        _parametrize: function (qObj, params) { //TODO: some tests would be ok..
            function _extendQuery(qObj, extension) {
                if (!qObj.body.query) {
                    qObj.body.query = extension;
                } else {
                    var q0 = qObj.body.query;
                    qObj.body.query = {
                        "bool": {
                            "must": [
                                q0, extension
                            ]
                        }
                    }
                }
                return qObj;
            }

            var q;
            if (params.system) { // we thus able accepting single query. yet, not sure if it is effective..
                q = {"term": {"system": params.system}};
                return _extendQuery(qObj, q);
            }
            if (params.systems) { // we thus able accepting single query. yet, not sure if it is effective..
                q = {"bool": {"should": []}};
                _.each(params.systems, function (item) {
                    q.bool.should.push({"term": {"system": item}});
                });
                return _extendQuery(qObj, q);

            }
            return _extendQuery(qObj, {"wildcard": {"system": "*"}});
        },

        averages_last_15m: {
            client_allowed: true, //comment out to disable client ability calling this.
            getQueryObj: function (params) {
                // todo: allow passing set of keys with params,
                // to allow getting data by parts
                var ret = {
                    "index": 'marketcap-read',
                    "type": 'market',
                    "size": 0,
                    "body": {
                        "query": {
                            "range": {
                                "timestamp": {"from": "now-15m"}
                            }
                        },
                        "aggs": {
                            "by_system": {
                                "terms": {
                                    "field": "sym_sys",
                                    "size": 0
                                },
                                "aggs": {
                                    "avg_cap_btc": {
                                        "avg": {
                                            "field": "cap_btc"
                                        }
                                    },
                                    "avg_cap_usd": {
                                        "avg": {
                                            "field": "cap_usd"
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                if (params) return CF.ES.queries._parametrize(ret, params);
                return ret;
            }
        },

        latest_values: {
            //client_allowed: true,
            getQueryObj: function (params) {

                var ret = latest_values;
                if (params) return CF.ES.queries._parametrize(ret, params);
                return ret;
            }
        }
    }
});