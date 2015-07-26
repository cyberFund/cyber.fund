CF.Utils.noClick = function(){
  return false;
};

CF.Utils.deltaPercents = function deltaPercents(base, another) {
  return 100 * (base - another)/base;
};