var util = Npm.require("util")
CF.Utils.onsole = {
  print: function print(label, value) {
    var iss1 = typeof label === 'string';
    var iss2 = typeof label === 'string';
    if (typeof label === 'string') {
      if (typeof value === 'object') {
        console.log([label, util.inspect(value)].join(": "));
      } else {
        console.log([label, value].join(": "));
      }
    }
  },

  el: function emptyLine() {
    console.log()
  }
}
