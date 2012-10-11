// jQuery Plugin Boilerplate
// A boilerplate for jumpstarting jQuery plugins development
// version 2.0, July 8th, 2011
// by Stefan Gabos

;(function($) {

	$.fn.bxSliderFlex = function(options) {

		var defaults = {
			mode: 'horizontal',
			onSomeEvent: function() {}
		}

		var el = this;
		var plugin = {}

		plugin.settings = {}

		var init = function() {
			plugin.settings = $.extend({}, defaults, options);
			plugin.children = el.children();
			plugin.parent = el.parent();
			plugin.active = {
				index: 0,
				el: plugin.children.eq(0).clone(),
				width: plugin.children.eq(0).outerWidth()
			}
			plugin.working = false;
			
			setup();
		}

		var setup = function(){
			el.wrap('<div class="bx-wrap" />');
			el.width(999999).css({position: 'relative'});
			plugin.wrap = el.parent();
			setWrapDimensions();
			appendControls();
			plugin.active.el.css({float: 'left', width: plugin.active.width});
			el.html(plugin.active.el);
		}
		
		var setWrapDimensions = function(){
			var foo = 
			plugin.wrap.css({
				width: plugin.active.width,
				overflow: 'hidden',
				position: 'relative'
			});
		}
		
		var appendControls = function(){
			plugin.controls = {
				next: $('<a class="bx-next" href="">next</a>'),
				prev: $('<a class="bx-prev" href="">prev</a>')
			}
			plugin.controls.next.bind('click', clickNextBind);
			plugin.controls.prev.bind('click', clickPrevBind);
			plugin.wrap.after(plugin.controls.prev, plugin.controls.next);
		}
		
		var clickNextBind = function(e){
			if(!plugin.working){
				plugin.working = true;
				var nextIndex = plugin.active.index + 1 == plugin.children.length ? 0 : plugin.active.index + 1;
				el.goToSlide(nextIndex, 'next');
			}
			e.preventDefault();
		}
		
		var clickPrevBind = function(e){
			if(!plugin.working){
				plugin.working = true;
				var prevIndex = plugin.active.index - 1 < 0 ? plugin.children.length - 1 : plugin.active.index - 1;
				el.goToSlide(prevIndex, 'prev');
			}
			e.preventDefault();
		}
		
		var updateActiveSlide = function(newEl, newIndex){
			plugin.active.el.remove();
			plugin.active.el = newEl;
			plugin.active.index = newIndex;
			plugin.working = false;
		}
		
		el.goToSlide = function(slideIndex, direction) {
			var newSlide = plugin.children.eq(slideIndex).clone();
			newSlide.css({float: 'left', width: plugin.active.width});
			
			if(plugin.settings.mode == 'fade'){
				
				newSlide.css({
					position: 'absolute',
					top: 0,
					left: 0,
					display: 'none'
				});
				
				el.append(newSlide);
				plugin.active.el.fadeOut(500);
				newSlide.fadeIn(500, function(){
					$(this).css('position', 'relative');
					updateActiveSlide(newSlide, slideIndex);
				});
				
			}else{
				
				if(direction == 'next'){
					el.append(newSlide).animate({left: -plugin.active.width}, 500, function(){
						updateActiveSlide(newSlide, slideIndex);
						el.css('left', 0);
					});
				}else if(direction == 'prev'){
					el.prepend(newSlide).css('left', -plugin.active.width).animate({left: 0}, 500, function(){
						updateActiveSlide(newSlide, slideIndex);
						el.css('left', 0);
					});
				}
				
			}
			
		}

		$(window).resize(function(){
			plugin.active.width = plugin.parent.width();
			plugin.wrap.width(plugin.active.width);
			el.children().width(plugin.active.width);
		});
		
		init();

	}

})(jQuery);