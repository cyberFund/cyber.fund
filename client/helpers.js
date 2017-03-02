import {CurrentData} from '/imports/api/collections'
import {deltaPercents, formatters, readableNumbers} from '/imports/api/client/utils/base'
import {listFromIds} from '/imports/api/utils/user'
/**
 * repressent string (of digits) splitting it in groups of 3, from begin
 *   to be used for string part before decimal dot
 * @param input - string to be split
 * @param sep - separator
 * @returns altered string
 */
function group3natural(input, sep) {
  while (/(\d+)(\d{3})/.test(input.toString())) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + (sep || ",") + "$2");
  }
  return input;
}

/**
 * repressent string (of digits) splitting it in groups of 3, from end
 *   to be used for string part after decimal dot
 * @param input - string to be split
 * @param sep - separator
 * @returns altered string
 */
function group3decimal(input, sep) {
  while (/(\d{3})(\d+)/.test(input.toString())) {
    input = input.toString().replace(/(\d{3})(\d+)/, "$1" + (sep || ",") + "$2");
  }
  return input;
}

function escapeNaN(formatter){
  return function(value){
    return isNaN(value) ? "_#_" : formatter(value);
  };
}

var helpers = {
  eq: function
    (value1, value2) {
    return value1 === value2;
  },
  neq: function (v1, v2) {
    return v1 !== v2;
  },
  gt: function (value1, value2) {
    return value1 > value2;
  },
  lt: function (value1, value2) {
    return value1 < value2;
  },
  lte: function (value1, value2) {
    return value1 <= value2;
  },
  gte: function (value1, value2) {
    return value1 >= value2;
  },
  and: function (value1, value2) {
    return value1 && value2;
  },
  not: function (value) {
    return !value;
  },
  or: function (value1, value2) {
    return value1 || value2;
  },

  contains: function (list, value) { // if given list contains given value or not
    return _.contains(list, value);
  },

  slice: function (list, start, end) { // apply javascript array 'slice' operation
    list = list || [];

    return list.slice(start, end);
  },

  keyValue: function (context) {
    return _.map(context, function (value, key) {
      return {
        key: key,
        value: value
      };
    });
  },
  sum: function (value1, value2) {
    return value1 + value2;
  },

  dif: function (v1, v2) {
    return parseInt(v1) - parseInt(v2);
  },
  mathCeil: function(v) {
    return Math.ceil(v);
  },
  session: function (key) {
    return Session.get(key);
  },

  concat: function (value1, value2) {
    return value1.toString() + value2.toString();
  },
  values_of: function (arr_or_obj) {
    var arr = _.clone(arr_or_obj);
    if (typeof arr == "object") {
      return $.map(arr, function (value, index) {
        return [value];
      });
    }
    return arr;
  },

  log: function (value) {
    console.log(value);
  },

  absoluteUrl: function () {
    return Meteor.absoluteUrl();
  },

  randomOf: function (from, to) {
    return from + Math.floor(Math.random() * (to - from + 1));
  },
  readableNumbers: readableNumbers,
  readableN: function(input, roundTo){
    return escapeNaN(d3.format(",."+roundTo||0+"f"))(input);
  },
  readableN0: escapeNaN(formatters.readableN0),
  readableN1: escapeNaN(formatters.readableN1),
  readableN2: escapeNaN(formatters.readableN2),
  readableN3: escapeNaN(formatters.readableN3),
  readableN4: escapeNaN(formatters.readableN4),
  readableN8: escapeNaN(formatters.readableN8),
  roundedN4: escapeNaN(formatters.roundedN4),
  meaningful3: escapeNaN(formatters.meaningful3),
  meaningful4: escapeNaN(formatters.meaningful4),
  meaningfulNice4: function(value){
    return escapeNaN(value >= 1000 ? formatters.readableN0 :
    formatters.meaningful4)(value);
  },
  meaningful4Si: escapeNaN(formatters.meaningful4Si),
  withSign: escapeNaN(formatters.withSign),
  isNumber: function (value) {
    return _.isNumber(value);
  },
  percents: escapeNaN(formatters.percents),
  percents0: escapeNaN(formatters.percents0),
  percents1: escapeNaN(formatters.percents1),
  percents2: escapeNaN(formatters.percents2),
  percents3: escapeNaN(formatters.percents3),

  isObject: function (value) {
    return _.isObject(value);
  },

  isEmpty: function (value) {
    return _.isEmpty(value);
  },

  satoshi_decimals: function (value, precision) {
    if (!precision && precision != 0) precision = 8;
    try {
      value = parseFloat(value);
    } catch (e) {

    }
    var out = value.toFixed(precision).split(".");
    var ret = "";
    if (out[0]) ret += group3natural(out[0]);
    if (out[1]) ret += "." + group3decimal(out[1], " ");
    return ret;
  },


  isBeforeNow: function (date) {
    var m = moment(date);
    return m.isBefore(moment());
  },
  isAfterNow: function (date/*, format*/) {
    var m = moment(date);
    return m.isAfter(moment());
  },
  isNowBetween: function (date1, date2/*, format*/) {
    var m1 = moment(date1),
      m2 = moment(date2);
    return moment().isBetween(m1, m2);
  },

  // days before date
  daysLeft: function (date) {
    return  moment(date).diff( moment() , "days");
  },

  // since date
  daysPassed: function (date) {
    return  moment().diff(moment(date), "days");
  },

  // when displaying string (e.g. CurrentData._id) as url path segment
  _toUnderscores: function (str) {
    return !!str ? str.replace(/\ /g, "_") : "";
  },

  // opposite to _toUnderscores
  _toSpaces: function (str) {
    return !!str ? str.replace(/_/g, " ") : "";
  },

  // html attribute-'friendly' string
  _toAttr: function (str) {
    return !!str ? str.replace(/\ /g, "_").replace(/\(/g, "_")
    .replace(/\)/g, "_").replace(/\./g, "_") : "";
  },
  usersCount: function () {
    return Counts.get("usersCount");
  },
  coinsCount: function(){
    return Counts.get("coinsCount");
  },

  _system_type_: function(key){
    var types = {
      dapp: "Decentralized application"
    };
    return types[key] || key;
  },
  _specs_: function (key) {
    var specs = {
      block_time: "Target Block Time, seconds",
      rpc: "RPC Port",
      block_reward: "Block Reward",
      halfing_cycle: "Reward Halfing Cycle, blocks",
      total_tokens: "Total Tokens",
      difficulty_cycle: "Difficulty Cycle, blocks",
      txs_confirm: "Guaranted TX confirm, blocks"
    };
    return specs[key] || key;
  },
  _specs__: function (key, key2) {
    var specs = {
      cap: {
        usd: "USD Capitalization",
        btc: "Bitcoin capitalization"
      }
    };
    return specs[key] && specs[key][key2] ? specs[key][key2] : key + "_" + key2;
  },
  displaySystemName: function (system) { //see "ALIASES"
    var ret;
    if (system.aliases)
      ret = system.aliases.nickname;
    if (!ret) ret = system._id;
    return ret;
  },
  displayCurrencyName: function (system) {
    if (typeof system == "string") system = CurrentData.findOne({_id: system});
    if (system) return system.token ? system.token.name : system._id;
    else return "";
  },
  systemFromId: function (id){
    return CurrentData.findOne({_id:id});
  },
  ownUsername: function(){
    var user =  Meteor.user();
    if (!user) return "";
    return (user.username) || "";
  },
  _largeAvatar: function(user){
    return user.largeAvatar || user.avatar || "";
  },
  dateFormat: function(date, format){
    return moment(date).format(format);
  },
  usersListFromIds: function(listFromIds) {
    return listFromIds(listFromIds);
  },
  userHasPublicAccess: function userHasPublicAccess() {
    return true;
  },
  pxViewportWidth: function getPxViewportWidth(){
    return window.innerWidth;
  },
  pxViewportHeight: function getPxViewportHeight(){
    return window.innerHeight;
  },

  // cf base helpers
  tagMatchesTags: function (tag, tags) {
    return tags.indexOf(tag) > -1;
  },

  cdTurnover: function turnover () {
    var metrics = this.metrics;
      if (metrics.cap && metrics.cap.btc) {
          return 100.0 * metrics.turnover;
      }
    return 0;
  },

  cdSymbol: function symbol () {
    if (this.token && this.token.symbol) {
      return this.token.symbol
    }
    return "";
  },

  //////////////// marketdata helperss
  dailyTradeVolumeToText: function (volumeDaily, absolute, needDigit) {
    if (!absolute) {
      return needDigit ? 0 : "Normal";
    }

    if (Math.abs(volumeDaily / absolute) === 0) return needDigit ? 0 : "Illiquid";
    if (Math.abs(volumeDaily / absolute) < 0.0001) return needDigit ? 0.1 : "Very Low";
    if (Math.abs(volumeDaily / absolute) < 0.001) return needDigit ? 0.2 : "Low";
    if (Math.abs(volumeDaily / absolute) < 0.005) return needDigit ? 0.3 : "Normal";
    if (Math.abs(volumeDaily / absolute) < 0.02) return needDigit ? 0.4 : "High";
    return needDigit ? 0.5 : "Very High";
  },
  greenRedNumber: function (value) {
    return (value < 0) ? "red-text" : "green-text";
  },
  inflationToText: function (percents) {
    if (percents < 0) {
      return "Deflation " + (-percents).toFixed(2) + "%";
    } else if (percents > 0) {
      return "Inflation " + percents.toFixed(2) + "%";
    } else {
      return "Stable";
    }
  },
  percentsToTextUpDown: function (percents, precision) {
    if (!precision) precision = 2;
    if (precision == 100) precision = 0;

    if (percents < 0) {
      return "↓ " + (-percents.toFixed(precision)) + "%";
    } else if (percents > 0) {
      return "↑ " + percents.toFixed(precision) + "%";
    } else {
      return "= 0%";
    }
  },
  dayToDayTradeVolumeChange: function(system) {
    var metrics = system.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.day) {
      return deltaPercents(metrics.tradeVolumePrevious.day, metrics.tradeVolume);
    }
    return 0;
  },
  monthToMonthTradeVolumeChange: function(system) {
    var metrics = system.metrics;
    if (metrics.tradeVolumePrevious && metrics.tradeVolumePrevious.month) {
      return deltaPercents(metrics.tradeVolumePrevious.month, metrics.tradeVolume);
    }
    return 0;
  },
  chartdata: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId});
  },
  chartdataOrdered: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId}, {sort: {timestamp: -1}});
  },
  chartdataSubscriptionFetch: function(systemId/*, interval:: oneof ['daily', 'hourly']*/) {
    return MarketData.find({systemId: systemId}, {sort: {timestamp: -1}}). fetch();
  },


  /////////////// chaingear helpers
  cgIsActiveCrowdsale: function() {
    return this.crowdsales && this.crowdsales.start_date < new Date() &&
      this.crowdsales.end_date > new Date()
  },
  cgIsUpcomingCrowdsale: function() {
    return this.crowdsales && this.crowdsales.start_date > new Date()
  },
  cgIsPastCrowdsale: function() {
    return this.crowdsales && this.crowdsales.end_date < new Date()
  },


  ////// cf-accounts
  tagMatchesTags: function (tag, tags) {
    return tags.indexOf(tag) > -1;
  },

  cdTurnover: function turnover () {
    var metrics = this.metrics;
      if (metrics.cap && metrics.cap.btc) {
          return 100.0 * metrics.turnover;
      }
    return 0;
  },

  cdSymbol: function symbol () {
    if (this.token && this.token.symbol) {
      return this.token.symbol
    }
    return "";
  }
}


_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
