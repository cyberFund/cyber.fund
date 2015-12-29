// Write your tests here!
// Here is an example.
Tinytest.add('userByTwid', function(test) {
  var t = CF.User.selectors.userByTwid("John")
  test.equal(t && t["profile.twitterName"], "John");
});
