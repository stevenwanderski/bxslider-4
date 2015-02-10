#bxSlider 4.2.3
##The fully-loaded, responsive jQuery content slider

###Why should I use this slider?
* Fully responsive - will adapt to any device
* Horizontal, vertical, and fade modes
* Slides can contain images, video, or HTML content
* Full callback API and public methods
* Small file size, fully themed, simple to implement
* Browser support: Firefox, Chrome, Safari, iOS, Android, IE7+
* Tons of configuration options

For complete documentation, tons of examples, and a good time, visit:

[http://bxslider.com](http://bxslider.com)

Written by: Steven Wanderski - [http://stevenwanderski.com](http://stevenwanderski.com)

###License
Released under the MIT license - http://opensource.org/licenses/MIT

Let's get on with it!

##Installation

###Step 1: Link required files

First and most important, the jQuery library needs to be included (no need to download - link directly from Google). Next, download the package from this site and link the bxSlider CSS file (for the theme) and the bxSlider Javascript file.

```html
<!-- jQuery library (served from Google) -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<!-- bxSlider Javascript file -->
<script src="/js/jquery.bxslider.min.js"></script>
<!-- bxSlider CSS file -->
<link href="/lib/jquery.bxslider.css" rel="stylesheet" />
```

###Step 2: Create HTML markup

Create a `<ul class="bxslider">` element, with a `<li>` for each slide. Slides can contain images, video, or any other HTML content!

```html
<ul class="bxslider">
  <li><img src="/images/pic1.jpg" /></li>
  <li><img src="/images/pic2.jpg" /></li>
  <li><img src="/images/pic3.jpg" /></li>
  <li><img src="/images/pic4.jpg" /></li>
</ul>
```

###Step 3: Call the bxSlider

Call .bxslider() on `<ul class="bxslider">`. Note that the call must be made inside of a $(document).ready() call, or the plugin will not work!

```javascript
$(document).ready(function(){
  $('.bxslider').bxSlider();
});
```

##Configuration options

###General

**mode**
Type of transition between slides
```
default: 'horizontal'
options: 'horizontal', 'vertical', 'fade'
```

**speed**
Slide transition duration (in ms)
```
default: 500
options: integer
```

**slideMargin**
Margin between each slide
```
default: 0
options: integer
```

**startSlide**
Starting slide index (zero-based)
```
default: 0
options: integer
```

**randomStart**
Start slider on a random slide
```
default: false
options: boolean (true / false)
```

**slideSelector**
Element to use as slides (ex. <code>'div.slide'</code>).<br />Note: by default, bxSlider will use all immediate children of the slider element
```
default: ''
options: jQuery selector
```

**infiniteLoop**
If <code>true</code>, clicking "Next" while on the last slide will transition to the first slide and vice-versa
```
default: true
options: boolean (true / false)
```

**hideControlOnEnd**
If <code>true</code>, "Prev" and "Next" controls will receive a class <code>disabled</code> when slide is the first or the last<br/>Note: Only used when <code>infiniteLoop: false</code>
```
default: false
options: boolean (true / false)
```

**easing**
The type of "easing" to use during transitions. If using CSS transitions, include a value for the <code>transition-timing-function</code> property. If not using CSS transitions, you may include <code>plugins/jquery.easing.1.3.js</code> for many options.<br />See <a href="http://gsgd.co.uk/sandbox/jquery/easing/" target="_blank">http://gsgd.co.uk/sandbox/jquery/easing/</a> for more info.
```
default: null
options: if using CSS: 'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier(n,n,n,n)'. If not using CSS: 'swing', 'linear' (see the above file for more options)
```

**captions**
Include image captions. Captions are derived from the image's <code>title</code> attribute
```
default: false
options: boolean (true / false)
```

**ticker**
Use slider in ticker mode (similar to a news ticker)
```
default: false
options: boolean (true / false)
```

**tickerHover**
Ticker will pause when mouse hovers over slider. Note: this functionality does NOT work if using CSS transitions!
```
default: false
options: boolean (true / false)
```

**adaptiveHeight**
Dynamically adjust slider height based on each slide's height
```
default: false
options: boolean (true / false)
```

**adaptiveHeightSpeed**
Slide height transition duration (in ms). Note: only used if <code>adaptiveHeight: true</code>
```
default: 500
options: integer
```

**video**
If any slides contain video, set this to <code>true</code>. Also, include <code>plugins/jquery.fitvids.js</code><br />See <a href="http://fitvidsjs.com/" target="_blank">http://fitvidsjs.com/</a> for more info
```
default: false
options: boolean (true / false)
```

**responsive**
Enable or disable auto resize of the slider. Useful if you need to use fixed width sliders.
```
default: true
options: boolean (true /false)
```

**useCSS**
If true, CSS transitions will be used for horizontal and vertical slide animations (this uses native hardware acceleration). If false, jQuery animate() will be used.
```
default: true
options: boolean (true / false)
```

**preloadImages**
If 'all', preloads all images before starting the slider. If 'visible', preloads only images in the initially visible slides before starting the slider (tip: use 'visible' if all slides are identical dimensions)
```
default: 'visible'
options: 'all', 'visible'
```

**touchEnabled**
If <code>true</code>, slider will allow touch swipe transitions
```
default: true
options: boolean (true / false)
```

**swipeThreshold**
Amount of pixels a touch swipe needs to exceed in order to execute a slide transition. Note: only used if <code>touchEnabled: true</code>
```
default: 50
options: integer
```

**oneToOneTouch**
If <code>true</code>, non-fade slides follow the finger as it swipes
```
default: true
options: boolean (true / false)
```

**preventDefaultSwipeX**
If <code>true</code>, touch screen will not move along the x-axis as the finger swipes
```
default: true
options: boolean (true / false)
```

**preventDefaultSwipeY**
If <code>true</code>, touch screen will not move along the y-axis as the finger swipes
```
default: false
options: boolean (true / false)
```

**wrapperClass**
Class to wrap the slider in. Change to prevent from using default bxSlider styles.
```
default: 'bx-wrapper'
options: string
```

###Pager

**pager**
If <code>true</code>, a pager will be added
```
default: true
options: boolean (true / false)
```

**pagerType**
If <code>'full'</code>, a pager link will be generated for each slide. If <code>'short'</code>, a x / y pager will be used (ex. 1 / 5)
```
default: 'full'
options: 'full', 'short'
```

**pagerShortSeparator**
If <code>pagerType: 'short'</code>, pager will use this value as the separating character
```
default: ' / '
options: string
```

**pagerSelector**
Element used to populate the populate the pager. By default, the pager is appended to the bx-viewport
```
default: ''
options: jQuery selector
```

**pagerCustom**
Parent element to be used as the pager. Parent element must contain a <code>&lt;a data-slide-index="x"&gt;</code> element for each slide. See example <a href="/examples/thumbnail-method-1">here</a>. Not for use with dynamic carousels.
```
default: null
options: jQuery selector
```

**buildPager**
If supplied, function is called on every slide element, and the returned value is used as the pager item markup.<br />See <a href="http://bxslider.com/examples">examples</a> for detailed implementation
```
default: null
options: function(slideIndex)
```

###Controls

**controls**
If <code>true</code>, "Next" / "Prev" controls will be added
```
default: true
options: boolean (true / false)
```

**nextText**
Text to be used for the "Next" control
```
default: 'Next'
options: string
```

**prevText**
Text to be used for the "Prev" control
```
default: 'Prev'
options: string
```

**nextSelector**
Element used to populate the "Next" control
```
default: null
options: jQuery selector
```

**prevSelector**
Element used to populate the "Prev" control
```
default: null
options: jQuery selector
```

**autoControls**
If <code>true</code>, "Start" / "Stop" controls will be added
```
default: false
options: boolean (true / false)
```

**startText**
Text to be used for the "Start" control
```
default: 'Start'
options: string
```

**stopText**
Text to be used for the "Stop" control
```
default: 'Stop'
options: string
```

**autoControlsCombine**
When slideshow is playing only "Stop" control is displayed and vice-versa
```
default: false
options: boolean (true / false)
```

**autoControlsSelector**
Element used to populate the auto controls
```
default: null
options: jQuery selector
```

**keyboardEnabled**
Enable keyboard navigation for visible sliders
```
default: false
options: boolean (true / false)
```

###Auto

**auto**
Slides will automatically transition
```
default: false
options: boolean (true / false)
```

**pause**
The amount of time (in ms) between each auto transition
```
default: 4000
options: integer
```

**autoStart**
Auto show starts playing on load. If <code>false</code>, slideshow will start when the "Start" control is clicked
```
default: true
options: boolean (true / false)
```

**autoDirection**
The direction of auto show slide transitions
```
default: 'next'
options: 'next', 'prev'
```

**autoHover**
Auto show will pause when mouse hovers over slider
```
default: false
options: boolean (true / false)
```

**autoDelay**
Time (in ms) auto show should wait before starting
```
default: 0
options: integer
```

###Carousel

**minSlides**
The minimum number of slides to be shown. Slides will be sized down if carousel becomes smaller than the original size.
```
default: 1
options: integer
```

**maxSlides**
The maximum number of slides to be shown. Slides will be sized up if carousel becomes larger than the original size.
```
default: 1
options: integer
```

**moveSlides**
The number of slides to move on transition. This value must be <code>>= minSlides</code>, and <code><= maxSlides</code>. If zero (default), the number of fully-visible slides will be used.
```
default: 0
options: integer
```

**slideWidth**
The width of each slide. This setting is required for all horizontal carousels!
```
default: 0
options: integer
```

###Callbacks

**onSliderLoad**
Executes immediately after the slider is fully loaded
```
default: function(){}
options: function(currentIndex){ // your code here }
arguments:
  currentIndex: element index of the current slide
```

**onSliderResize**
Executes immediately after the slider is resized
```
default: function(){}
options: function(currentIndex){ // your code here }
arguments:
  currentIndex: element index of the current slide
```

**onSlideBefore**
Executes immediately before each slide transition.
```
default: function(){}
options: function($slideElement, oldIndex, newIndex){ // your code here }
arguments:
  $slideElement: jQuery element of the destination element
  oldIndex: element index of the previous slide (before the transition)
  newIndex: element index of the destination slide (after the transition)
```

**onSlideAfter**
Executes immediately after each slide transition. Function argument is the current slide element (when transition completes).
```
default: function(){}
options: function($slideElement, oldIndex, newIndex){ // your code here }
arguments:
  $slideElement: jQuery element of the destination element
  oldIndex: element index of the previous slide (before the transition)
  newIndex: element index of the destination slide (after the transition)
```

**onSlideNext**
Executes immediately before each "Next" slide transition. Function argument is the target (next) slide element.
```
default: function(){}
options: function($slideElement, oldIndex, newIndex){ // your code here }
arguments:
  $slideElement: jQuery element of the destination element
  oldIndex: element index of the previous slide (before the transition)
  newIndex: element index of the destination slide (after the transition)
```

**onSlidePrev**
Executes immediately before each "Prev" slide transition. Function argument is the target (prev) slide element.
```
default: function(){}
options: function($slideElement, oldIndex, newIndex){ // your code here }
arguments:
  $slideElement: jQuery element of the destination element
  oldIndex: element index of the previous slide (before the transition)
  newIndex: element index of the destination slide (after the transition)
```

###Public methods

**goToSlide**
Performs a slide transition to the supplied slide index (zero-based)
```
example:
slider = $('.bxslider').bxSlider();
slider.goToSlide(3);
```

**goToNextSlide**
Performs a "Next" slide transition
```
example:
slider = $('.bxslider').bxSlider();
slider.goToNextSlide();
```

**goToPrevSlide**
Performs a "Prev" slide transition
```
example:
slider = $('.bxslider').bxSlider();
slider.goToPrevSlide();
```

**startAuto**
Starts the auto show. Provide an argument <code>false</code> to prevent the auto controls from being updated.
```
example:
slider = $('.bxslider').bxSlider();
slider.startAuto();
```

**stopAuto**
Stops the auto show. Provide an argument <code>false</code> to prevent the auto controls from being updated.
```
example:
slider = $('.bxslider').bxSlider();
slider.stopAuto();
```

**getCurrentSlide**
Returns the current active slide
```
example:
slider = $('.bxslider').bxSlider();
var current = slider.getCurrentSlide();
```

**getSlideCount**
Returns the total number of slides in the slider
```
example:
slider = $('.bxslider').bxSlider();
var slideQty = slider.getSlideCount();
```

**reloadSlider**
Reload the slider. Useful when adding slides on the fly. Accepts an optional settings object. <a href="/examples/reload-slider-settings">See here for an example.</a>
```
example:
slider = $('.bxslider').bxSlider();
slider.reloadSlider();
```

**destroySlider**
Destroy the slider. This reverts all slider elements back to their original state (before calling the slider).
```
example:
slider = $('.bxslider').bxSlider();
slider.destroySlider();
```

## Changelog

### Version 4.2.3
* Minor bug fix

### Version 4.2.2
* Fix: Remove unused plugin variable (#733)
* Fix: `updateAfterSlideTransition` not being called (#704)
* Fix: Slider stops auto advancing (#702)
* Fix: Refresh page, slider show the last item at the first in mode: 'horizontal' (#694)
* Fix: horizintal ticker stutters on loop (#669)
* Fix: Wrong bx-wrapper bottom margin with controls=true and pager=false (#647)
* Fix: add css tickerHover. (#629)
* Fix: Slider refusing to scale down, only up (#611)
* Fix: bxSlider freezes on touch devices (#540)
* Fix: Multiple fixes and improvements for Windows Mobile Devices (#596)
* Fix: Accessing bxslider's slider object inside its “onSliderLoad” callback returns undefined (#475)
* Fix: infiniteLoop glitch when scrolling from first to last slide (#429)
* Enhancement: Cancel transitions on callbacks by returning false. (#411)
* Enhancement: Added Keyboard arrow left and right support (#239)

### Version 4.2.1
* Fix: Merge Conflict in dist
* Fix: modified bower.json

### Version 4.2.0
* Fix: Reverse #714, fixes #722.
* Fix: Repo Tag #729
* Fix: #720 pagerCustom issues

4.2.0 Introduces a streamlined build process using [gulp](www.gulpjs.com). Along with this new build process the projects folder structure has been changed. You will find a `dist` folder with all assets ready to use, including both minified and unminified versions of the javascript. These assets should be ready to go. In `src` you will find the uncompiled assets, including a new less version of the css for bxslider. This is an important step for bxslider. It will help speed development up and keep work clean. It also paves the way for a big revamp we have planned in the future.

**Unfamiliar with npm? Don't have node installed?** [Download and install node.js](http://nodejs.org/download/) before proceeding.

From the command line:

1. Install [gulp](http://gulpjs.com) globally with `npm install -g gulp`
2. Navigate to the project directory, then run `npm install`

You now have all the necessary dependencies to run the build process.

### Available gulp commands

* `gulp` — Compile and optimize all files to `dist`
* `gulp styles` — Compile css assets only to `dist`
* `gulp scripts` — Compile js assets only to `dist`
* `gulp images` - Run lossless compression on all the images and copy to `dist`
* `gulp jshint` — Checks JS and JSON code for errors based on our .jshintrc settings


### Version 4.1.3
* Fix: responsive issue for horizontal mode for issue #611, #714
* Fix: extra space on the left when using fade mode. #715
* Fix: wrongly removing custom pager in destroySlider #610
* Fix: bug with reloading slider with custom pager #545
* Fix: Issue with infinite scroll sometimes returning to 0 #481
* Fix: When "infiniteLoop" is used, true is not passed to a clone method. #346
* Fix: "pagerCustom" won't work when using reloadSlider #171
* Fix: Remove vendor prefix for translateZ(0) #565
* Fix: give styles on focus for accessibility #228
* Fix: Minified Version out of sync.
* Fix: Remove -5px left #517
* Enhancement: Invert order call of appendControls() and appendPager() #226
* Enhancement: Various Indentation and typos in docs fixed. #551, #578
* Enhancement: Update jsDelivr with update.json for autoupdate of CDN
* Enhancement: Tag Repo so it can be included in CDNJS
* Created development branch to work from. Eventually will restructure entire repo to follow best practice setup.


### Version 4.1.2
* Added `bower.json` configuration file. Manage bxSlider as a dependency using [bower](http://bower.io/).

### Version 4.1.1
* Removed imagesLoaded library and added iframe preloading support
* Added responsive option - setting to false will prevent $(window).resize binding

### Version 4.1
* Carousel mode (minSlides / maxSlides) was re-written to be more intuitive.
* SlideWidth now acts as it should (slides respect the width value).
* SlideWidth now properly parsed: accepts string ("600px") or integer (600).
* Slider now only needs to load visible slides (by default) in order to initialize which results in much faster loading. A "preloadImages" setting allows for configuration.


Long live Zep.