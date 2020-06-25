'use strict';

var gulp = require('gulp');
var gulpwatch = require('gulp-watch');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var terser = require('gulp-terser');
var concat = require('gulp-concat');
var inlinesource = require('gulp-inline-source');
var imagemin = require('gulp-imagemin');
var workboxBuild = require('workbox-build');


//Watch for 'Ctrl + C' on Windows and end gulp process
if (process.platform === "win32") {
  require("readline")
    .createInterface({
      input: process.stdin,
      output: process.stdout
    })
    .on("SIGINT", function() {
      process.emit("SIGINT");
    });
}
process.on("SIGINT", function() {
  process.exit();
});

// Start CSS tasks
gulp.task('css-tasks', done => {
  gulp.src('src/sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      // browsers: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
      cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('css/'))
  done();
});
// End CSS tasks

// Start JS tasks
gulp.task('js-scripts', done => {
  gulp.src('src/js/**/*.js')
    .pipe(concat('all-js-min.js'))
    .pipe(terser())
    .pipe(gulp.dest('js/'))
  done();
});
// End JS tasks


//Start inline CSS and JS
gulp.task('inlinesource', done => {
  return gulp.src('src/**/*.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('./'));
  done();
});
//End inline CSS and JS



// Start image minify task
gulp.task('image-minify', () =>
  gulp.src('src/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({
      interlaced: true
    }),
    imagemin.jpegtran({
      progressive: true
    }),
    imagemin.optipng({
      optimizationLevel: 5
    }),
  ]))
  .pipe(gulp.dest('images/'))
);
// End  image minify task

// Start service worker precache
gulp.task('service-worker', () => {
  return workboxBuild.generateSW({
    globDirectory: './',
    globPatterns: [
      '**/*.{html,json,js,css,jpg,svg,eot,ttf,woff,woff2}',
    ],
    swDest: './sw.js',
  });
});
// End service worker precache

// Start watch task
gulp.task('default', done => {
  gulp.watch('src/js/*.js', gulp.series('js-scripts'));
  gulp.watch('src/sass/**/*.scss', gulp.series('css-tasks'));
  gulp.watch('src/images/**/*.*', gulp.series('image-minify'));
  gulp.watch('src/*.html', gulp.series('inlinesource'));
  done();
});
