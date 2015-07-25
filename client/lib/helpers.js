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
  not: function (value){
    return !value;
  },
  or:  function (value1, value2) {
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

  dif: function(v1, v2){
    return parseInt(v1) - parseInt(v2)
  },

  session: function (key) {
    return Session.get(key);
  },

  concat: function (value1, value2) {
    return value1.toString() + value2.toString();
  },
  values_of: function (arr) {
    if (typeof arr == "object") {
      return array = $.map(arr, function (value, index) {
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
  readableNumbers: function (input) {
    while (/(\d+)(\d{3})/.test(input.toString())) {
      input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
    }
    return input;
  },
  readableN: function(input, roundTo){ //roundTo - how many digits after dot
    var ret = parseFloat(input);
    if (isNaN(ret)) return "";
    return Blaze._globalHelpers.readableNumbers(ret.toFixed(roundTo));
  },
  tagMatchesTags: function(tag, tags) {
    return tags.indexOf(tag) > -1;
  },
  isBeforeNow: function(date, format){
    return moment(date, format).isBefore(moment(), 'day');
  },
  isAfterNow: function(date, format){
    return moment(date, format).isAfter(moment(), 'day');
  },
  isNowBetween: function(date1, date2, format){
    return moment().isBetween(moment(date1, format), moment(date2, format), 'day');
  },
  _toU: function(str){
    return str.replace(/\ /g, "_")
  },
  _toS: function(str){
    return str.replace(/_/g, " ")
  },
  usersCount: function(){
    return Counts.get('usersCount')
  },
  greenRedNumber: function(value){
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
};

_.each(helpers, function (helper, key) {
  UI.registerHelper(key, helper);
});
/**
 * Created by angelo on 6/9/15.
 */
