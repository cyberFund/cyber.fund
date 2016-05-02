Template['main'].onCreated(function(){
  i = this;
  i.subscribe('currentDataRP', {selector: {
  }, sort:{'calculatable.RATING.sum': -1}, limit: 5} );

  i.subscribe('crowdsalesAndProjectsList');
});

Template['mainPageSystemsWidget'].helpers({
  systems: function(){
    return CurrentData.find({}, {sort:{'calculatable.RATING.sum': -1}, limit: 5})
  }
});
Template['mainPageCrowdasalesWidget'].helpers({
  activeCrowdsales: function(){
    console.log(1);
    return CurrentData.find({
      $and: [{crowdsales: {$exists: true}}, {
        'crowdsales.end_date': {
          $gt: new Date()
        }
      }, {
        'crowdsales.start_date': {
          $lt: new Date()
        }
      }]
    }, {sort: {"metrics.currently_raised": -1}}).fetch()
  }
})
