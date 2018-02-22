
$(function () {

	function titleBarOffset(topStr) {
		$('#titleBar').css({
			top: topStr,
		});
	}

	function menuAddFilterOps(isAdd) {
		if (isAdd) {
			$('.menu').addClass('menu-highlight');
			$('#menu-fliter').css('display', 'block');
			$('#menu-fliter').addClass('menu-fliter');
		} else {
			$('.menu').removeClass('menu-highlight');
			$('#menu-fliter').css('display', 'none');
			$('#menu-fliter').removeClass('menu-fliter');
		}
	}

	function menuSetting(heightStr) {
		$('.menu-highlight').css({
			height: heightStr,
		});
		$('.menu-fliter').css({
			height: heightStr,
		});
	}

	function showMenuFilter() {

		var scrollDistance = $(window).scrollTop();

		if (scrollDistance > 60) {

			menuAddFilterOps(true);

			skel.on("+mobile +narrower +narrow", function() {
				titleBarOffset("10px");
			});

			skel.on("+mobile +narrower +narrow", function() {
				// console.log("mmTest");
				menuSetting("63px");
			}).on("-narrow", function() {
				// console.log("III");
				menuSetting("80px");
			});

		} else {

		  menuAddFilterOps(false);

			skel.on("+mobile +narrow +narrower", function(){
				titleBarOffset("23px");
			});

		}

	}

	showMenuFilter();

	$(window).scroll(function() { showMenuFilter(); });

});
