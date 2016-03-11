Template['hitryImage'].rendered = function () {
  var $image = this.$('img');

  $image.on('load', function () {
    $image.removeClass('hidden');
  });

  if ($image[0].complete) {
    $image.load();
  }
}