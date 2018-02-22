$(function () {

  function scrollTopSettings(fontSizeStr, sizeStr, radiusStr) {
    $('.scrollTop').css({
      width: sizeStr,
      height: sizeStr,
      lineHeight: sizeStr,
      fontSize: fontSizeStr,
      borderRadius: radiusStr,
    });
  }

  function showScrollTopBtn() {

    var scrollDistance = $(window).scrollTop();

    if (scrollDistance > 60) {
      $(".scrollTop").css("display", "block");

      skel.on("+mobile +narrow +narrower", function() {
        scrollTopSettings("12.5pt", "44px", "10px");
      }).on("-narrow", function() {
        scrollTopSettings("15pt", "50px", "15px");
      });

    } else {
      $(".scrollTop").css("display", "none");
    }

  }

  showScrollTopBtn();

  $(window).scroll(function() { showScrollTopBtn(); });

});
