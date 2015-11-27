Template['radarPage'].onCreated(function() {
  var self = this;
  self.subscribe('crowdsalesList');
  self.subscribe('projectsList');
});

function _crowdsale() {
  return CurrentData.find(CF.Chaingear.selector.crowdsales);
}

function _project() {
  return CurrentData.find(CF.Chaingear.selector.project);
}

Template['radarPage'].helpers({
  crowdsale: function() {
    return _crowdsale();
  },
  crowdsalePast: function() {
    return CurrentData.find({
      $and: [CF.Chaingear.selector.crowdsales, {
        'crowdsales.end_date': {
          $lt: new Date()
        }
      }]
    }, {
      sort: {
        'crowdsales.end_date': -1
      }
    })
  },
  crowdsaleUpcoming: function() {
    return CurrentData.find({
      $and: [CF.Chaingear.selector.crowdsales, {
        'crowdsales.start_date': {
          $gt: new Date()
        }
      }]
    })
  },
  crowdsaleActive: function() {
    return CurrentData.find({
      $and: [CF.Chaingear.selector.crowdsales, {
        'crowdsales.end_date': {
          $gt: new Date()
        }
      }, {
        'crowdsales.start_date': {
          $lt: new Date()
        }
      }]
    })
  },
  project: function() {
    return CurrentData.find(CF.Chaingear.selector.projects)
  },

  isActiveCrowdsale: function() {
    return this.crowdsales && this.crowdsales.start_date < new Date() &&
      this.crowdsales.end_date > new Date()
  },
  isUpcomingCrowdsale: function() {
    return this.crowdsales && this.crowdsales.start_date > new Date()
  },
  isPastCrowdsale: function() {
    return this.crowdsales && this.crowdsales.end_date < new Date()
  }
});

Template['radarPage'].events({});
