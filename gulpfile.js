/**
 * Created by sonste on 03.10.2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var babel = require('babel-core/register');


gulp.task('mocha', function() {
    return gulp.src(['test/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('mocha-specific', function() {
    return gulp.src(['test/background/metaServiceTest.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('mocha-message-bus', function() {
    return gulp.src(['test/messageBus.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['src/js/**', 'src/test/**'], ['mocha']);
});