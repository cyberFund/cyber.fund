var logger = {
  test: function() {
    if (!console || !console.log) throw "unknown system"
  },
  log: function() {
    console.log(args)
  },
  emptyLine: function() {
    console.log();
  },
  print: function(label, value, condensed) {
    if (typeof label === 'string') {
      if (typeof value === 'object') console.log(label + ": ", value);
      else console.log([label, value].join(": "));
    }
    if (!condensed) console.log();
  }
}

CF.Utils.logger = logger
