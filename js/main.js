$( function() {
	var $window = $(window),
		$body = $('body'),
		$bodyHtml = $('html, body'),

		cssClassError = "_error",
		cssClassActive = "_active",
		cssClassWhite = "_white",
		cssClassDisable = "_disable",
		cssClassNotAnimate = "_notAnimate"


	;

	//menu
	(function(){
		var $panelTop = $(".js-panel-top"),
			$slide1 = $(".js-slide1"),
			heightSlide1 = $slide1.height(),

			cssClassTop = "_top"
		;

		$window.scroll(function() {

			if ($window.scrollTop() > heightSlide1/2) {

				if (!$panelTop.is("." + cssClassActive)) {
					$panelTop.addClass(cssClassTop);

					setTimeout(function(){
						$panelTop.addClass(cssClassActive).removeClass(cssClassTop);
					}, 100);
				}

			} else if ($panelTop.is("." + cssClassActive)) {

				$panelTop.addClass(cssClassTop);

				setTimeout(function(){
					$panelTop.removeClass(cssClassActive).removeClass(cssClassTop);
				}, 100);

			}

		});

	})();


	//gallery
	(function(){
		var $lents = $(".js-lenta");

		function gallery(lenta) {
			var $arrowNext = lenta.find(".js-lenta-arrow-next"),
				$arrowPrev = lenta.find(".js-lenta-arrow-prev"),

				$listBox = lenta.find(".js-lenta-box"),

				$list = lenta.find(".js-lenta-list"),
				$items = $list.find('.js-lenta-list-item'),
				$itemCur = $list.find('.js-lenta-list-item:first'),

				itemWidth = $listBox.width(),
				itemsLength = $items.length,

				go = 1
			;

			$items.css({ width: itemWidth });
			$list.css({ width: itemWidth*itemsLength });

			if (itemsLength > 1) {
				$arrowPrev.addClass(cssClassDisable);
			} else {
				$arrowPrev.hide();
				$arrowNext.hide();
			}


			function changeSlide( $nextSlide ){
				var index;

				$itemCur.removeClass(cssClassActive);
				$itemCur = $nextSlide;

				$itemCur.addClass(cssClassActive);
				index = $items.index($itemCur);

				if (index === 0){
					$arrowPrev.addClass(cssClassDisable);
					$arrowNext.removeClass(cssClassDisable);

				} else if ( index === itemsLength - 1) {
					$arrowPrev.removeClass(cssClassDisable);
					$arrowNext.addClass(cssClassDisable);
				} else {
					$arrowPrev.removeClass(cssClassDisable);
					$arrowNext.removeClass(cssClassDisable);
				}


				if ($list.is('.' + cssClassNotAnimate)) {
					$list.removeClass(cssClassNotAnimate);
				}

				$list.css({ marginLeft:-itemWidth*index });

				setTimeout(function(){
					go = 1;
				}, 900);
			}

			lenta.on ("click", ".js-lenta-arrow-next", (function(){
				if (!$(this).is('.' + cssClassDisable) && go===1){
					go=0;
					changeSlide($itemCur.next());
				}
			}));

			lenta.on ("click", ".js-lenta-arrow-prev", (function(){
				if (!$(this).is('.' + cssClassDisable) && go===1){
					go=0;
					changeSlide($itemCur.prev());
				}
			}));

			$window.resize(function() {
				var index = $items.index($itemCur);

				$list.addClass(cssClassNotAnimate);

				itemWidth = $listBox.width();

				$items.css({ width: itemWidth });
				$list.css({ width: itemWidth*itemsLength, marginLeft:-itemWidth*index });
			});
		}

		$lents.each(function() {
			gallery($(this));
		});

	})();

});