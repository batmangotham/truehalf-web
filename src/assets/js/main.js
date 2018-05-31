$(document).ready(function() {
  setTimeout(function() {
    if ($(window).width() > 767) {
      $(".trans-anim").addClass("trans-y");
      $(".img-trans").addClass("img-x");
    }
  }, 200);
});
