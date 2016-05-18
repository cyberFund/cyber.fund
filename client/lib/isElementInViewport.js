function isElementInViewport (el) { //stackoverflow

  //special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}

if (!CF._devTools)
  CF._devTools = {
    isElementInViewport: isElementInViewport
  }
else CF._devTools.isElementInViewport = isElementInViewport
