/**
 * Created by sonste on 03.10.2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var babel = require('babel-core/register');


gulp.task('mocha_unit', function() {
    return gulp.src(['test/unit/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('mocha_integration', function() {
    return gulp.src(['test/integration/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['src/js/**', 'src/test/**'], ['mocha']);
});