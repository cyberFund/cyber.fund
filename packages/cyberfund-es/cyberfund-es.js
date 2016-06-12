// TODO: rename file
CF.ES = {};
var ns = CF.ES;
var esLib = Npm.require("elasticsearch");

const LAST = "price"

Meteor.startup(function() {
  if (!ns._client) ns._client = ns._getClient();
});

_.extend(CF.ES, {
  _getClient: function() {
    return new esLib.Client({
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
  getTransform: function(queryName) {
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
  sendQuery: function(queryName, params) {
    if (!ns.queries[queryName]) return {};
    var queryObject = ns.queries[queryName].getQueryObj(params);
    //console.log(ns._client);
    return ns._client.search(queryObject);
  },

  isClientQueryAllowed: function(queryName) {
    return ns.queries[queryName] && ns.queries[queryName].clientAllowed;
  }
});

Meteor.methods({
  //method to provide client ability to execute es queries. probably, not needed.
  esQuery: function(queryName, params) {
    if (ns.isClientQueryAllowed(queryName)) {
      //if (params.transform)
      //  var transform = ns.queries.getTransform(params.transform);
      //return transform(CF.Utils.extractFromPromise(ns.sendQuery(queryName, params)))
      return CF.Utils.extractFromPromise(ns.sendQuery(queryName, params))
    } else {
      return {
        error: "query " + queryName + " not allowed"
      }
    }
  }
});

var most_recent_values = {
  "latest": {
    "top_hits": {
      "size": 1,
      "sort": [{
        "timestamp": {
          "order": "desc"
        }
      }]
    }
  }
};

_.extend(ns, {
  queries: {
    /**
     * extends query object, if there are recognized parameters
     * this probably won't stay for long, but seems as good idea for handling aggregations.
     */
    _parametrize: function(qObj, params) {
      /**
       * adds query by system/systems to the aggregation query
       * aware of both cases there is query and there is no query before
       * @param qObj - full query object (including index, type, aggregations...)
       * @param extension
       * @returns {*} query extended by searching specific systems
       */
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
      if (params.system) {
        q = {
          "term": {
            "sym_sys": params.system
          }
        };
        return _extendQuery(qObj, q);
      }
      if (params.systems) {
        q = {
          "bool": {
            "should": []
          }
        };
        _.each(params.systems, function(item) {
          q.bool.should.push({
            "term": {
              "sym_sys": item
            }
          });
        });
        return _extendQuery(qObj, q);

      }
      return qObj; //_extendQuery(qObj, {"wildcard": {"sym_sys": "*"}});
    },

    averages_last_15m: {
      clientAllowed: false, //comment out to disable client ability calling this.
      getQueryObj: function(params) {
        var ret = {
          "index": 'marketcap-read',
          "type": 'market',
          "size": 0,
          "body": {
            "query": {
              "range": {
                "timestamp": {
                  "from": "now-15m"
                }
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

    average_values_date_histogram: {
      // from, to, interval.
      getQueryObj: function(params) {
        if (!params.from || !params.to || !params.interval) {
          console.warn("average_values_date_histogram was called with missing parameters");
          console.warn("please provide 'from', 'to' and 'interval'");
          return;
        }
        var ret = {
          "index": 'marketcap-read',
          "type": 'market',
          "size": 0,
          "body": {
            "query": {
              "range": {
                "timestamp": {
                  "gte": params.from, //gte-lt are used to force desired behavior:
                  "lt": params.to //passing in "from: "now-1h/h", to: "now/h", outputs exactly results for last full hour (8:00-9:00 for 9:15)
                }
              }
            },
            "aggs": {
              "by_system": {
                "terms": {
                  "field": "sym_sys",
                  "size": 0
                },
                "aggs": {
                  "over_time": {
                    "date_histogram": {
                      "field": "timestamp",
                      "interval": params.interval
                    },
                    "aggs": {
                      "cap_usd": {
                        "avg": {
                          "field": "cap_usd"
                        }
                      },
                      "cap_btc": {
                        "avg": {
                          "field": "cap_btc"
                        }
                      },
                      "price_usd": {
                        "avg": {
                          "field": "price_usd"
                        }
                      },
                      "price_btc": {
                        "avg": {
                          "field": "price_btc"
                        }
                      },
                      "volume24_btc": {
                        "avg": {
                          "field": "volume24_btc"
                        }
                      },
                      "volume24_usd": {
                        "avg": {
                          "field": "volume24_usd"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
        if (params.system || params.systems)
          ret = CF.ES.queries._parametrize(ret, params);
        return ret;
      }
    },

    latest_values: {
      //clientAllowed: true,
      getQueryObj: function(params) { //not "latest" anymore
        if (!params.from || !params.to) {
          console.warn("average_values_date_histogram was called with missing parameters");
          console.warn("please provide 'from' and 'to' ");
          return;
        }
        var ret = {
          "index": 'marketcap-read',
          "type": 'market',
          "size": 0,
          "body": {
            "query": {
              "range": {
                "timestamp": {
                  "gt": params.from, //gte-lt are used to force desired behavior:
                  "lt": params.to //passing in "from: "now-1h/h", to: "now/h", outputs exactly results for last full hour (8:00-9:00 for 9:15)
                }
              }
            },
            "aggs": {

              "by_system": {
                "terms": {
                  "field": "sym_sys",
                  "size": 0
                },

                "aggs": most_recent_values
              }
            }
          }
        };
        var print = CF.Utils.logger.print;
        print("latest_values query", ret.body.query);
        if (params) return CF.ES.queries._parametrize(ret, params);
        return ret;
      }
    },

    xchangeData: { //only for tests here..
      clientAllowed: true,
      getQueryObj: function(params) { //not "latest" anymore
        params = params || {}
        if (!params.from || !params.to) {
          params.from = "now-1h";
          params.to = "now";
        }

        var ret = {
          "index": 'xchange-read',
          "type": 'point',
          "size": 0,
          "body": {
            "query": {
              "range": {
                "timestamp": {
                  "gt": params.from, //gte-lt are used to force desired behavior:
                  "lt": params.to //passing in "from: "now-1h/h", to: "now/h", outputs exactly results for last full hour (8:00-9:00 for 9:15)
                }
              }
            },
            "aggs": {
              "by_quote": {
                "terms": {
                  "field": "quote",
                  "size": 0
                },
                "aggs": {
                  "by_base": {
                    "terms": {
                      "field": "base",
                      "size": 0
                    },
                    "aggs": {
                      "by_market": {
                        "terms": {
                          "field": "market",
                          "size": 0
                        },
                        "aggs": {
                          "latest": {
                            "top_hits": {
                              "size": 1,
                              "sort": [{
                                "timestamp": {
                                  "order": "desc"
                                }
                              }]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
        var print = CF.Utils.logger.print;
        print("vwap_data query", ret.body.query);
        //if (params) return CF.ES.queries._parametrize(ret, params);
        return ret;
      }
    },

    xchangeVwapData: { //only for tests here..
      clientAllowed: true,
      getQueryObj: function(params) { //not "latest" anymore
        params = params || {}
        if (!params.from || !params.to) {
          params.from = "now-10m";
          params.to = "now";
        }

        var ret = {
          "index": 'xchange-vwap-read',
          "type": 'point',
          "size": 0,
          "body": {
            "query": {
              "range": {
                "timestamp": {
                  "gt": params.from, //gte-lt are used to force desired behavior:
                  "lt": params.to //passing in "from: "now-1h/h", to: "now/h", outputs exactly results for last full hour (8:00-9:00 for 9:15)
                }
              }
            },
            "aggs": {
              "by_quote": {
                "terms": {
                  "field": "quote",
                  "size": 0
                },
                "aggs": {
                  "by_base": {
                    "terms": {
                      "field": "base",
                      "size": 0
                    },
                    "aggs": {
                      "latest": {
                        "top_hits": {
                          "size": 1,
                          "sort": [{
                            "timestamp": {
                              "order": "desc"
                            }
                          }]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
        var print = CF.Utils.logger.print;
        print("vwap_data query", ret.body.query);
        //if (params) return CF.ES.queries._parametrize(ret, params);
        return ret;
      }
    },

    xchangeVwapBySystem: { //only for tests here..
      clientAllowed: true,
      getQueryObj: function(params) { //not "latest" anymore
        console.log(params)
        console.log(1111)
        params = params || {}
        if (!params.from || !params.to) {
          params.from = "now-10m";
          params.to = "now";
        }
        if (!params.system) {
          console.log(222)
          throw {error: "no system passed"};
        }

        var ret = {
          "index": 'xchange-vwap-read',
          "type": 'point',
          "size": 0,
          "body": {
            "query": {
              "bool": {
                "filter": [{
                    "range": {
                      "timestamp": {
                        "gt": params.from,
                        "lt": params.to
                      }
                    }
                  },
                    {
                      "bool": {"should": [
                        {"match": {"base": params.system} },
                        {"match": {"quote": params.system} }
                    ]
                  }
                }]
              }
            },
            "aggs": {
              "by_quote": {
                "terms": {
                  "field": "quote",
                  "size": 0
                },
                "aggs": {
                  "by_base": {
                    "terms": {
                      "field": "base",
                      "size": 0
                    },
                    "aggs": {
                      "latest": {
                        "top_hits": {
                          "size": 1,
                          "sort": [{
                            "timestamp": {
                              "order": "desc"
                            }
                          }]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
        var print = CF.Utils.logger.print;
        print("vwap_data query", ret.body.query.bool);
        //if (params) return CF.ES.queries._parametrize(ret, params);
        return ret;
      }
    },

    xchangeDataBySystem: { //only for tests here..
      clientAllowed: true,
      getQueryObj: function(params) { //not "latest" anymore
        console.log(params)
        console.log(1111)
        params = params || {}
        if (!params.from || !params.to) {
          params.from = "now-10m";
          params.to = "now";
        }
        if (!params.system) {
          console.log(222)
          throw {error: "no system passed"};
        }

        var ret = {
          "index": 'xchange-read',
          "type": 'point',
          "size": 0,
          "body": {
            "query": {
              "bool": {
                "filter": [{
                    "range": {
                      "timestamp": {
                        "gt": params.from,
                        "lt": params.to
                      }
                    }
                  },
                    {
                      "bool": {"should": [
                        {"match": {"base": params.system} },
                        {"match": {"quote": params.system} }
                    ]
                  }
                }]
              }
            },
            "aggs": {
              "by_quote": {
                "terms": {
                  "field": "quote",
                  "size": 0
                },
                "aggs": {
                  "by_base": {
                    "terms": {
                      "field": "base",
                      "size": 0
                    },
                    "aggs": {
                      "by_market": {
                        "terms": {
                          "field": "market",
                          "size": 0
                        },
                        "aggs": {
                          "latest": {
                            "top_hits": {
                              "size": 1,
                              "sort": [{
                                "timestamp": {
                                  "order": "desc"
                                }
                              }]
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        };
        var print = CF.Utils.logger.print;
        print("vwap_data query", ret.body.query.bool);
        return ret;
      }
    }
  }
});
