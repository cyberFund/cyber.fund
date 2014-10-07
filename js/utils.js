function getURLParam(key) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == key) {
      return pair[1];
    }
  }
}


function updateURLParam(url, key, value) {
  var newAdditionalURL = '';
  var tempArray = url.split('?');
  var baseURL = tempArray[0];
  var additionalURL = tempArray[1];
  var temp = '';
  if (additionalURL) {
    tempArray = additionalURL.split('&');
    for (i = 0; i < tempArray.length; i++) {
      if (tempArray[i].split('=')[0] != key) {
        newAdditionalURL += temp + tempArray[i];
        temp = '&';
      }
    }
  }
  var rowsTxt = temp + '' + key + '=' + value;
  return baseURL + '?' + newAdditionalURL + rowsTxt;
}


function removeURLParam(url, key) {
  var urlparts = url.split('?');
  if (urlparts.length >= 2) {
    var prefix = encodeURIComponent(key) + '=';
    var pars = urlparts[1].split(/[&;]/g);
    for (var i = pars.length; i-- > 0;) {
      if (pars[i].lastIndexOf(prefix, 0) !== -1) {
        pars.splice(i, 1);
      }
    }
    if (pars.length == 0) {
      return urlparts[0];
    } else {
      return urlparts[0] + '?' + pars.join('&');
    }
  } else {
    return url;
  }
}


function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
