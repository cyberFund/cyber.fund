var util = Npm.require("util")

var logger = {
  test: function() {
    if (!console || !console.log) throw "unknown system"
  },
  log: function() {
    console.log.apply(null, arguments)
  },
  emptyLine: function() {
    console.log();
  },
  print: function(label, value, condensed) {
    if (typeof label === 'string') {
      if (typeof value === 'object') {
        console.log([label, util.inspect(value)].join(": "));
      } else {
        console.log([label, value].join(": "));
      }
    }
    if (!condensed) console.log();
  }
}

CF.libsub = CF.libsub || {}
CF.libsub.logger = logger
