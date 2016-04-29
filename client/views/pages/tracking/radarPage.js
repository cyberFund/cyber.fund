Template['radarPage'].onCreated(function() {
  var self = this;
  self.subscribe('crowdsalesAndProjectsList');
  //self.subscribe('crowdsalesList');
  //self.subscribe('projectsList');
});

function _crowdsale() {
  return CurrentData.find(CF.CurrentData.selectors.crowdsales());
}

function _project() {
  return CurrentData.find({
    $or: [{
      'crowdsales.start_date': {
        $gt: new Date()
      }
    }, {
      'crowdsales.start_date': {
        $exists: false
      }
    }],
    $and: [
    CF.CurrentData.selectors.projects()]
  }, {
    sort: {
      "calculatable.RATING.vector.LV.sum": -1
    }
  });
}

function _crowdsalePast() {
  return CurrentData.find({
    $and: [CF.CurrentData.selectors.crowdsales(), {
      'crowdsales.end_date': {
        $lt: new Date()
      }
    }]
  }, {
    sort: {
      'crowdsales.end_date': -1
    }
  })
}

function _crowdsaleUpcoming() {
  return CurrentData.find({
    $and: [CF.CurrentData.selectors.crowdsales(), {
      'crowdsales.start_date': {
        $gt: new Date()
      }
    }]
  }, {
    sort: {
      'crowdsales.start_date': 1
    }
  })
}

function _crowdsaleActive() {
  return CurrentData.find({
    $and: [CF.CurrentData.selectors.crowdsales(), {
      'crowdsales.end_date': {
        $gt: new Date()
      }
    }, {
      'crowdsales.start_date': {
        $lt: new Date()
      }
    }]
  }, {sort: {"metrics.currently_raised": 1}})
}

Template['radarPage'].helpers({
  crowdsale: function() {
    return _crowdsale()
  },
  crowdsalePast: function() {
    return _crowdsalePast()
  },
  crowdsaleUpcoming: function() {
    return _crowdsaleUpcoming()
  },
  crowdsaleActive: function() {
    return _crowdsaleActive()
  },
  project: function() {
    return _project()
  },
  nothing: function() {
    return !(_project().count() + _crowdsale().count())
  },
});
Template['radarPage'].events({});
