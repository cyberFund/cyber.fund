// Write your tests here!
// Here is an example.
Tinytest.add('userByUsername', function(test) {
  var t = CF.User.selectors.userByUsername("John")
  test.equal(t && t["username"], "John");
});
