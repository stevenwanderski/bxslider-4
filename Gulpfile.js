// ## Globals
/*global $:true*/
var $        = require('gulp-load-plugins')();
var gulp     = require('gulp');

// ### Styles
// `gulp styles` - compiles and optimizes css.
gulp.task('styles', function() {
  return gulp.src('./src/less/*.less')
    .pipe($.less())
    .pipe($.pleeease({
      autoprefixer: {
        browsers: [
          'last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4',
          'opera 12'
        ]
      },
      minifier: false
    }))
    .pipe(gulp.dest('./dist/'));
});

// ### Scripts
// `gulp scripts` - runs jshint and uglify
gulp.task('scripts', ['jshint'], function() {
  return gulp.src('./src/js/*.js')
    .pipe(gulp.dest('./dist/'))
    .pipe($.uglify({ 
      preserveComments: function (node, comment) {
        if (/^\*\*/.test(comment.value) && /\*\*$/.test(comment.value)) {

          console.log('Found tri-star comment. Preserving.');
          return true;
        }
      } 
    }))
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest('./dist/'));
});

// ### Vendor Scripts
// `gulp vendor` - runs uglify on 3rd party plugins
gulp.task('vendor', function() {
  return gulp.src('./src/vendor/*.js')
    .pipe(gulp.dest('./dist/vendor'));
});

// ### Images
// `gulp images` - run lossless compression on all the images.
gulp.task('images', function() {
  return gulp.src('./src/images/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist/images'));
});

// ### JsHint
// `gulp jshint` - lints configuration JSON and project javascript
gulp.task('jshint', function() {
  return gulp.src([ 'bower.json', 'gulpfile.js', './src/*.js' ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

// ### Clean
// `gulp clean` - deletes the build folder entirely
gulp.task('clean', require('del').bind(null, ['dist/']));

// ### Build
// `gulp build` - Run all the build tasks but don't clean up beforehand.
// Generally you should be running `gulp` instead of `gulp build`.
gulp.task('build', ['styles', 'scripts', 'images', 'vendor']);


// ### Gulp
// `gulp` - Run a complete build. To compile for production run `gulp --production`.
gulp.task('default', ['clean'], function() {
  gulp.start('build');
});