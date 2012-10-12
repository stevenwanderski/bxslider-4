/**
 * BxSlider v4.0 - Responsive!!
 *
 * Woot woot.
 */

;(function($) {

	$.fn.bxSliderFlex = function(options) {

		var defaults = {
			mode: 'horizontal',
			childSelector: '',
			infiniteLoop: true,
			hideControlOnEnd: true,
			speed: 500,
			delay: 2000,
			startSlide: 0,
			pager: true,
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
		var plugin = {}
		
		/**
		 * ===================================================================================
		 * = PRIVATE FUNCTIONS
		 * ===================================================================================
		 */
		
		// initialize namespace settings to be used throughout plugin
		var init = function() {
			// merge user supplied options
			plugin.settings = $.extend({}, defaults, options);
			// store the immediate children
			plugin.children = el.children(plugin.settings.childSelector);
			// store el's parent
			plugin.parent = el.parent();
			// store active slide information
			plugin.active = {
				index: plugin.settings.startSlide,
				el: plugin.children.eq(plugin.settings.startSlide).clone(),
				width: plugin.children.eq(plugin.settings.startSlide).outerWidth()
			}
			// store the current state of the slider (if in motion, working is true)
			plugin.working = false;
			// initialize the controls object
			plugin.controls = {}
			// perform all DOM modifications
			setup();
			// if auto is true, start the show
			if(plugin.settings.auto && plugin.settings.autoStart) initAuto();
		}

		// performs all DOM and CSS modifications
		var setup = function(){
			// wrap el in a wrapper
			el.wrap('<div class="bx-wrapper" />');
			// set el to a massive width, to hold any needed slides
			// also strip any margin and padding from el
			el.width(999999).css({
				position: 'relative',
				margin: 0,
				padding: 0
			});
			// store a namspace reference to .bx-wrapper
			plugin.wrap = el.parent();
			// make modifications to the wrapper (.bx-wrapper)
			setWrapDimensions();
			// if controls are requested, add them
			if(plugin.settings.controls) appendControls();
			// if auto is true, and auto controls are requested, add them
			if(plugin.settings.auto && plugin.settings.autoControls) appendControlsAuto();
			// if pager is requested, add it
			if(plugin.settings.pager) appendPager();
			// modify the newly added slide
			plugin.active.el = applyNewElCss(plugin.active.el);
			// replace el's content with the first requested slide
			el.html(plugin.active.el);
		}
		
		// modifies the wrapper CSS (.bx-wrapper)
		var setWrapDimensions = function(){
			plugin.wrap.css({
				width: plugin.active.width,
				overflow: 'hidden',
				position: 'relative'
			});
		}
		
		// appends the pager
		var appendPager = function(){
			var pagerHtml = '';
			plugin.children.each(function(index){
			  pagerHtml += '<a href="" data-slide-index="' + index + '" class="bx-pager-link">' + (index + 1) + '</a>';
			});
			// create the pager DOM element
			plugin.pagerEl = $('<div class="bx-pager" />');
			// assign the pager click binding
			plugin.pagerEl.delegate('.bx-pager-link', 'click', clickPagerBind);
			// populate the pager element with pager links
			plugin.pagerEl.html(pagerHtml);
			// add the pager to the DOM
			plugin.wrap.after(plugin.pagerEl);
			// make the appropriate link active
			updatePagerActive(plugin.settings.startSlide);
		}
		
		// appends prev / next controls to the DOM
		var appendControls = function(){
			plugin.controls.next = $('<a class="bx-next" href="">' + plugin.settings.nextText + '</a>');
			plugin.controls.prev = $('<a class="bx-prev" href="">' + plugin.settings.prevText + '</a>');
			// add the controls to the DOM
			plugin.controls.directionEl = $('<div class="bx-controls bx-controls-direction" />');
			// bind click actions to the controls
			plugin.controls.directionEl.delegate('.bx-next', 'click', clickNextBind);
			plugin.controls.directionEl.delegate('.bx-prev', 'click', clickPrevBind);
			// add the controls to the DOM
			plugin.controls.directionEl.append(plugin.controls.prev).append(plugin.controls.next);
			// check for any updates to the controls (like hideControlOnEnd updates)
			updateDirectionControls(plugin.settings.startSlide);
			plugin.wrap.after(plugin.controls.directionEl);
		}
		
		// appends start / stop auto controls to the DOM
		var appendControlsAuto = function(){
			plugin.controls.start = $('<a class="bx-start" href="">' + plugin.settings.startText + '</a>');
			plugin.controls.stop = $('<a class="bx-stop" href="">' + plugin.settings.stopText + '</a>');
			// add the controls to the DOM
			plugin.controls.autoEl = $('<div class="bx-controls bx-controls-auto" />');
			// bind click actions to the controls
			plugin.controls.autoEl.delegate('.bx-start', 'click', clickStartBind);
			plugin.controls.autoEl.delegate('.bx-stop', 'click', clickStopBind);
			// if autoControlsCombine, insert only the "start" control
			if(plugin.settings.autoControlsCombine){
				plugin.controls.autoEl.append(plugin.controls.start);
			// if autoControlsCombine is false, insert both controls
			}else{
				plugin.controls.autoEl.append(plugin.controls.start).append(plugin.controls.stop);
			}
			// add the controls to the DOM
			plugin.wrap.after(plugin.controls.autoEl);
		}
		
		/**
		 * click next binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickNextBind = function(e){
			// if auto show is running, stop it
			if (plugin.settings.auto) el.stopAuto();
			el.goToNextSlide();
			e.preventDefault();
		}
		
		/**
		 * click prev binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickPrevBind = function(e){
			// if auto show is running, stop it
			if (plugin.settings.auto) el.stopAuto();
			el.goToPrevSlide();
			e.preventDefault();
		}
		
		/**
		 * click start binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickStartBind = function(e){
			el.startAuto();
			e.preventDefault();
		}
		
		/**
		 * click stop binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickStopBind = function(e){
			el.stopAuto();
			e.preventDefault();
		}

		/**
		 * click pager binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickPagerBind = function(e){
			var pagerLink = $(e.currentTarget);
			var slideIndex = parseInt(pagerLink.attr('data-slide-index'));
			// if clicked pager link is not active, continue with the goToSlide call
			if(slideIndex != plugin.active.index) el.goToSlide(slideIndex);
			e.preventDefault();
		}
		
		/**
		 * updates the pager links with an active class
		 *
		 * @param slideIndex (int) 
		 *  - index of slide to make active
		 */
		var updatePagerActive = function(slideIndex){
			plugin.pagerEl.children().removeClass('active');
			plugin.pagerEl.children().eq(slideIndex).addClass('active');
		}
		
		/**
		 * cleans up the old slide after a transition
		 *
		 * @param newEl (jQuery object) 
		 *  - the newly added element
		 *
		 * @param newIndex (int) 
		 *  - the newly added element's index
		 */
		var updateActiveSlide = function(newEl, newIndex){
			// remove the old active el
			plugin.active.el.remove();
			// assign the new active el
			plugin.active.el = newEl;
			// assign the new active index (zero-based)
			plugin.active.index = newIndex;
			// declare that the transition is complete
			plugin.working = false;
		}
		
		/**
		 * updates the auto controls state (either active, or combined switch)
		 *
		 * @param state (string) "start", "stop"
		 *  - the new state of the auto show
		 */
		var updateAutoControls = function(state){
			// if autoControlsCombine is true, replace the current control with the new state 
			if(plugin.settings.autoControlsCombine){
				plugin.controls.autoEl.html(plugin.controls[state]);
			// if autoControlsCombine is false, apply the "active" class to the appropriate control 
			}else{
				plugin.controls.autoEl.children().removeClass('active');
				plugin.controls.autoEl.find(':not(.bx-' + state + ')').addClass('active');
			}
		}
		
		/**
		 * updates the direction controls (checks if either should be hidden)
		 *
		 * @param slideIndex (int) 
		 *  - index of the newly requested slide
		 */
		var updateDirectionControls = function(slideIndex){
			// if infiniteLoop is false and hideControlOnEnd is true
			if(!plugin.settings.infiniteLoop && plugin.settings.hideControlOnEnd){
				// clear the contents of the controls
				plugin.controls.directionEl.empty();
				// if first slide
				if (slideIndex == 0){
					plugin.controls.directionEl.append(plugin.controls.next);
				// if last slide
				}else if(slideIndex == plugin.children.length - 1){
					plugin.controls.directionEl.append(plugin.controls.prev);
				// if any slide in the middle
				}else{
					plugin.controls.directionEl.append(plugin.controls.prev, plugin.controls.next);
				}
			}
		}
		
		/**
		 * modifies newly added slide's CSS
		 *
		 * @param newEl (jQuery object) 
		 *  - the newly added element
		 */
		var applyNewElCss = function(newEl){
			newEl.css({
				float: 'left',
				width: plugin.active.width,
				listStyle: 'none'
			});
			return newEl;
		}
		
		// initialzes the auto process
		var initAuto = function(){
			// if autoDelay was supplied, launch the auto show using a setTimeout() call
			if(plugin.settings.autoDelay > 0){
				var timeout = setTimeout(el.startAuto, plugin.settings.autoDelay);
			// if autoDelay was not supplied, start the auto show normally
			}else{
				el.startAuto();
			}
			// if autoHover is requested
			if(plugin.settings.autoHover){
				// on el hover
				el.hover(function(){
					// if the auto show is currently playing (has an active interval)
					if(plugin.interval){
						// stop the auto show and pass true agument which will prevent control update
						el.stopAuto(true);
						// create a new autoPaused value which will be used by the relative "mouseout" event
						plugin.autoPaused = true;
					}
				}, function(){
					// if the autoPaused value was created be the prior "mouseover" event
					if(plugin.autoPaused){
						// start the auto show and pass true agument which will prevent control update
						el.startAuto(true);
						// reset the autoPaused value
						plugin.autoPaused = null;
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
		 * perform slide transition to the specified slide
		 *
		 * @param slideIndex (int) 
		 *  - the destination slide's index (zero-based)
		 *
		 * @param direction (string) "next", "prev"
		 *  - direction of travel to arrive at destination slide
		 */
		el.goToSlide = function(slideIndex, direction) {
			// if plugin is currently in motion, ignore request
			if(plugin.working) return;
			// declare that plugin is in motion
			plugin.working = true;
			// clone the newly requested slide
			var newSlide = plugin.children.eq(slideIndex).clone();
			// apply CSS to the newly requested slide
			newSlide = applyNewElCss(newSlide);
			// update the pager with active class
			updatePagerActive(slideIndex);
			// check for direction control update
			updateDirectionControls(slideIndex);
			
			// if slider is set to mode: "fade"
			if(plugin.settings.mode == 'fade'){
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
				plugin.active.el.fadeOut(plugin.settings.speed);
				// fade in the newly requested slide (same time as currently active slide)
				newSlide.fadeIn(plugin.settings.speed, function(){
					// after fade transitions, change position from "absolute" to "relative"
					$(this).css('position', 'relative');
					// perform the update actions on the newly requested slide
					updateActiveSlide(newSlide, slideIndex);
				});
			
			// if slider is not set to mode: "fade"
			}else{
				
				// determine direction of travel to destination slide
				if(typeof direction == 'undefined'){
					direction = slideIndex > plugin.active.index ? 'next' : 'prev';
				}
				
				// if direction is "next"
				if(direction == 'next'){
					// append the newly requested element to the right side of the current element
					// then animate to the left
					el.append(newSlide).animate({left: -plugin.active.width}, plugin.settings.speed, function(){
						updateActiveSlide(newSlide, slideIndex);
						// reset el's left position to zero
						el.css('left', 0);
					});
				
				// if direction is "prev"
				}else if(direction == 'prev'){
					// prepend the newly requested element to the left side of the current element
					// then animate to the right
					el.prepend(newSlide).css('left', -plugin.active.width).animate({left: 0}, plugin.settings.speed, function(){
						updateActiveSlide(newSlide, slideIndex);
					});
				}
				
			}
			
		}
		
		// transitions to the next slide in the show
		el.goToNextSlide = function(){
			// if infiniteLoop is false and slideIndex + 1 is the last slide, disregard call
			if (!plugin.settings.infiniteLoop && plugin.active.index + 1 == plugin.children.length) return;
			// if the next slide index is greater than the number of total slide, use zero
			// if not, use active index + 1
			var nextIndex = plugin.active.index + 1 == plugin.children.length ? 0 : plugin.active.index + 1;
			el.goToSlide(nextIndex, 'next');
		}
		
		// transitions to the prev slide in the show
		el.goToPrevSlide = function(){
			// if infiniteLoop is false and slideIndex - 1 is the first slide, disregard call
			if (!plugin.settings.infiniteLoop && plugin.active.index - 1 < 0) return;
			// if the prev slide index is less than zero, use the last index
			// if not, use active index - 1
			var prevIndex = plugin.active.index - 1 < 0 ? plugin.children.length - 1 : plugin.active.index - 1;
			el.goToSlide(prevIndex, 'prev');
		}
		
		/**
		 * starts the auto show
		 *
		 * @param preventControlUpdate (boolean) 
		 *  - if true, auto controls state will not be updated
		 */
		el.startAuto = function(preventControlUpdate){
			// if an interval already exists, disregard call
			if(plugin.interval) return;
			// create an interval
			plugin.interval = setInterval(function(){
				plugin.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
			}, plugin.settings.delay);
			// if auto controls are displayed and preventControlUpdate is not true
			if (plugin.settings.autoControls && preventControlUpdate != true) updateAutoControls('stop');
		}
		
		/**
		 * stops the auto show
		 *
		 * @param preventControlUpdate (boolean) 
		 *  - if true, auto controls state will not be updated
		 */
		el.stopAuto = function(preventControlUpdate){
			// if no interval exists, disregard call
			if(!plugin.interval) return;
			// clear the interval
			clearInterval(plugin.interval);
			plugin.interval = null;
			// if auto controls are displayed and preventControlUpdate is not true
			if (plugin.settings.autoControls && preventControlUpdate != true) updateAutoControls('start');
		}
		
		// makes slideshow responsive
		// on window resize, update the slider widths
		$(window).resize(function(){
			plugin.active.width = plugin.parent.width();
			plugin.wrap.width(plugin.active.width);
			el.children().width(plugin.active.width);
		});
		
		// initialize the show
		init();
		
		// returns the current jQuery object
		return this;

	}

})(jQuery);