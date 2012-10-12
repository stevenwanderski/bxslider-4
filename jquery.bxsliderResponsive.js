// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 2.0, July 8th, 2011
// by Stefan Gabos

;(function($) {

	$.fn.bxSliderFlex = function(options) {

		var defaults = {
			mode: 'horizontal',
			speed: 500,
			delay: 2000,
			controls: true,
			auto: false,
			autoDirection: 'next',
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
			plugin.children = el.children();
			// store el's parent
			plugin.parent = el.parent();
			// store active slide information
			plugin.active = {
				index: 0,
				el: plugin.children.eq(0).clone(),
				width: plugin.children.eq(0).outerWidth()
			}
			// store the current state of the slider (if in motion, working is true)
			plugin.working = false;
			// perform all DOM modifications
			setup();
			// if auto is true, start the show
			if(plugin.settings.auto) el.startAuto();
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
		
		// appends prev / next controls to the DOM
		var appendControls = function(){
			plugin.controls = {
				next: $('<a class="bx-next" href="">next</a>'),
				prev: $('<a class="bx-prev" href="">prev</a>')
			}
			// bind click actions to the controls
			plugin.controls.next.bind('click', clickNextBind);
			plugin.controls.prev.bind('click', clickPrevBind);
			// add the controls to the DOM
			plugin.wrap.after(plugin.controls.prev, plugin.controls.next);
		}
		
		/**
		 * click next binding
		 *
		 * @param e (event) 
		 *  - DOM event object
		 */
		var clickNextBind = function(e){
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
			el.goToPrevSlide();
			e.preventDefault();
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
			// if the next slide index is greater than the number of total slide, use zero
			// if not, use active index + 1
			var nextIndex = plugin.active.index + 1 == plugin.children.length ? 0 : plugin.active.index + 1;
			el.goToSlide(nextIndex, 'next');
		}
		
		// transitions to the prev slide in the show
		el.goToPrevSlide = function(){
			// if the prev slide index is less than zero, use the last index
			// if not, use active index - 1
			var prevIndex = plugin.active.index - 1 < 0 ? plugin.children.length - 1 : plugin.active.index - 1;
			el.goToSlide(prevIndex, 'prev');
		}
		
		// starts the auto show
		el.startAuto = function(){
			// create an interval
			plugin.interval = setInterval(function(){
				plugin.settings.autoDirection == 'next' ? el.goToNextSlide() : el.goToPrevSlide();
			}, plugin.settings.delay);
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