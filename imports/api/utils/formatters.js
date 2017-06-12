import d3 from 'd3'

let escapeNaN = function(formatter){
  return function(value){
    return isNaN(value) ? "_#_" : formatter(value);
  };
}

let formatters = {
  readableN0: d3.format(",.0f"),
  readableN1: d3.format(",.1f"),
  readableN2: d3.format(",.2f"),
  readableN3: d3.format(",.3f"),
  readableN4: d3.format(",.4f"),
  readableN8: d3.format(",.8f"),
  roundedN4: d3.format(",.4r"),
  meaningful3: d3.format(",.4g"),
  meaningful4: d3.format(",.4g"),
  meaningful4Si: d3.format(",.4s"),
  percents: d3.format("%"),
  percents0: d3.format(".0%"),
  percents1: d3.format(".1%"),
  percents2: d3.format(".2%"),
  percents3: d3.format(".3%"),
  withSign: d3.format("+,")
};

let monetaryFormatter = function(input) {
  var postfix = "",
    value = input,
    formatter = formatters.readableN2;
  if (input > 5000) {
    postfix = "k";
    value = input / 1000;
    formatter = formatters.readableN3;
  }
  if (input > 1000000) {
    postfix = "M";
    value = input / 1000000;
  }
  if (input > 1000000000) {
    postfix = "bln";
    value = input / 1000000000;
  }
  return formatter(value) + postfix;
}

const deltaPercents = function(base, another) {
  return 100 * (base - another) / base;
}

const readableNumbers = function(input) {
  var f = true;
  while (/(\d+)(\d{3})/.test(input.toString()) && f) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return input;
}

const numberWithCommas = function(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const readableN = function(input, roundTo) { //roundTo - how many digits after dot
  return d3.format(",." + roundTo + "f");
};

export {
    escapeNaN,
    deltaPercents,
    readableNumbers,
    numberWithCommas,
    readableN,
    formatters,
    monetaryFormatter
}
