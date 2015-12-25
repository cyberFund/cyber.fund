var params;

CF.CurrentData.calculatables.lib = CF.CurrentData.calculatables.lib || {};

var clone = function _clone(item) {
  return _.clone(item);
}

var scoreWeightsPerLinksCount = {
  baseBoolean: [
    [0, 0]
  ],
  base10: [
    [0, 0],
    [1, 0.2],
    [5, 0.5],
    [9, 0.8] //6,7,8,9 links => 0.8,   10, 10+links => 1
  ],
  neverMind: [
    [1000, 0] // number of links <= 1000 results in 0, 1001+links results in 1
  ],
  fiveSteps: [
    [0, 0],
    [1, 0.2],
    [2, 0.4],
    [3, 0.6],
    [4, 0.8] // 5+ links => 1
  ],
  tenSteps: [
    [0, 0],
    [1, 0.1],
    [2, 0.2],
    [3, 0.3],
    [4, 0.4],
    [5, 0.5],
    [6, 0.6],
    [7, 0.7],
    [8, 0.8],
    [9, 0.9]
  ]
}

params = {
  CSkeys: ['site', 'community', 'updates', 'code', 'science', 'knowledge',
  'buy', 'hold', 'analyze', 'earn', 'dapp'],

  linkWeightsCS: function(state, type) {
    var scores = scoreWeightsPerLinksCount;
    var ret = {
      site: clone(scores.baseBoolean),
      community: clone(scores.baseBoolean),
      updates: clone(scores.baseBoolean),
      code: clone(scores.baseBoolean),
      science: clone(scores.baseBoolean),
      knowledge: clone(scores.baseBoolean),
      buy: clone(scores.neverMind),
      hold: clone(scores.neverMind),
      analyze: clone(scores.neverMind),
      earn: clone(scores.neverMind),
      dapp: clone(scores.baseBoolean)
    };

    if (state === "Public") {
      ret.buy = clone (scores.base10)
      ret.hold = clone (scores.base10)
      ret.analyze = clone (scores.base10)
      ret.earn = clone(scores.base10)
    }

    return ret;
  },


  weightsCS: {
    'cryptocurrency': {
      'Public': {
        site: 0.05,
        community: 0.05,
        updates: 0.05,
        code: 0.05,
        science: 0.05,
        knowledge: 0.05,
        buy: 0.3,
        hold: 0.1,
        analyze: 0.1,
        earn: 0.1,
        dapp: 0.1
      },
      'Pre-Public': {
        site: 0.1,
        community: 0.1,
        updates: 0.1,
        code: 0.1,
        science: 0.1,
        knowledge: 0.1,
        hold: 0.1,
        analyze: 0.1,
        earn: 0.1,
        dapp: 0.1
      },
      'Project': {
        site: 0.15,
        community: 0.15,
        updates: 0.20,
        code: 0.20,
        science: 0.15,
        knowledge: 0.15
      }
    },
    'cryptoasset': {
      'Public': {
        site: 0.05,
        community: 0.05,
        updates: 0.10,
        code: 0.20,
        science: 0.05,
        knowledge: 0.05,
        buy: 0.4,
        hold: 0.05,
        analyze: 0.05,
        earn: 0
      },
      'Pre-Public': {
        site: 0.1,
        community: 0.1,
        updates: 0.20,
        code: 0.20,
        science: 0.15,
        knowledge: 0.15,
        buy: 0,
        hold: 0.05,
        analyze: 0.05,
        earn: 0
      },
      'Project': {
        site: 0.15,
        community: 0.15,
        updates: 0.20,
        code: 0.20,
        science: 0.15,
        knowledge: 0.15
      }
    }
  },

  weightsRATING: {
    'Project': {
      CS: 1,
      LV: 4,
      WL: 0,
      BR: 0,
      AM: 0
    },
    'Pre-Public': {
      CS: 1,
      LV: 2.5,
      WL: 0.5,
      BR: 0.5,
      AM: 0.5
    },
    'Private': {
      CS: 1,
      LV: 3,
      WL: 0,
      BR: 0.5,
      AM: 0.5
    },
    'Public': {
      CS: 1,
      LV: 2,
      WL: 1,
      BR: 0.5,
      AM: 0.5
    }
  }
};

_.extend(CF.CurrentData.calculatables.lib, {
  params: params
});
