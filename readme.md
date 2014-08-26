#bxSlider Rahisified
A custom super responsive and bootstrap friendly version of bxSlider v4.1.2

###Why should I use this version?

* Automatic slideWidth calculation for carousels
* New automatic reload option when window resizes
* New break points option
* New slides option to set min and max slides with one value
* Support for unlimited break points
* Support for data attributes
* Self calling ability

###License
Released under the same license as the original i.e MIT license - http://opensource.org/licenses/MIT

###Demo

A demonstration can be viewed here:

[http://www.arnique.net/demos/plugins/bxslider-rahisified/demo/](http://www.arnique.net/demos/plugins/bxslider-rahisified/demo/)

###Step 1: Link required files

First and most important, the jQuery library needs to be included (no need to download - link directly from Google). Next, download the package from this site and link the bxSlider CSS file (for the theme) and the bxslider-rahisified Javascript file.

```html
<!-- jQuery library (served from Google) -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
<!-- bxSlider Javascript file -->
<script src="jquery.bxslider-rahisified.js"></script>
<!-- bxSlider CSS file -->
<link href="jquery.bxslider.css" rel="stylesheet" />
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

Simply create a data attribute named data-call and set it's value to 'bxslider' and the slider will set itself up!

```html
<ul class="bxslider" data-call="bxslider">
  <li><img src="/images/pic1.jpg" /></li>
  <li><img src="/images/pic2.jpg" /></li>
  <li><img src="/images/pic3.jpg" /></li>
  <li><img src="/images/pic4.jpg" /></li>
</ul>
```

###Step 4: Set default options

Simply create a data attribute named data-options and input your options there. All configuration options are supported!

```html
<ul class="bxslider" data-call="bxslider" data-options="slideMargin:5, autoReload:true">

```
Make sure to set the new autoReload option to true if you want to the slider to dynamically adapt to screen changes.

###Step 5: Set data breaks

In the old version, responsiveness was achieved using min and max slides. In this version you can set the specific number of slides to show at defined break points. You can also set any options to be applied at the defined break points.

The break points are defined as a collection of option objects enclosed in curly brackets and contain the following:

* A new option called screen to define the minimum device width in pixels
* A new option called slides to set both the min and max slides
* Any of the old and new configuration options

Break points are set inside a data attribute called data-breaks i.e


```html
  data-breaks="[{screen:460, slides:2, pager:false, controls:true}]"

```

Multiple break points are seperated by commas. There is no limit to the number of break points you can set.


```html
  data-breaks="[{screen:0, slides:1, pager:false}, {screen:460, slides:2}, {screen: 768, slides:3}]"
```

###Step 6: Putting everything together!

This is how your slider should look once you put everything together.


```html
<ul class="bxslider" data-call="bxslider" data-options="slideMargin:5, autoReload:true" data-breaks="[{screen:0, slides:1, pager:false}, {screen:460, slides:2}, {screen: 768, slides:3}]">
  <li><img src="/images/pic1.jpg" /></li>
  <li><img src="/images/pic2.jpg" /></li>
  <li><img src="/images/pic3.jpg" /></li>
  <li><img src="/images/pic4.jpg" /></li>
</ul>
```

###Calling the slider via javascript is still supported

You can still call bxSlider the usual way if you do not like the new data attributes.

```js
    $(document).ready( function() {
    
        $('#myslider').bxSlider({
          slideMargin: 5,
          autoReload: true,
          breaks: [{screen:0, slides:1, pager:false},{screen:460, slides:2},{screen:768, slides:3}]
        });
      
    });

```

###That's it!
Now resize your browser window and see your slider obey each and every one of your set commands.

Demo >> [http://rahisify.com/demos/plugins/bxslider/demo/index.html](http://rahisify.com/demos/plugins/bxslider/demo/index.html)
