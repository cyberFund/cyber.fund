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
  }
};

_.extend(CF.CurrentData.calculatables.lib, {
  params: params
});
