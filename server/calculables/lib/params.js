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
    [3, 0.4],
    [5, 0.6],
    [9, 0.8]
  ],
  neverMind: [
    [1000, 0]
  ],
  fiveSteps: [
    [0, 0],
    [1, 0.2],
    [2, 0.4],
    [3, 0.6],
    [4, 0, 8]
  ],
  tenSteps: [
    [0, 0],
    [1, 0.1],
    [2, 0.2],
    [3, 0.3],
    [4, 0, 4],
    [5, 0, 5],
    [6, 0.6],
    [7, 0.7],
    [8, 0.8],
    [9, 0, 9]
  ]
}

params = {
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
    },
    'Dead': {},
    'live': {}
  },
  weightsCS: {
    'cryptocurrency': {
      'Public': {
        site: .05,
        community: .05,
        updates: .05,
        code: .05,
        science: .05,
        knowledge: .05,
        buy: .3,
        hold: .1,
        analyze: .1,
        earn: .1
      },
      'Pre-Public': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      },
      'Project': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      },
      'Running': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      }
    },
    'cryptoasset': {
      'Public': {
        site: .05,
        community: .05,
        updates: .10,
        code: .20,
        science: .05,
        knowledge: .05,
        buy: .4,
        hold: .05,
        analyze: .05,
        earn: 0
      },
      'Pre-Public': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      },
      'Project': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      },
      'Running': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      }
    }
  },
  
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
    };

    if (state === "Public") {
      ret.buy = clone (scores.base10)
      ret.hold = clone (scores.base10)
      ret.analyze = clone (scores.base10)
    }

    return ret;
  }
};

_.extend(CF.CurrentData.calculatables.lib, {
  params: params
});
