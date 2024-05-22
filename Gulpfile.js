var gulp = require('gulp')
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

gulp.task('js-minify', function (done) {
  gulp.src('./src/js/jquery.bxslider.js')
  .pipe(uglify({
    preserveComments: 'license'
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('./dist'));
  done();
});

gulp.task('js-copy-src', function (done) {
  gulp.src('./src/js/jquery.bxslider.js')
  .pipe(gulp.dest('./dist'));
  done();
});

gulp.task('css-minify', function (done) {
  gulp.src('./src/css/jquery.bxslider.css')
  .pipe(cssmin())
  .pipe(rename({ suffix: '.min' }))
  .pipe(gulp.dest('./dist'));
  done();
});

gulp.task('css-copy-src', function (done) {
  gulp.src('./src/css/jquery.bxslider.css')
  .pipe(gulp.dest('./dist'));
  done();
});

gulp.task('vendor-copy-src', function (done) {
  gulp.src('./src/vendor/*')
  .pipe(gulp.dest('./dist/vendor'));
  done();
});

gulp.task('images-copy-src', function (done) {
  gulp.src('./src/images/*')
  .pipe(gulp.dest('./dist/images'));
  done();
});

gulp.task('docs-copy-src', function (done) {
  gulp.src([
    './readme.md',
    './LICENSE.md'
  ])
  .pipe(gulp.dest('./dist'));
  done();
});

gulp.task('default', gulp.series(
  'js-minify',
  'js-copy-src',
  'css-minify',
  'css-copy-src',
  'vendor-copy-src',
  'images-copy-src',
  'docs-copy-src'
));
