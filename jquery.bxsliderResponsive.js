/**
 * BxSlider v4.0 - Responsive!!
 *
 * Woot woot.
 */

;(function($) {

	$.fn.bxSlider = function(options) {

		var defaults = {
			mode: 'horizontal',
			childSelector: '',
			infiniteLoop: true,
			hideControlOnEnd: false,
			speed: 500,
			delay: 2000,
			easing: 'swing',
			slideMargin: 0,
			startSlide: 0,
			pager: true,
			pagerType: 'full',
			pagerShortSeparator: ' / ',
			pagerSelector: null,
			buildPager: null,
			controls: true,
			controlsSelector: null,
			nextText: 'Next',
			prevText: 'Prev',
			startText: 'Start',
			stopText: 'Stop',
			auto: false,
			autoStart: true,
			autoDirection: 'next',
			autoControls: false,
			autoControlsCombine: false,
			autoHover: false,
			autoDelay: 0,
			ticker: false,
			minSlides: 1,
			maxSlides: 1,
			moveSlides: 0,
			slideWidth: 0,
			onSomeEvent: function() {}
		}

		var el = this;
		slider = {}
		
		/**
		 * ===================================================================================
		 * = PRIVATE FUNCTIONS
		 * ===================================================================================
		 */
		
		/**
		 * Initializes namespace settings to be used throughout plugin
		 */
		var init = function() {
			// merge user supplied options
			slider.settings = $.extend({}, defaults, options);
			// store the immediate children
			slider.children = el.children(slider.settings.childSelector);
			// store el's parent
			slider.parent = el.parent();
			// store active slide information
			slider.active = {
				index: slider.settings.startSlide,
				el: slider.children.eq(slider.settings.startSlide).clone(),
				width: slider.children.eq(slider.settings.startSlide).outerWidth(),
				height: slider.children.eq(slider.settings.startSlide).outerHeight(),
			}
			
			slider.carousel = slider.settings.minSlides > 1 || slider.settings.maxSlides > 1;
			slider.minThreashold = (slider.settings.minSlides * slider.settings.slideWidth) + ((slider.settings.minSlides - 1) * slider.settings.slideMargin);
			slider.maxThreashold = (slider.settings.maxSlides * slider.settings.slideWidth) + ((slider.settings.maxSlides - 1) * slider.settings.slideMargin);
			
			// store the current state of the slider (if in motion, working is true)
			slider.working = false;
			// initialize the controls object
			slider.controls = {}
			// if ticker is true, start the ticker
			if(slider.settings.ticker) initTicker();
			// perform all DOM modifications
			setup();
			// make the appropriate link active
			if (slider.settings.pager) updatePagerActive(slider.settings.startSlide);
			// check for any updates to the controls (like hideControlOnEnd updates)
			if(slider.settings.controls) updateDirectionControls(slider.settings.startSlide);
			// if auto is true, start the show
			if(slider.settings.auto && slider.settings.autoStart) initAuto();
		}

		/**
		 * Performs all DOM and CSS modifications
		 */
		var setup = function(){
			// wrap el in a wrapper
			el.wrap('<div class="bx-wrapper" />');
			// set el to a massive width, to hold any needed slides
			// also strip any margin and padding from el
			el.css({
				width: slider.settings.mode == 'horizontal' ? '999999px' : 'auto',
				height: 0,
				position: 'relative',
				margin: 0,
				padding: 0
			});
			// store a namspace reference to .bx-wrapper
			slider.wrap = el.parent();
			// make modifications to the wrapper (.bx-wrapper)
			slider.wrap.css({
				width: '100%',
				height: slider.settings.mode == 'vertical' ? slider.active.height : 'auto',
				overflow: 'hidden',
				position: 'relative'
			});
			// apply css to all slider children
			slider.children.each(function(index) {
			  applyNewElCss($(this));
			});
			
			// if infinite loop, prepare additional slides
			if(slider.settings.infiniteLoop && !slider.carousel){
				var clone = el.children().clone().slice(0, slider.settings.maxSlides);
				el.append(clone);
			}
			
			// if controls are requested, add them
			if(slider.settings.controls) appendControls();
			// if auto is true, and auto controls are requested, add them
			if(slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
			// if pager is requested, add it
			if(slider.settings.pager) appendPager();
		}
		
		var getNumberSlidesShowing = function(){
			var slidesShowing = 0;
			if(slider.wrap.width() < slider.minThreashold){
				slidesShowing = slider.settings.minSlides;
			}else if(slider.wrap.width() > slider.maxThreashold){
				slidesShowing = slider.settings.maxSlides;
			}else{
				var childWidth = el.children(':first').width();
				slidesShowing = Math.floor(slider.wrap.width() / childWidth);
			}
			return slidesShowing;
		}
		
		var getPagerQty = function(){
			var pagerQty = 0;
			if(slider.settings.moveSlides > 0){
				var breakPoint = 0;
				var counter = 0
				while (breakPoint < slider.children.length){
					++pagerQty;
					breakPoint = counter + getNumberSlidesShowing();
					counter += slider.settings.moveSlides;
				}
			}else{
				pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
			}
			return pagerQty;
		}
		
		var getCurrentPage = function(){
			var currentPage = slider.active.index;
			if(slider.settings.moveSlides != 1){
				currentPage = Math.ceil(slider.active.index / getNumberSlidesShowing());
			}
			return currentPage >= getPagerQty() ? getPagerQty() - 1 : currentPage;
		}
		
		var getMoveBy = function(){
			if(slider.settings.moveSlides > 0){
				return slider.settings.moveSlides;
			}
			return getNumberSlidesShowing();
		}
		
		var populatePager = function(){
			var pagerHtml = '';
			// var numberOfSlidesToMove = slider.settings.moveSlides > 0 ? slider.settings.moveSlides : getNumberSlidesShowing();
			pagerQty = getPagerQty();
			for (var i=0; i < pagerQty; i++) {
				// if a buildPager function is supplied, use it to get pager link value, else use index + 1
				var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i, $(val)) : i + 1;
				pagerHtml += '<a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a>';
			};
			
			// populate the pager element with pager links
			slider.pagerEl.html(pagerHtml);
			
		}
		
		/**
		 * Appends the pager
		 */
		var appendPager = function(){
			// build the "full" pager - note that the "short" pager is built in the updatePagerActive call
			if(slider.settings.pagerType == 'full'){
				
				// // var numberOfSlidesToMove = slider.settings.moveSlides > 0 ? slider.settings.moveSlides : getNumberSlidesShowing();
				// pagerQty = Math.ceil(slider.children.length / getNumberSlidesShowing());
				// for (var i=0; i < pagerQty; i++) {
				// 	// if a buildPager function is supplied, use it to get pager link value, else use index + 1
				// 	var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(i, $(val)) : i + 1;
				// 	pagerHtml += '<a href="" data-slide-index="' + i + '" class="bx-pager-link">' + linkContent + '</a>';
				// };
				
				// slider.children.each(function(index, val){
				// 	// if a buildPager function is supplied, use it to get pager link value, else use index + 1
				// 	var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(index, $(val)) : index + 1;
				// 	pagerHtml += '<a href="" data-slide-index="' + index + '" class="bx-pager-link">' + linkContent + '</a>';
				// });
			}
			// create the pager DOM element
			slider.pagerEl = $('<div class="bx-pager" />');
			// assign the pager click binding
			slider.pagerEl.delegate('.bx-pager-link', 'click', clickPagerBind);
			
			// // populate the pager element with pager links
			// slider.pagerEl.html(pagerHtml);
			
			// if a pager selector was supplied, populate it with the pager
			if(slider.settings.pagerSelector){
				$(slider.settings.pagerSelector).html(slider.pagerEl);
			// if no pager selector was supplied, add it after the wrapper
			}else{
				slider.wrap.after(slider.pagerEl);
			}
			
			populatePager();
			
		}
		
		/**
		 * Appends prev / next controls to the DOM
		 */
		var appendControls = function(){
			slider.controls.next = $('<a class="bx-next" href="">' + slider.settings.nextText + '</a>');
			slider.controls.prev = $('<a class="bx-prev" href="">' + slider.settings.prevText + '</a>');
			// add the controls to the DOM
			slider.controls.directionEl = $('<div class="bx-controls bx-controls-direction" />');
			// bind click actions to the controls
			slider.controls.directionEl.delegate('.bx-next', 'click', clickNextBind);
			slider.controls.directionEl.delegate('.bx-prev', 'click', clickPrevBind);
			// add the control elements to the directionEl
			slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
			// if controls selector was supplied, populate it with the controls
			if(slider.settings.controlsSelector){
				$(slider.settings.controlsSelector).html(slider.controls.directionEl);
			// if controls selector was not supplied, add it after the wrapper
			}else{
				slider.wrap.after(slider.controls.directionEl);
			}
		}
		
		/**
		 * Appends start / stop auto controls to the DOM
		 */
		var appendControlsAuto = function(){
			slider.controls.start = $('<a class="bx-start" href="">' + slider.settings.startText + '</a>');
			slider.controls.stop = $('<a class="bx-stop" href="">' + slider.settings.stopText + '</a>');
			// add the controls to the DOM
			slider.controls.autoEl = $('<div class="bx-controls bx-controls-auto" />');
			// bind click actions to the controls
			slider.controls.autoEl.delegate('.bx-start', 'click', clickStartBind);
			slider.controls.autoEl.delegate('.bx-stop', 'click', clickStopBind);
			// if autoControlsCombine, insert only the "start" control
			if(slider.settings.autoControlsCombine){
				slider.controls.autoEl.append(slider.controls.start);
			// if autoControlsCombine is false, insert both controls
			}else{
				slider.controls.autoEl.append(slider.controls.start).append(slider.controls.stop);
			}
			// if auto controls selector was supplied, populate it with the controls
			if(slider.settings.autoControlsSelector){
				$(slider.settings.autoControlsSelector).html(slider.controls.autoEl);
			// if auto controls selector was not supplied, add it after the wrapper
			}else{
				slider.wrap.after(slider.controls.autoEl);
			}
		}
		
		/**
		 * Click next binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickNextBind = function(e){
			// if auto show is running, stop it
			if (slider.settings.auto) el.stopAuto();
			el.goToNextSlide();
			e.preventDefault();
		}
		
		/**
		 * Click prev binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickPrevBind = function(e){
			// if auto show is running, stop it
			if (slider.settings.auto) el.stopAuto();
			el.goToPrevSlide();
			e.preventDefault();
		}
		
		/**
		 * Click start binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickStartBind = function(e){
			el.startAuto();
			e.preventDefault();
		}
		
		/**
		 * Click stop binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickStopBind = function(e){
			el.stopAuto();
			e.preventDefault();
		}

		/**
		 * Click pager binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickPagerBind = function(e){
			var pagerLink = $(e.currentTarget);
			var pagerIndex = parseInt(pagerLink.attr('data-slide-index'));
			
			// if clicked pager link is not active, continue with the goToSlide call
			if(pagerIndex != slider.active.index) el.goToSlide(pagerIndex);
			e.preventDefault();
		}
		
		/**
		 * Updates the pager links with an active class
		 *
		 * @param slideIndex (int) 
		 *  - index of slide to make active
		 */
		var updatePagerActive = function(slideIndex){
			
			// if infinite loop is occurring
			if(slideIndex >= getPagerQty()){
				slideIndex -= getPagerQty();
			}
			
			if(slider.settings.pagerType == 'short'){
				slider.pagerEl.html((slideIndex + 1) + slider.settings.pagerShortSeparator + slider.children.length);
				return;
			}
			slider.pagerEl.children().removeClass('active');
			slider.pagerEl.children().eq(slideIndex).addClass('active');
		}
		
		/**
		 * Cleans up the old slide after a transition
		 *
		 * @param newEl (jQuery object) 
		 *  - the newly added element
		 *
		 * @param newIndex (int) 
		 *  - the newly added element's index
		 */
		var updateAfterSlideTransition = function(newIndex){
			// slider.active.index = newIndex;
			// slider.active.set.remove();
			// slider.active.set = el.children().slice(0, slider.settings.moveSlides > 0 ? slider.settings.moveSlides : getNumberSlidesShowing());
			// slider.active.last  = newIndex;
			// slider.active.first  = newEl;
			// // remove the old active el
			// slider.active.el.remove();
			// // assign the new active el
			// slider.active.el = newEl;
			// // assign the new active index (zero-based)
			// slider.active.index = newIndex;
			// // remove any margin applied by slideMargin
			// slider.active.el.css('margin', 0);
			// declare that the transition is complete
			slider.working = false;
		}
		
		/**
		 * Updates the auto controls state (either active, or combined switch)
		 *
		 * @param state (string) "start", "stop"
		 *  - the new state of the auto show
		 */
		var updateAutoControls = function(state){
			// if autoControlsCombine is true, replace the current control with the new state 
			if(slider.settings.autoControlsCombine){
				slider.controls.autoEl.html(slider.controls[state]);
			// if autoControlsCombine is false, apply the "active" class to the appropriate control 
			}else{
				slider.controls.autoEl.children().removeClass('active');
				slider.controls.autoEl.find(':not(.bx-' + state + ')').addClass('active');
			}
		}
		
		/**
		 * Updates the direction controls (checks if either should be hidden)
		 *
		 * @param slideIndex (int) 
		 *  - index of the newly requested slide
		 */
		var updateDirectionControls = function(slideIndex){
			// if infiniteLoop is false and hideControlOnEnd is true
			if(!slider.settings.infiniteLoop && slider.settings.hideControlOnEnd){
				// clear the contents of the controls
				slider.controls.directionEl.empty();
				// if first slide
				if (slider.active.page == 0){
					slider.controls.directionEl.append(slider.controls.next);
				// if last slide
				}else if(slider.active.page == getPagerQty() - 1){
					slider.controls.directionEl.append(slider.controls.prev);
				// if any slide in the middle
				}else{
					slider.controls.directionEl.append(slider.controls.prev, slider.controls.next);
				}
			}
		}
		
		/**
		 * Modifies newly added slide's CSS
		 *
		 * @param newEl (jQuery object) 
		 *  - the newly added element
		 */
		var applyNewElCss = function(newEl){
			
			var newElWidth = slider.settings.slideWidth;
			var wrapWidth = slider.wrap.width();
			
			if(slider.settings.slideWidth == 0){
				newElWidth = wrapWidth;
			}else{
				if(wrapWidth > slider.maxThreashold){
					newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.maxSlides - 1))) / slider.settings.maxSlides;
				}else if(wrapWidth < slider.minThreashold){
					newElWidth = (wrapWidth - (slider.settings.slideMargin * (slider.settings.minSlides - 1))) / slider.settings.minSlides;
				}
			}

			newEl.css({
				float: slider.settings.mode == 'horizontal' ? 'left' : 'none',
				width: newElWidth,
				listStyle: 'none',
				marginRight: slider.settings.mode == 'horizontal' ? slider.settings.slideMargin : 0,
				marginBottom: slider.settings.mode == 'vertical' ? slider.settings.slideMargin: 0
			});
			return newEl;
		}
		
		/**
		 * Initialzes the auto process
		 */
		var initAuto = function(){
			// if autoDelay was supplied, launch the auto show using a setTimeout() call
			if(slider.settings.autoDelay > 0){
				var timeout = setTimeout(el.startAuto, slider.settings.autoDelay);
			// if autoDelay was not supplied, start the auto show normally
			}else{
				el.startAuto();
			}
			// if autoHover is requested
			if(slider.settings.autoHover){
				// on el hover
				el.hover(function(){
					// if the auto show is currently playing (has an active interval)
					if(slider.interval){
						// stop the auto show and pass true agument which will prevent control update
						el.stopAuto(true);
						// create a new autoPaused value which will be used by the relative "mouseout" event
						slider.autoPaused = true;
					}
				}, function(){
					// if the autoPaused value was created be the prior "mouseover" event
					if(slider.autoPaused){
						// start the auto show and pass true agument which will prevent control update
						el.startAuto(true);
						// reset the autoPaused value
						slider.autoPaused = null;
					}
				});
			}
			
		}
		
		/**
		 * Initialzes the ticker process
		 */
		var initTicker = function(){
			slider.settings.delay = 0;
			slider.settings.auto = true;
			slider.settings.pager = false;
			slider.settings.controls = false;
			slider.settings.autoControls = false;
			slider.settings.easing = 'linear';
			initAuto();
		}
		
		/**
		 * ===================================================================================
		 * = PUBLIC FUNCTIONS
		 * ===================================================================================
		 */
		
		/**
		 * Performs slide transition to the specified slide
		 *
		 * @param slideIndex (int) 
		 *  - the destination slide's index (zero-based)
		 *
		 * @param direction (string) "next", "prev"
		 *  - direction of travel to arrive at destination slide
		 */
		el.goToSlide = function(slideIndex, direction) {
			// if plugin is currently in motion, ignore request
			if(slider.working) return;
			// declare that plugin is in motion
			slider.working = true;
			// // clone the newly requested slide
			// var newSlide = slider.children.eq(slideIndex).clone();
			// // apply CSS to the newly requested slide
			// newSlide = applyNewElCss(newSlide);
			
			// determine direction of travel to destination slide
			if(typeof direction == 'undefined'){
				direction = slideIndex > slider.active.index ? 'next' : 'prev';
			}
			
			slider.active.index = slideIndex;
			
			// update the pager with active class
			if(slider.settings.pager) updatePagerActive(slideIndex);
			// // check for direction control update
			if(slider.settings.controls) updateDirectionControls(slideIndex);
			
			// if slider is set to mode: "fade"
			if(slider.settings.mode == 'fade'){
				// absolutely position the new slide over current slide
				// also set the new slide to display: none
				newSlide.css({
					position: 'absolute',
					top: 0,
					left: 0,
					display: 'none'
				});
				// add the new slide to the DOM
				el.append(newSlide);
				// fade out the currently active slide (same time as newly requested slide)
				slider.active.el.fadeOut(slider.settings.speed);
				// fade in the newly requested slide (same time as currently active slide)
				newSlide.fadeIn(slider.settings.speed, function(){
					// after fade transitions, change position from "absolute" to "relative"
					$(this).css('position', 'relative');
					// perform the update actions on the newly requested slide
					updateAfterSlideTransition(slideIndex);
				});
			
			// if slider is not set to mode: "fade"
			}else{
				
				// if direction is "next"
				if(direction == 'next'){
					
					// if mode is "horizontal"
					if(slider.settings.mode == 'horizontal'){
						
						// an infinite loop is occurring
						if(slideIndex >= getPagerQty()){
							
						}
						
						slider.active.last = false;
						var moveBy = 0;
						
						// if carousel mode and last slide
						if(slider.carousel && slider.active.index >= getPagerQty() - 1){
							slider.active.last = true;
							var lastChild = el.children().eq(slider.children.length - 1);
							var position = lastChild.position();
							moveBy = -(position.left - (slider.wrap.width() - lastChild.width()));
						// all other requests
						}else{
							var requestEl = slideIndex * getMoveBy();
							var position = el.children().eq(requestEl).position();
							moveBy = -position.left;
						}
						
						el.animate({left: moveBy}, slider.settings.speed, slider.settings.easing, function(){
							newSlide = '';
							updateAfterSlideTransition(slideIndex);
						});
						
					// if mode is "vertical"
					}else if(slider.settings.mode == 'vertical'){
						
						slider.active.last = slider.active.index >= getPagerQty() - 1;
						
						var requestEl = slideIndex * getMoveBy();
						var position = el.children().eq(requestEl).position();
						moveBy = -position.top;
						
						// append the newly requested element to the right side of the current element
						// then animate to the left
						el.animate({top: moveBy}, slider.settings.speed, slider.settings.easing, function(){
							updateAfterSlideTransition(slideIndex);
							// reset el's left position to zero
							// el.css('top', 0);
						});
						
						// // check if the wrapper should use a new height (if the newly requested slide has a different height)
						// if(newSlide.height() != slider.active.height){
						// 	slider.wrap.height(newSlide.height());
						// 	slider.active.height = newSlide.height();
						// }
						
					}
				
				// if direction is "prev"
				}else if(direction == 'prev'){
					
					// if mode is "horizontal"
					if(slider.settings.mode == 'horizontal'){
						
						var moveBy = 0;
						slider.active.last = false;
						
						if(slideIndex > 0){
							var requestEl = slideIndex * getMoveBy();
							var position = el.children().eq(requestEl).position();
							moveBy = -position.left;
						}
						
						el.animate({left: moveBy}, slider.settings.speed, slider.settings.easing, function(){
							newSlide = '';
							updateAfterSlideTransition(slideIndex);
						});
						
						// // apply any margins from slideMargin
						// newSlide.css({
						// 	marginRight: slider.settings.slideMargin > 0 ? slider.settings.slideMargin : 0
						// });
						// 
						// // prepend the newly requested element to the left side of the current element
						// // then animate to the right
						// el.prepend(newSlide).css('left', -(slider.active.width + slider.settings.slideMargin)).animate({left: 0}, slider.settings.speed, slider.settings.easing, function(){
						// 	updateAfterSlideTransition(newSlide, slideIndex);
						// });
						
					// if mode is "vertical"
					}else if(slider.settings.mode == 'vertical'){
						
						slider.active.last = false;
						
						var requestEl = slideIndex * getMoveBy();
						var position = el.children().eq(requestEl).position();
						var moveBy = -position.top;
						
						// prepend the newly requested element to the left side of the current element
						// then animate to the right
						el.animate({top: moveBy}, slider.settings.speed, slider.settings.easing, function(){
							updateAfterSlideTransition(slideIndex);
						});
						
						// // check if the wrapper should use a new height (if the newly requested slide has a different height)
						// if(newSlide.height() != slider.active.height){
						// 	slider.wrap.height(newSlide.height());
						// 	slider.active.height = newSlide.height();
						// }
						
					}
				}
			}
		}
		
		/**
		 * Transitions to the next slide in the show
		 */
		el.goToNextSlide = function(){
			// if infiniteLoop is false and last page is showing, disregard call
			if (!slider.settings.infiniteLoop && slider.active.last) return;
			var pagerIndex = slider.active.index + 1;
			// if carousel mode, infinite loop is true and "next" was clicked while on the last slide, go to slide 0
			if (slider.carousel && slider.settings.infiniteLoop && pagerIndex >= getPagerQty()) pagerIndex = 0;
			el.goToSlide(pagerIndex, 'next');
		}
		
		/**
		 * Transitions to the prev slide in the show
		 */
		el.goToPrevSlide = function(){
			// if infiniteLoop is false and last page is showing, disregard call
			if (!slider.settings.infiniteLoop && slider.active.index == 0) return;
			var pagerIndex = slider.active.index - 1;
			// if carousel mode, infinite loop is true and "prev" was clicked while on the first slide, go to last slide
			if (slider.carousel && slider.settings.infiniteLoop && pagerIndex < 0) pagerIndex = getPagerQty() - 1;
			el.goToSlide(pagerIndex, 'next');
		}
		
		/**
		 * Starts the auto show
		 *
		 * @param preventControlUpdate (boolean) 
		 *  - if true, auto controls state will not be updated
		 */
		el.startAuto = function(preventControlUpdate){
			// if an interval already exists, disregard call
			if(slider.interval) return;
			// create an interval
			slider.interval = setInterval(function(){
				slider.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
			}, slider.settings.delay);
			// if auto controls are displayed and preventControlUpdate is not true
			if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
		}
		
		/**
		 * Stops the auto show
		 *
		 * @param preventControlUpdate (boolean) 
		 *  - if true, auto controls state will not be updated
		 */
		el.stopAuto = function(preventControlUpdate){
			// if no interval exists, disregard call
			if(!slider.interval) return;
			// clear the interval
			clearInterval(slider.interval);
			slider.interval = null;
			// if auto controls are displayed and preventControlUpdate is not true
			if (slider.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
		}
		
		/**
		 * Makes slideshow responsive
		 * On window resize, update the slider widths
		 */
		$(window).resize(function(){
			
			el.children().each(function(index) {
			  applyNewElCss($(this));
			});
			
			if(slider.settings.pager){
				populatePager();
				updatePagerActive(slider.active.index);
			}
			
			if (slider.active.last) slider.active.index = getPagerQty() - 1;
			
			// if last slide
			if(slider.active.last){
				var lastChild = el.children(':last');
				var position = lastChild.position();
				el.css('left', -(position.left - (slider.wrap.width() - lastChild.width())));
			}else{
				var position = el.children().eq(slider.active.index * getMoveBy()).position();
				if (slider.active.index == getPagerQty() - 1) slider.active.last = true;
				if (position != undefined) el.css('left', -position.left);
			}
			
			// // if mode is "horizontal", adjust all widths
			// if(slider.settings.mode == 'horizontal'){
			// 	slider.active.width = slider.parent.width();
			// 	slider.wrap.width(slider.active.width);
			// 	el.children().width(slider.active.width);
			// // if mode is "vertical", adjust all heights
			// }else if(slider.settings.mode == 'vertical'){
			// 	slider.active.height = slider.active.el.height();
			// 	slider.wrap.height(slider.active.height);
			// }
		});
		
		// initialize the show
		init();
		
		// returns the current jQuery object
		return this;

	}

})(jQuery);