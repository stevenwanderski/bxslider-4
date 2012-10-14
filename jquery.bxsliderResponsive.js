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
			hideControlOnEnd: true,
			speed: 500,
			delay: 2000,
			startSlide: 0,
			pager: true,
			pagerType: 'full',
			pagerShortSeparator: ' / ',
			buildPager: null,
			controls: true,
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
			onSomeEvent: function() {}
		}

		var el = this;
		var slider = {}
		
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
				height: slider.children.eq(slider.settings.startSlide).outerHeight()
			}
			// store the current state of the slider (if in motion, working is true)
			slider.working = false;
			// initialize the controls object
			slider.controls = {}
			// perform all DOM modifications
			setup();
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
				height: slider.settings.mode == 'vertical' ? '999999px' : 'auto',
				position: 'relative',
				margin: 0,
				padding: 0
			});
			// store a namspace reference to .bx-wrapper
			slider.wrap = el.parent();
			// make modifications to the wrapper (.bx-wrapper)
			slider.wrap.css({
				width: slider.settings.mode == 'horizontal' ? slider.active.width : 'auto',
				height: slider.settings.mode == 'vertical' ? slider.active.height : 'auto',
				overflow: 'hidden',
				position: 'relative'
			});
			// if controls are requested, add them
			if(slider.settings.controls) appendControls();
			// if auto is true, and auto controls are requested, add them
			if(slider.settings.auto && slider.settings.autoControls) appendControlsAuto();
			// if pager is requested, add it
			if(slider.settings.pager) appendPager();
			// modify the newly added slide
			slider.active.el = applyNewElCss(slider.active.el);
			// replace el's content with the first requested slide
			el.html(slider.active.el);
		}
		
		/**
		 * Appends the pager
		 */
		var appendPager = function(){
			var pagerHtml = '';
			// build the "full" pager - note that the "short" pager is built in the updatePagerActive call
			if(slider.settings.pagerType == 'full'){
				slider.children.each(function(index, val){
					// if a buildPager function is supplied, use it to get pager link value, else use index + 1
					var linkContent = slider.settings.buildPager && $.isFunction(slider.settings.buildPager) ? slider.settings.buildPager(index, $(val)) : index + 1;
					pagerHtml += '<a href="" data-slide-index="' + index + '" class="bx-pager-link">' + linkContent + '</a>';
				});
			}
			// create the pager DOM element
			slider.pagerEl = $('<div class="bx-pager" />');
			// assign the pager click binding
			slider.pagerEl.delegate('.bx-pager-link', 'click', clickPagerBind);
			// populate the pager element with pager links
			slider.pagerEl.html(pagerHtml);
			// add the pager to the DOM
			slider.wrap.after(slider.pagerEl);
			// make the appropriate link active
			updatePagerActive(slider.settings.startSlide);
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
			// add the controls to the DOM
			slider.controls.directionEl.append(slider.controls.prev).append(slider.controls.next);
			// check for any updates to the controls (like hideControlOnEnd updates)
			updateDirectionControls(slider.settings.startSlide);
			slider.wrap.after(slider.controls.directionEl);
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
			// add the controls to the DOM
			slider.wrap.after(slider.controls.autoEl);
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
			var slideIndex = parseInt(pagerLink.attr('data-slide-index'));
			// if clicked pager link is not active, continue with the goToSlide call
			if(slideIndex != slider.active.index) el.goToSlide(slideIndex);
			e.preventDefault();
		}
		
		/**
		 * Updates the pager links with an active class
		 *
		 * @param slideIndex (int) 
		 *  - index of slide to make active
		 */
		var updatePagerActive = function(slideIndex){
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
		var updateAfterSlideTransition = function(newEl, newIndex){
			// remove the old active el
			slider.active.el.remove();
			// assign the new active el
			slider.active.el = newEl;
			// assign the new active index (zero-based)
			slider.active.index = newIndex;
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
				if (slideIndex == 0){
					slider.controls.directionEl.append(slider.controls.next);
				// if last slide
				}else if(slideIndex == slider.children.length - 1){
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
			newEl.css({
				float: slider.settings.mode == 'horizontal' ? 'left' : 'none',
				width: slider.settings.mode == 'horizontal' ? slider.active.width : 'auto',
				listStyle: 'none'
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
			// clone the newly requested slide
			var newSlide = slider.children.eq(slideIndex).clone();
			// apply CSS to the newly requested slide
			newSlide = applyNewElCss(newSlide);
			// update the pager with active class
			updatePagerActive(slideIndex);
			// check for direction control update
			updateDirectionControls(slideIndex);
			
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
					updateAfterSlideTransition(newSlide, slideIndex);
				});
			
			// if slider is not set to mode: "fade"
			}else{
				
				// determine direction of travel to destination slide
				if(typeof direction == 'undefined'){
					direction = slideIndex > slider.active.index ? 'next' : 'prev';
				}
				
				// if direction is "next"
				if(direction == 'next'){
					
					// if mode is "horizontal"
					if(slider.settings.mode == 'horizontal'){
						
						// append the newly requested element to the right side of the current element
						// then animate to the left
						el.append(newSlide).animate({left: -slider.active.width}, slider.settings.speed, function(){
							updateAfterSlideTransition(newSlide, slideIndex);
							// reset el's left position to zero
							el.css('left', 0);
						});
						
					// if mode is "vertical"
					}else if(slider.settings.mode == 'vertical'){
						
						// append the newly requested element to the right side of the current element
						// then animate to the left
						el.append(newSlide).animate({top: -slider.active.height}, slider.settings.speed, function(){
							updateAfterSlideTransition(newSlide, slideIndex);
							// reset el's left position to zero
							el.css('top', 0);
						});
						
						// check if the wrapper should use a new height (if the newly requested slide has a different height)
						if(newSlide.height() != slider.active.height){
							slider.wrap.height(newSlide.height());
							slider.active.height = newSlide.height();
						}
						
					}
				
				// if direction is "prev"
				}else if(direction == 'prev'){
					
					// if mode is "horizontal"
					if(slider.settings.mode == 'horizontal'){
						
						// prepend the newly requested element to the left side of the current element
						// then animate to the right
						el.prepend(newSlide).css('left', -slider.active.width).animate({left: 0}, slider.settings.speed, function(){
							updateAfterSlideTransition(newSlide, slideIndex);
						});
						
					// if mode is "vertical"
					}else if(slider.settings.mode == 'vertical'){
						
						// prepend the newly requested element to the left side of the current element
						// then animate to the right
						el.prepend(newSlide).css('top', -slider.active.height).animate({top: 0}, slider.settings.speed, function(){
							updateAfterSlideTransition(newSlide, slideIndex);
						});
						
						// check if the wrapper should use a new height (if the newly requested slide has a different height)
						if(newSlide.height() != slider.active.height){
							slider.wrap.height(newSlide.height());
							slider.active.height = newSlide.height();
						}
						
					}
				}
			}
		}
		
		/**
		 * Transitions to the next slide in the show
		 */
		el.goToNextSlide = function(){
			// if infiniteLoop is false and slideIndex + 1 is the last slide, disregard call
			if (!slider.settings.infiniteLoop && slider.active.index + 1 == slider.children.length) return;
			// if the next slide index is greater than the number of total slide, use zero
			// if not, use active index + 1
			var nextIndex = slider.active.index + 1 == slider.children.length ? 0 : slider.active.index + 1;
			el.goToSlide(nextIndex, 'next');
		}
		
		/**
		 * Transitions to the prev slide in the show
		 */
		el.goToPrevSlide = function(){
			// if infiniteLoop is false and slideIndex - 1 is the first slide, disregard call
			if (!slider.settings.infiniteLoop && slider.active.index - 1 < 0) return;
			// if the prev slide index is less than zero, use the last index
			// if not, use active index - 1
			var prevIndex = slider.active.index - 1 < 0 ? slider.children.length - 1 : slider.active.index - 1;
			el.goToSlide(prevIndex, 'prev');
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
			// if mode is "horizontal", adjust all widths
			if(slider.settings.mode == 'horizontal'){
				slider.active.width = slider.parent.width();
				slider.wrap.width(slider.active.width);
				el.children().width(slider.active.width);
			// if mode is "vertical", adjust all heights
			}else if(slider.settings.mode == 'vertical'){
				slider.active.height = slider.active.el.height();
				slider.wrap.height(slider.active.height);
			}
		});
		
		// initialize the show
		init();
		
		// returns the current jQuery object
		return this;

	}

})(jQuery);