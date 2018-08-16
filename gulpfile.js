/**
 * Created by sonste on 03.10.2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var runSequence = require('run-sequence');


gulp.task('build', function (callback) {
    runSequence(
        'bower',
        'mocha_unit',
        'mocha_integration',
        callback);
});

gulp.task('bower', function () {
    return bower({cmd: 'update'})
});

gulp.task('mocha_unit', function () {
    return gulp.src(['src/core/background/**/test/*.js', 'src/core/descriptor/test/*.js', 'src/core/redux/test/*.js'], {read: false})
        .pipe(mocha({reporter: 'list'}))
        .on('error', gutil.log);
});

gulp.task('mocha_specific', function () {
    return gulp.src(['src/core/background/movie_search/test/*.js'], {read: false})
        .pipe(mocha({reporter: 'list'}))
        .on('error', gutil.log);
});


gulp.task('mocha_integration', function () {
    return gulp.src(['**/integration_test/**/*.js'], {read: false})
        .pipe(mocha({reporter: 'list'}))
        .on('error', gutil.log);
});