
'use strict';

var gulp = require('gulp');
var gulpwatch = require('gulp-watch');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var terser = require('gulp-terser');
var concat = require('gulp-concat');

//Watch for 'Ctrl + C' on Windows and end gulp process
if (process.platform === "win32") {
  require("readline")
    .createInterface({
      input: process.stdin,
      output: process.stdout
    })
    .on("SIGINT", function () {
      process.emit("SIGINT");
    });
}
process.on("SIGINT", function () {
  process.exit();
});

// Start CSS tasks
gulp.task('css-tasks', done => {
	gulp.src('sass/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'],
			cascade: false
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('./'))

	.pipe(gulp.dest('stylesheets/'))
  done();
});
// End CSS tasks

// Start JS tasks
gulp.task('js-scripts', done => {
  gulp.src([
    'js/jquery-3.3.1.min.js',
    'js/test.js'
  ])
    .pipe(concat('all-min.js'))
    .pipe(terser())
    .pipe(gulp.dest('js/dist'));
    done();
});
// End JS tasks

// Start watch task
gulp.task('default', done => {
  gulp.watch('js/*.js', gulp.series('js-scripts'));
  gulp.watch('sass/**/*.scss', gulp.series('css-tasks'));
  done();
});
gulpfile.js
Displaying gulpfile.js.
