Meteor.methods({
  "cropBloom": function(bloom, ua){
    check(bloom, [String]);
    check(ua, String);
    var l = bloom.length;
    var _l =
    l < 10 ? '000' +l.toString() :
    l < 100 ? '00' +l.toString() :
    l < 1000 ? '0' +l.toString() :
    l.toString()
    var key = ['bloom', l, ua].join("___");

    if (!Extras.findOne({_id: key}))
    Extras.insert({
      _id: key, bloom: bloom, ua: ua,
      createdAt: new Date()
    })
console.log(bloom)
console.log(ua)
  }

})
