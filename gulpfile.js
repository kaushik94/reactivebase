var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var dir_path = './app/';

var files = {
	css: {
		vendor: [
			'node_modules/react-select/dist/react-select.min.css',
			'node_modules/rc-slider/assets/index.css',
			'node_modules/font-awesome/css/font-awesome.min.css',
			'node_modules/react-dates/lib/css/_datepicker.css'
		],
		custom: [dir_path+'assets/css/style.css'],
		sassFile: [dir_path+'assets/styles/*.scss'],
		sassPartials: [dir_path+'assets/styles/partials/**/*.scss']
	},
	js: {
		vendor: [
			'node_modules/lodash/dist/lodash.min.js',
			'node_modules/appbase-js/browser/appbase.js'
		],
		custom: [
		]
	}
};

gulp.task('vendorcss', function() {
	return gulp.src(files.css.vendor)
		.pipe(minifyCSS())
		.pipe(concat('vendor.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('customcss', ['sass'], function() {
	return gulp.src(files.css.custom)
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('vendorjs', function() {
	return gulp.src(files.js.vendor)
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
	return gulp.src(files.css.sassFile)
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(gulp.dest(dir_path+'assets/css'));
});

gulp.task('moveCss', ['customcss'], function() {
	return gulp.src([
			'app/assets/css/bootstrap.polyfill.css',
			'app/assets/css/material.polyfill.css'
		])
		.pipe(gulp.dest('dist/css'));
});

gulp.task('moveFonts', function() {
	return gulp.src([
			'node_modules/font-awesome/fonts/*',
			'app/assets/styles/fonts/**/*'
		])
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('moveImages', function() {
	return gulp.src([dir_path+'assets/images/*'])
		.pipe(gulp.dest('dist/images'));
});

gulp.task('compact', [
	'vendorcss',
	'vendorjs',
	'moveCss',
	'moveFonts',
	'moveImages'
]);

gulp.task('watchfiles', function() {
	gulp.watch(files.css.sassFile, ['moveCss']);
});

gulp.task('watchSassPartials', function() {
	gulp.watch(files.css.sassPartials, ['moveCss']);
});

gulp.task('default', ['compact']);

gulp.task('watch', ['compact', 'watchfiles', 'watchSassPartials']);
