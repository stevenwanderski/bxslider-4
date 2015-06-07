(function($) {

	var Docs = {
		// All pages
		common: {
			init: function() {
			}
		},
		// Home page
		home: {
			init: function() {
			// JavaScript to be fired on the Home page
				var slider = $('#demoSlider').bxSlider();
			}
		},
		// Docs page
		docs: {
			init: function() {
			// JavaScript to be fired on the Docs page
			}
		},
		// Demos page
		Basic: {
			init: function() {
				var slider = $('#demoSlider').bxSlider();
			}
		},
		Destroy: {
			init: function() {
				var slider = $('#demoSlider').bxSlider();

				$('#slider-init').click(function(){
				  slider.bxSlider();
				  return false;
				});

				$('#slider-destroy').click(function(){
				  slider.destroySlider();
				  return false;
				});
			}
		},
		Vertical: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({ 
		            mode: 'vertical',
		            slideWidth: 400,
		            minSlides: 3,
		            moveSlides: 1
				});
			}
		},
		Fade: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({mode:'fade'});
			}
		},
		Ticker: {
			init: function() {
				$('#demoSlider1').bxSlider({minSlides: 4,
				  maxSlides: 4,
				  slideWidth: 170,
				  slideMargin: 10,
				  ticker: true,
				  tickerHover: true,
				  useCSS: false,
				  speed: 6000
				});
				$('#demoSlider2').bxSlider({minSlides: 4,
				  mode: 'vertical',
				  maxSlides: 4,
				  slideWidth: 170,
				  slideMargin: 10,
				  ticker: true,
				  tickerHover: true,
				  speed: 6000
				});
			}
		},
		Captions: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({captions:true});
			}
		},
		Callbacks: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({
					onSliderLoad: function(){
						// do funky JS stuff here
						alert('Slider has finished loading. Click OK to continue!');
					},
					onSlideAfter: function(){
						// do mind-blowing JS stuff here
						alert('A slide has finished transitioning. Bravo. Click OK to continue!');
					}
				});
			}
		},
		Manual: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({
					infiniteLoop: false,
					hideControlOnEnd: true
				});
			}
		},
		Auto: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({
					auto: true,
  					autoControls: true
				});
			}
		},
		AdaptiveHeight: {
			init: function() {
				var slider = $('#demoSlider').bxSlider({
					adaptiveHeight: true,
 					mode: 'fade'
				});
			}
		},
		Carousel: {
			init: function() {
				$('.slider1').bxSlider({
					slideWidth: 200,
					minSlides: 2,
					maxSlides: 3,
					slideMargin: 10
				});
				$('.slider2').bxSlider({
					slideWidth: 300,
					minSlides: 2,
					maxSlides: 2,
					slideMargin: 10
				});
				$('.slider3').bxSlider({
					slideWidth: 2000,
					minSlides: 2,
					maxSlides: 4,
					slideMargin: 10
				});
				$('.slider4').bxSlider({
					slideWidth: 300,
					minSlides: 2,
					maxSlides: 3,
					moveSlides: 1,
					slideMargin: 10
				});
				$('.slider5').bxSlider({
					slideWidth: 300,
					minSlides: 3,
					maxSlides: 3,
					moveSlides: 3,
					slideMargin: 10
				});
				$('.slider6').bxSlider({
					slideWidth: 300,
					minSlides: 2,
					maxSlides: 3,
					startSlide: 2,
					slideMargin: 10
				});
				$('.slider7').bxSlider({
					slideWidth: 200,
					minSlides: 4,
					maxSlides: 5,
					slideMargin: 10
				});
				$('.slider8').bxSlider({
					mode: 'vertical',
					slideWidth: 300,
					minSlides: 2,
					slideMargin: 10
				});
			}
		},
		Shrink: {
			init: function() {
				$('#demoSlider1').bxSlider({
					slideWidth: 350,
					minSlides: 1,
					maxSlides: 4,
					slideMargin: 10,
					shrinkItems: true
				});
				$('#demoSlider2').bxSlider({
					slideWidth: 350,
					minSlides: 1,
					maxSlides: 4,
					slideMargin: 10,
					shrinkItems: false
				});
			}
		},
		Touch: {
			init: function() {
				$('#demoSlider').bxSlider({
					oneToOneTouch: false,
					swipeThreshold: 100
				});
			}
		},
		Pager: {
			init: function() {
				$('#demoSlider1').bxSlider({
					pagerCustom: '#bx-pager'
				});
			}
		},
	};

	// The routing fires all common scripts, followed by the page specific scripts.
	// Add additional events for more control over timing e.g. a finalize event
	var UTIL = {
	  fire: function(func, funcname, args) {
		var namespace = Docs;
		funcname = (funcname === undefined) ? 'init' : funcname;
		if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
		  namespace[func][funcname](args);
		}
	  },
	  loadEvents: function() {
		UTIL.fire('common');

		$.each(document.body.className.replace(/-/g, '_').split(/\s+/),function(i,classnm) {
		  UTIL.fire(classnm);
		});
	  }
	};

	$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.