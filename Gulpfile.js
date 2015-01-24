var gulp         = require( 'gulp' )
  , uglify       = require( 'gulp-uglify' )
  , umd          = require( 'gulp-wrap-umd' )
  , rename       = require( 'gulp-rename' )
  , less         = require( 'gulp-less' )
  , path         = require( 'path' )
  , lessCleanCSS = require( 'less-plugin-clean-css' )
  , jshint       = require( 'gulp-jshint' )
  , livereload   = require( 'gulp-livereload' )
  , gutil        = require('gulp-util');

var cleancss     = new lessCleanCSS( {advanced: true} );

gulp.task( 'copyAssets', function() {

  gulp.src( 'src/images/*' )
    .pipe( gulp.dest( 'dist/images' ) )
})

gulp.task( 'buildJS', function() {

  gulp.src( 'src/jquery.bxslider.js')
    .pipe( jshint() )
    .pipe( jshint.reporter('jshint-stylish') )
    .pipe( uglify().on('error', gutil.log) )
    .pipe( rename( 'jquery.bxslider.min.js' ) )
    .pipe( gulp.dest( 'dist' ) );
});

gulp.task( 'buildCSS', function () {

  gulp.src( 'src/less/*.less')
    .pipe( less() )
    .pipe( gulp.dest('dist') );
});

gulp.task( 'default', function() {

  livereload.listen()
  gulp.watch( [ 'docs/*.html', 'docs/examples/*.html', 'src/*.js' ] ).on( 'change', livereload.changed )
})

gulp.task( 'build', [ 'buildJS', 'buildCSS', 'copyAssets' ] )