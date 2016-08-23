$( function() {
	var $window = $(window),
		$body = $('body'),
		$bodyHtml = $('html, body'),

		cssClassError = "_error",
		cssClassActive = "_active",
		cssClassOpen = "_open",
		cssClassDisable = "_disable",
		cssClassNotAnimate = "_notAnimate"


	;

	//panel-top
	(function(){
		var $panelTop = $(".js-panel-top"),
			$slide1 = $(".js-slide1"),
			heightSlide1 = $slide1.height(),

			cssClassTop = "_top"
		;

		function viewMenu ($element) {
			var $box = $element.closest(".js-panel-top");

			$box.toggleClass(cssClassOpen);
		}

		if ($body.is(".index")) {
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
		}

		$panelTop.on ("click", ".js-menu-door", (function(){
			viewMenu($(this));
		}));

		$panelTop.on ("click", ".js-menu-close", (function(){
			viewMenu($(this));
		}));

	})();


	//submenu
	(function(){
		var slideOffet = [],
			lastScrollTop = 0,
			scrollSpeed = 500,
			mySelector = 'data-slide',

			$menuBox = $('.js-scroll-menu'),
			$menuBoxItem = $('.js-scroll-menu a'),

			$panelTop = $(".js-panel-top"),
			panelTopHeight = $panelTop.height(),

			$header = $(".js-slide-header"),
			headerHeight = $header.length ? $header.height() : 0,

			menuBoxOffset = 0,
			menuHeight = 0
		;

		function setPositionSlide () {

			slideOffet = [];

			$menuBoxItem.each( function() {

				var id = $(this).attr('href').split('#')[1],
					offsetTop = $("[" + mySelector + "='" + id + "']").offset().top,
					height = $("[" + mySelector + "='" + id + "']").height()
				;

				slideOffet.push(Array(
					offsetTop - menuHeight - panelTopHeight,
					height + offsetTop,
					id)
				);

			});
		}

		if ($menuBox.length) {

			menuBoxOffset = $menuBox.offset().top - panelTopHeight;
			menuHeight = $menuBox.height();

			setPositionSlide();

			$window.resize(function() {
				setPositionSlide();
				headerHeight = $header.length ? $header.height() : 0;
			});

			$menuBoxItem.each( function(index) {

				var $item = $(this),
					id = $item.attr('href').split('#')[1]
				;

				$item.attr('id', id);

				function stickyMenu (direction){
					var scrollTop = $window.scrollTop();

					if (slideOffet[index][0] <= scrollTop && scrollTop <= slideOffet[index][1]) {

						if(direction == "up"){

							$("#"+id).addClass(cssClassActive);
							$("#"+slideOffet[index+1][2]).removeClass(cssClassActive);

						} else if(index > 0) {

							$("#"+id).addClass(cssClassActive);
							$("#"+slideOffet[index-1][2]).removeClass(cssClassActive);

						} else if(direction == undefined){

							$("#"+id).addClass(cssClassActive);
						}

						$.each(slideOffet, function(i){
							if (id != slideOffet[i][2]){

								$("#"+slideOffet[i][2]).removeClass(cssClassActive);
							}
						});
					}
				}

				stickyMenu();

				$window.scroll(function() {
					var st = $(this).scrollTop(),
						direction
					;

					if (st > lastScrollTop) {
						direction = "down";

					} else if (st < lastScrollTop ){
						direction = "up";
					}
					lastScrollTop = st;


					if ($window.scrollTop() > menuBoxOffset) {
						$menuBox.addClass(cssClassActive);
					} else {
						$menuBox.removeClass(cssClassActive);
					}

					stickyMenu(direction);

					if($window.scrollTop() + $window.height() == $(document).height()) {
						$menuBoxItem.removeClass(cssClassActive);
						$menuBoxItem.last().addClass(cssClassActive);
					}
				});


				$item.on('click', function(e){
					var hash = $(this).attr('href').split('#')[1],
						goTo =  $("[" + mySelector + "='" + hash + "']"),
						offset = goTo.offset().top - menuHeight - panelTopHeight + 5
					;


					if (offset <= (menuHeight + panelTopHeight + headerHeight)) {
						offset = 0;
					}

					$bodyHtml.stop().animate({ scrollTop: offset }, scrollSpeed);

					e.preventDefault();
				});

			});
		}

	})();



	//gallery
	(function(){
		var $lents = $(".js-lenta"),

			isMobile = !!(navigator.userAgent.match(/iPhone|iPod|iPad|iOS|android/i))
		;

		function gallery(lenta) {
			var $arrowNext = lenta.find(".js-lenta-arrow-next"),
				$arrowPrev = lenta.find(".js-lenta-arrow-prev"),

				$listBox = lenta.find(".js-lenta-box"),

				$list = lenta.find(".js-lenta-list"),
				$items = $list.find('.js-lenta-list-item'),
				$itemCur = $list.find('.js-lenta-list-item:first'),

				$slider = lenta.find(".js-lenta-slider-item"),

				itemWidth = $listBox.width(),
				itemsLength = $items.length,

				itemsLengthVisibleAll = 1,
				itemsLengthVisible = 1,

				go = 1
			;

			if (lenta.attr("data-fix-width") && $body.width() > 900) {
				itemWidth = $itemCur.outerWidth(true);
				itemsLengthVisibleAll = Math.ceil($listBox.width()/itemWidth);
				itemsLengthVisible = itemsLengthVisibleAll > 1 ? (itemsLengthVisibleAll - 1) : 1;
			}

			$items.css({ width: itemWidth });
			$list.css({ width: itemWidth*itemsLength });

			if (itemsLength > itemsLengthVisibleAll) {
				$arrowPrev.addClass(cssClassDisable);
			} else {
				$arrowPrev.hide();
				$arrowNext.hide();
			}


			function changeSlide( $nextSlide ){
				var index, $slide;

				$itemCur.removeClass(cssClassActive);
				$itemCur = $nextSlide;

				$itemCur.addClass(cssClassActive);
				index = $items.index($itemCur);
				$slide = $slider.eq(index);

				if (index === 0){
					$arrowPrev.addClass(cssClassDisable);
					$arrowNext.removeClass(cssClassDisable);

				} else if ( index + itemsLengthVisible === itemsLength ) {
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

				$slide.addClass(cssClassActive).siblings().removeClass(cssClassActive);

				setTimeout(function(){
					go = 1;
				}, 900);
			}

			if(!isMobile) {

				lenta.removeClass("_mobile");

				lenta.on ("click", ".js-lenta-arrow-next", (function(){
					if (!$(this).is('.' + cssClassDisable) && go===1){
						go=0;

						var $next = $items.eq($items.index($itemCur) + itemsLengthVisibleAll);
						changeSlide($next);
					}
				}));

				lenta.on ("click", ".js-lenta-arrow-prev", (function(){
					if (!$(this).is('.' + cssClassDisable) && go===1){
						go=0;

						var $prev = $items.eq($items.index($itemCur) - itemsLengthVisibleAll);
						changeSlide($prev);
					}
				}));

			} else {

				console.log("mobile");

				lenta.addClass("_mobile");

				lenta.on("swipeleft",function(){

					if ($items.index($itemCur) + 1 < itemsLength) {
						var $next = $items.eq($items.index($itemCur) + itemsLengthVisibleAll);
						changeSlide($next);
					}

				});

				lenta.on("swiperight",function(){

					console.log($items.index($itemCur));

					if ($items.index($itemCur) != 0) {
						var $prev = $items.eq($items.index($itemCur) - itemsLengthVisibleAll);
						changeSlide($prev);
					}
				});

			}

			$window.resize(function() {
				$itemCur = $items.eq(0);

				$itemCur.addClass(cssClassActive).siblings().removeClass(cssClassActive);
				$slider.eq(0).addClass(cssClassActive).siblings().removeClass(cssClassActive);

				$list.addClass(cssClassNotAnimate);

				if (lenta.attr("data-fix-width") && $body.width() > 900) {
					itemWidth = $itemCur.outerWidth(true);
					itemsLengthVisibleAll = Math.ceil($listBox.width()/itemWidth);
					itemsLengthVisible = itemsLengthVisibleAll > 1 ? (itemsLengthVisibleAll - 1) : 1;
				} else {
					itemWidth = $listBox.width();
					itemsLengthVisibleAll = 1;
					itemsLengthVisible = 1;
				}

				$arrowPrev.addClass(cssClassDisable);
				$arrowNext.removeClass(cssClassDisable);

				$items.css({ width: itemWidth });
				$list.css({ width: itemWidth*itemsLength, marginLeft:0 });
			});
		}

		$lents.each(function() {
			gallery($(this));
		});

	})();

	//footer
	(function(){
		var $footer = $(".js-footer-inf");

		$footer.on ("click", ".js-footer-inf-item-door", (function(){
			var $box = $(this).closest(".js-footer-inf-item");

			if ($body.width() < 750) {
				$box.toggleClass(cssClassActive);
			}
		}));

	})();


	//tabs
	(function(){
		var $tabs = $(".js-tabs");

		$tabs.on ("click", ".js-tabs-item", (function(){
			$(this).addClass(cssClassActive).siblings().removeClass(cssClassActive);
		}));

	})();

	//faq
	(function(){
		var $faqBox = $(".js-faq");

		$faqBox.on ("click", ".js-faq-door", (function(){
			var $item = $(this).closest(".js-faq-item");

			$item.toggleClass(cssClassActive);

		}));
	})();



	//form
	(function(){
		var $form = $(".js-form"),
			$errorMessageBox = $form.find(".js-form-error"),
			$selectBox = $(".js-form-select"),

			texts = {
				empty: "Заполните поля",
				email: "Не верный формат поля"
			}
		;


		function hideError (field) {
			field.removeClass(cssClassError);
			$errorMessageBox.text("").hide();
		}

		//select
		$selectBox.each(function () {
			var $select = $(this).find('select');

			$select.bind('change.select', function () {
				var option = $select.children(':selected'),
					$box = $(this).closest(".js-form-select"),
					$text = $box.find(".js-form-select-text"),

					text = option.val() ? option.text() : $text.attr("data-text-empty")
				;

				$text.text(text);

				if (option.val()) {
					$box.addClass(cssClassActive);

				} else {
					$box.removeClass(cssClassActive);
				}

			});

			$select.trigger('change.select');
		});


		$form.on ("focus", "." + cssClassError, (function(){
			hideError($(this));
		}));

		$form.on ("blur", "input[type=text], input[type=password], textarea", (function(){
			var $el = $(this);

			if ($el.val()) {
				$el.parent().addClass(cssClassActive);
			} else {
				$el.parent().removeClass(cssClassActive);
			}

		}));

		//form submit
		$form.bind( 'submit', function(event) {
			var $requireFields = $(this).find("[data-require]"),
				$fieldEmail = $(this).find("[name='email']"),

				errors = 0
			;

			$requireFields.each(function () {
				var $field = $(this);

				if ($field.is(".js-form-select")) {
					var option = $field.find("select").children(':selected');

					if (!option.val()) {
						$field.addClass(cssClassError);
						errors++;
					}

				} else if (!$field[0].value) {
					$field.addClass(cssClassError);
					errors++;
				}

			});


			if (errors) {
				$errorMessageBox.text(texts.empty).show();
				event.preventDefault();

			} else if ($fieldEmail.length && $fieldEmail.val().indexOf("@") === -1) {
				$fieldEmail.addClass(cssClassError);
				$errorMessageBox.text(texts.email).show();
				event.preventDefault();
			}

		});

	})();

	//tabs product
	(function(){
		var $tabsInfo = $(".js-tabs-info"),
			$items = $tabsInfo.find(".js-tabs-info-item"),
			$firstItem = $tabsInfo.find(".js-tabs-info-item:first"),
			$imgs = $tabsInfo.find(".js-tabs-info-img"),
			$textBox = $tabsInfo.find(".js-tabs-info-item-text")
		;

		function viewElement (obj) {
			obj.addClass(cssClassActive).siblings().removeClass(cssClassActive);
		}

		function viewText (obj) {
			if ($textBox.is(":visible")) {
				$textBox.text(obj.find(".js-tabs-info-item-content").text());
			}
		}


		if ($firstItem.length) {
			viewElement($firstItem);
			viewText($firstItem);
			viewElement($firstItem);
		}

		$tabsInfo.on ("click", ".js-tabs-info-door", (function(){
			var $curItem = $(this).closest(".js-tabs-info-item"),
				curIndex = $items.index($curItem),
				$curImg = $imgs.eq(curIndex)
			;

			viewElement($curItem);
			viewText($curItem);
			viewElement($curImg);

		}));

	})();

	//pricing
	(function(){
		var $box = $(".js-pricing-list"),
			$frame = $(".js-pricing-frame"),

			heightBox = $box.height()
		;

		function heightFrame () {
			$frame.each( function() {
				$(this).css({ minHeight: heightBox });
			});
		}

		if ($body.width() > 1024 ) {
			heightFrame();
		}

		$window.resize(function() {

			setTimeout(function(){

				$frame.css({ minHeight: 0 });

				if ($body.width() > 1024) {
					heightBox = $box.height();
					heightFrame();
				}

			}, 1000);

		});

		$body.on ("click", ".js-pricing-extra-door", (function(){
			var $item = $(this).closest(".js-pricing-extra-item");

			$item.siblings().removeClass(cssClassActive);

			if ($item.is("." + cssClassActive)) {
				$item.removeClass(cssClassActive);
			} else {
				$item.addClass(cssClassActive);
			}
		}));

	})();

});