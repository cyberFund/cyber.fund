CF.Prices = { // todo: have same thing at client, so it s able calculating stuff.
  collection: new Meteor.Collection(null),
  transform: function(fields){
    return {
      btc: fields.metrics && fields.metrics.price && fields.metrics.price.btc,
      usd: fields.metrics && fields.metrics.price && fields.metrics.price.usd,
    }
  },
  usd: function(id){
    var doc = this.collection.findOne({_id:id});
    return doc && doc.usd;
  },
  btc: function(id){
    var doc = this.collection.findOne({_id:id});
    return doc && doc.btc;
  },
  doc: function(id){
    return this.collection.findOne({_id:id});
  }
}

Meteor.startup(function(){
  var cursor = CurrentData.find({}, {fields: {'metrics.price': 1}});
  var ns = CF.Prices;
  cursor.observeChanges({
    added: function(id, fields){
      fields = ns.transform(fields);
      ns.collection.insert(_.extend(fields, {_id: id}))
    },
    changed: function(id, fields){
      fields = ns.transform(fields);
      ns.collection.upsert({_id: id}, {$set: fields});
    },
    removed: function(id){
      ns.collection.remove({_id: id})
    }
  })
})
