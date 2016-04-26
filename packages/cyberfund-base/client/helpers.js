
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
  contains: function (list, value) {
    return _.contains(list, value);
  },
  slice: function (list, start, end) {
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
    return parseInt(v1) - parseInt(v2)
  },
  cfRatingRound: function(v) {
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
  readableNumbers: CF.Utils.readableNumbers,
  readableN: CF.Utils.readableN,

  isNumber: function (value) {
    return _.isNumber(value)
  },

  isObject: function (value) {
    return _.isObject(value)
  },

  isEmpty: function (value) {
    return _.isEmpty(value)
  },

  satoshi_decimals: function (value, precision) {
    if (!precision && precision != 0) precision = 8;
    try {
      value = parseFloat(value);
    } catch (e) {

    }
    var out = value.toFixed(precision).split('.');
    var ret = "";
    if (out[0]) ret += group3natural(out[0]);
    if (out[1]) ret += "." + group3decimal(out[1], " ");
    return ret;
  },

  isBeforeNow: function (date) {
    var m = /*format ? moment(date, format) : */moment(date);
    return m.isBefore(moment());
  },
  isAfterNow: function (date/*, format*/) {
    var m = /*format ? moment(date, format) :*/ moment(date);
    return m.isAfter(moment());
  },
  isNowBetween: function (date1, date2/*, format*/) {
    var m1 = /*format ? moment(date1, format) :*/ moment(date1),
    m2 = /*format ? moment(date2, format) : */moment(date2);
    return moment().isBetween(m1, m2);
  },
  daysLeft: function (date) {
    return  moment(date).diff( moment() , 'days');
  },
  daysPassed: function (date) {
    return  moment().diff(moment(date), 'days');
  },
  _toUnderscores: function (str) {
    return !!str ? str.replace(/\ /g, "_") : ''
  },
  _toSpaces: function (str) {
    return !!str ? str.replace(/_/g, " ") : ''
  },
  _toAttr: function (str) {
    return !!str ? str.replace(/\ /g, "_").replace(/\(/g, "_")
    .replace(/\)/g, "_").replace(/\./g, "_") : ''
  },
  usersCount: function () {
    return Counts.get('usersCount')
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
    var ret;
    if (system.token) {
      ret = system.token.token_name;
    }
    if (!ret) ret = system._id;
    return ret;
  },
  ownUsername: function(){
    var user =  Meteor.user();
    if (!user) return '';
    return (user.username) || '';
  },
  _largeAvatar: function(user){
    return user.largeAvatar || user.avatar || '';
  },
  dateFormat: function(date, format){
    return moment(date).format(format);
  },
  usersListFromIds: function(listFromIds) {
    return CF.User.listFromIds(listFromIds)
  },
  _btcPrice: function(){
    var btc = CurrentData.findOne({_id: "Bitcoin"});
    if (btc && btc.metrics) return parseFloat(btc.metrics.price.usd)
    return undefined
  },
  userHasPublicAccess: function() {
    return CF.User.hasPublicAccess(Meteor.user())
  }
};

_.each(helpers, function (helper, key) {
  Template.registerHelper(key, helper);
});
