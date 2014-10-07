function getCurrentCursor() {
  var candidates = [];
  $('[data-cursor]').each(function() {
    if ($(this).offset().top <= $(window).scrollTop()) {
      candidates.push([$(this).offset().top, this]);
    }
  });
  candidates = candidates.sort(function(a, b) {return a[0] - a[1]});
  if (candidates.length < 1) {
    cursor = $('[data-cursor]').first();
  } else {
    cursor = candidates.slice(-1)[0][1];
    cursor = $(cursor);
  }
  return cursor.attr('data-cursor');
}

function getNextCursor() {
  return $('[data-next-cursor]').last().attr('data-next-cursor');
}

function appendNextPage(cursor) {
  var url = updateURLParam(updateURLParam(location.href, 'cursor', cursor),
                           'response', 'json');
  $.ajax({
    url: url,
    type: 'GET',
    beforeSend: function(data) {
      $('#page-loader').css('display', 'block');
    },
    success: function(data) {
      $('#pagination-append').append(data['page']);
    },
    complete: function(data) {
      $('#page-loader').css('display', 'none');
    }
  });
}

function initPagination() {
  if ($('[data-cursor]').is('[data-cursor]') == true) {
    var fetchedCursors = ['', getCurrentCursor()];
    function handleScroll() {
      if (getCurrentCursor() == '') {
        newUrl = removeURLParam(location.href, 'cursor');
      } else {
        newUrl = updateURLParam(location.href, 'cursor', getCurrentCursor());
      }
      if (location.href != newUrl) {
        history.pushState({}, document.title, newUrl);
      }
      var currentHeight = $(document).height() - $(window).height() - 99;
      if ($(window).scrollTop() >= currentHeight) {
        var nextCursor = getNextCursor();
        if (fetchedCursors.indexOf(nextCursor) < 0) {
          fetchedCursors.push(nextCursor);
          appendNextPage(nextCursor);
        }
      }
    }

    if (history && history.pushState) {
      var scrollTimer = null;
      $(window).scroll(function() {
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(handleScroll, 50);
      });
    }
  }
}
