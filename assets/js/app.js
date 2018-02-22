
(function($) {

	skel.breakpoints({
		wide: '(max-width: 1680px)',
		normal: '(max-width: 1280px)',
		narrow: '(max-width: 960px)',
		narrower: '(max-width: 840px)',
		mobile: '(max-width: 736px)',
		mobile_small: '(max-width: 414px)',
	  mobile_smaller: '(max-width: 320px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile +mobile_small -mobile_small +mobile_smaller -mobile_smaller', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active,
					'.important\\28 mobile_small\\29',
					skel.breakpoint('mobile_small').active,
					'.important\\28 mobile_smaller\\29',
					skel.breakpoint('mobile_smaller').active
				);
			});

		// Dropdowns.
			$('#menunav > ul').dropotron({
				baseZIndex: 100000,
				mode: 'instant',
				speed: 350,
				noOpenerFade: true,
				alignment: 'center',
				// offsetY: 10,
			});

		// menunav


		// Off-Canvas Navigation.

			// Title Bar.
				$(
					'<div id="menu-bg-overlay"></div>'+
					'<div id="titleBar">' +
						'<a href="#navPanel" class="toggle"></a>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#menunav').navList() +
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
						side: 'right',
						target: $body,
						visibleClass: 'navPanel-visible'
					});

				// $('').animationEnd();

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#titleBar, #navPanel, #page-wrapper')
						.css('transition', 'none');


			/**
	     * Copy and copyright
	     */
	    function setClipboardData(str) {
	        str += '\n\n著作权归作者所有。\n商业转载请联系作者获得授权,非商业转载请注明出处。\n原文: ' + location.href;
	        $('.post-content').on('copy', function(e) {
	            var data = window.clipboardData || e.originalEvent.clipboardData;
	            data.setData('text/plain', str);
	            e.preventDefault();
	        });
	    }
	    $('.post-content').on('mouseup', function(e) {
	        var txt = window.getSelection();
	        if(txt.toString().length >= 30) {
	            setClipboardData(txt);
	        }
	    });

      // Add Top button
			$(
				'<a class="scrollTop" >Top</a>'
			).appendTo($('body'));

			$(".scrollTop").css("display", "none");
			$(".scrollTop").click(function() {
				scrollTo(0, 0);
			});

	});

})(jQuery);
