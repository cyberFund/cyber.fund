exports.selector = {
  "profile.followedBy.2": {$exists: true},
  publicFunds: {$gt: 0}
};

exports.selectorService = {
  "profile.followedBy.2": {$exists: true}
};

exports.updateUserFunds = require("./userHistory").updateUserFunds;
