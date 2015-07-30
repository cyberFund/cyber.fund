CF.Utils.noClick = function(){
  return false;
};

CF.Utils.deltaPercents = function deltaPercents(base, another) {
  return 100 * (base - another)/base;
};

CF.Utils.readableNumbers  = function (input) {
  while (/(\d+)(\d{3})/.test(input.toString())) {
    input = input.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return input;
};

CF.Utils.readableN = function(input, roundTo){ //roundTo - how many digits after dot
  var ret = parseFloat(input);
  if (isNaN(ret)) return "";
  return CF.Utils.readableNumbers(ret.toFixed(roundTo));
};

CF.Utils.monetaryFormatter = function(input){
  console.log(input);
  var postfix = "", value = input, decimals = 2;
  if (input > 5000) {
    postfix = 'k';
    value = input/ 1000;
    decimals = 3;
  }
  if (input > 1000000) {
    postfix = 'M';
    value = input / 1000000
  }
  if (input > 1000000000) {
    postfix = "bln";
    value = input / 1000000000
  }
  return CF.Utils.readableN(value, decimals) + postfix;
};