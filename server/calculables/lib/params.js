var params;

CF.CurrentData.calculatables.lib = CF.CurrentData.calculatables.lib || {};

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
      'Dead': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      },
      'live': {
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
      'Dead': {
        site: .15,
        community: .15,
        updates: .20,
        code: .20,
        science: .15,
        knowledge: .15
      },
      'live': {
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
  linkWeightsCS: {
    'cryptocurrency': {
      // ordered by [i][0]. score weight is [i][1]
      d0: [[0, 0]],
      d1: [[0, 0], [1, 0.2], [3, 0.4], [5, 0.6], [9, 0.8]],
    },

    'cryptoasset': {
      s0: function (n){ // not used
        return n===0 ? 0 : 1
      },
      s1: function (n){  // not used
        if (n===0) return 0;
        if (n<=1) return 0.2;
        if (n<=3) return 0.4;
        if (n<=5) return 0.6;
        if (n<=9) return 0.8;
      },
      // ordered by [i][0]. score weight is [i][1]
      d0: [[0, 0]],
      d1: [[0, 0], [1, 0.2], [3, 0.4], [5, 0.6], [9, 0.8]],
    },
    'cryptoservice': {
      d0: [[0, 0]],
      d1: [[0, 0], [1, 0.2], [3, 0.4], [5, 0.6], [9, 0.8]],
    },
    'cryptoproject': {
      d0: [[0, 0]],
      d1: [[0, 0], [1, 0.2], [3, 0.4], [5, 0.6], [9, 0.8]],
    }
  }
};

_.extend(CF.CurrentData.calculatables.lib, {
  params: params
});
