Template['hitryImage'].rendered = function () {
  var t = this
  var $image = this.$('img');

  $image.on('error', function (){
    if (t.data.fallback == 'av')
    $image.attr('src', "https://www.gravatar.com/avatar?d=mm&s=48")
    //https://www.gravatar.com/avatar?d=mm
  })

  $image.on('load', function () {
    $image.removeClass('hidden');
  });

  if ($image[0].complete) {
    $image.load();
  }
}
