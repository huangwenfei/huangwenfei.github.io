
$(function() {

  var $body = $('body');

  // popup
  $(".markdown-body img").wrap('<div class="img-container"></div>');

  $(".markdown-body img").click(function() {

    var srcStr = $(this).attr("src");
    var imgName = imageName(srcStr);

    $('<div class="popup-overlay">'+
      '  <div class="img-div"><img src="' + srcStr + '" alt="'+ imgName +'"/></div>'+
      '  <ul>'+
      '    <li><a href="'+ srcStr +'" target="_blank">查看源图</a></li>'+
      '    <li><span>'+ imgName +'</span></li>'+
      '  </ul>'+
      '</div>'
    ).appendTo($body);

    $(".popup-overlay").click(function() {
      overlayRemove();
    });

    $(".close-btn").click(function() {
      overlayRemove();
    });

    showBodySideBar(false);

  });

  function imageName(url) {

    var srcStr = decodeURI(url);
    var index = srcStr.lastIndexOf("\/");
    var imgName = srcStr.substring(index + 1, srcStr.length);
    var imgNameArray = imgName.split(".");

    return imgNameArray[0];
  }

  function overlayRemove() {
    $(".popup-overlay").remove();
    showBodySideBar(true);
  };

  function showBodySideBar(show) {
    if (show) {
      // $body.css("overflow", "auto");
      // $('body.homepage').css("overflow", "auto");
      // $("#homewrapper").css("overflow", "auto");
      // $('main').css("overflow", "auto");
      $('homewrapper').css({ overflow: 'auto', });
    } else {
      // $body.css("overflow", "hidden");
      // $('body.homepage').css("overflow", "hidden");
      // $("#homewrapper").css("overflow", "hidden");
      // $('main').css("overflow", "hidden");
      $('homewrapper').css({ overflow: 'hidden', });
    }
  };

  // Off-Canvas Menu.

    // Toc Bar.
      $(
        '<div id="toc-bg-overlay"></div>'+
        '<div id="tocBar">' +
          '<a href="#tocPanel" class="toggle"></a>' +
        '</div>'
      )
        .appendTo($body);

    // Navigation Panel.
      $(
        '<div id="tocPanel">' +
          '<nav>' +
            $('#tocNav').navList() +
          '</nav>' +
        '</div>'
      )
        .appendTo($body)
        .panel({
          delay: 500,
          hideOnClick: true,
          hideOnSwipe: true,
          resetScroll: true,
          resetForms: true,
          side: 'bottom',
          target: $body,
          visibleClass: 'tocPanel-visible'
        });

    // Fix: Remove tocPanel transitions on WP<10 (poor/buggy performance).
      if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
        $('#tocBar, #tocPanel, #page-wrapper')
          .css('transition', 'none');

  $('#toc-content').toc({
    'selectors': 'h1,h2,h3,h4,h5,h6', //elements to use as headings
    'container': '.markdown-body', //element to find all selectors in
    'smoothScrolling': true, //enable or disable smooth scrolling on click
    'prefix': 'toc', //prefix for anchor tags and class names
    'onHighlight': function(el) { }, //called when a new section is highlighted
    'highlightOnScroll': true, //add class to heading that is currently in focus
    'highlightOffset': 0, //offset to trigger the next headline,
  });

  // scroll

  function scrollShowAndHide(showFuc, hideFuc) {

    var windowH = $(window).height(),
        scrollTop = $(window).scrollTop();

    if (scrollTop >= windowH) {
      showFuc();
    } else {
      hideFuc();
    }

  };

  function scrollShow(func) { return func; };
  function scrollHide(func) { return func; };

  // menu
  function tocMenu() {
    scrollShowAndHide(scrollShow(function() {
      var menuH = 100,
          bottomH = 20,
          _width = function() { return ($(window).width() * 0.05) + 20; };
          _height = function() { return ($(window).height() - menuH - bottomH); };
      $(".toc-menu").css({
        position: "fixed",
        height: _height(),
        zIndex: 10000,
        top: menuH.toString() + "px",
        right: _width(),
      });
    }), scrollHide(function() {
      $(".toc-menu").css({
        position: "relative",
        height: "auto",
        zIndex: 0,
        top: 0,
        right: 0,
      });
    }));
  };

  // Wheel
  function tocWheel() {
    scrollShowAndHide(scrollShow(function() {
      $(".h-slideBar").css({ display: "block", });
      wheel.createListener("#tocNav", "#toc-content", ".h-slideBar", ".h-space", 80);
    }), scrollHide(function() {
      $(".h-slideBar").css({ display: "none", });
      wheel.reset();
    }));
  };

  function fixToc() {
    var post_footer_top_h = ($('.post-content-footer').offset().top - $(window).height()),
        scrollBarOffset   = $(window).scrollTop();
    if (scrollBarOffset >= post_footer_top_h) {
      $('#tocNav').css('display', 'none');
    } else {
      $('#tocNav').css('display', 'block');
    }
  };

  function fixWheel() {
    if (wheel.isWheelShow) { $('#tocNav').css('padding-right', '20px'); }
    scrollShowAndHide(scrollShow(function() { }), scrollHide(function() {
      $('#tocNav').css('padding-right', '10px');
    }));
  };

  function delay(func, mils) { setTimeout(func, mils); }

  tocMenu();
  tocWheel();
  fixToc();
  fixWheel();

  $(window).scroll(function() {

    tocMenu();
    tocWheel();
    fixToc();
    fixWheel();

	});


});
