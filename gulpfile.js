/**
 * Created by sonste on 03.10.2015.
 */
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var babel = require('babel-core/register');
var bower = require('gulp-bower');
var runSequence = require('run-sequence');
var crisper = require('gulp-crisper');
var del = require('del');
var webserver = require('gulp-webserver');


gulp.task('clean',function(callback){
    runSequence('clean-popup',callback);
});

gulp.task('build', function(callback) {
    runSequence(
        'bower-update',
        'bower-ui-test',
        'bower-end-to-end-test',
        ['cspify'], // <- in parallel
        'mocha_unit',
        'mocha_integration',
        callback);
});

gulp.task('bower-update',function(){
    return bower({cmd: 'update', cwd: './src/js' })
});


gulp.task('bower-ui-test',function(){
    return bower({cmd: 'update', cwd: './test/ui' })
});

gulp.task('bower-end-to-end-test',function(){
    return bower({ cmd: 'update', cwd: './test/end_to_end' })
});


gulp.task('cspify',function(){
    gulp.src('./src/js/bower_components/**/*.html')
        .pipe(crisper({
            scriptInHead: false
        }))
        .pipe(gulp.dest('./src/js/bower_components'));
});


gulp.task('clean-popup',function(){
    return del('./src/js/popup/bower_components',{force:true});
});


gulp.task('mocha_unit', function() {
    return gulp.src(['test/unit/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});


gulp.task('mocha_specific', function() {
    return gulp.src(['test/integration/movie_information/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});


gulp.task('mocha_integration', function() {
    return gulp.src(['test/integration/**/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list'}))
        .on('error', gutil.log);
});


gulp.task('webserver-ui', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: 'http://localhost:8000/test/ui/'
        }));
});

gulp.task('webserver-end-to-end', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            open: 'http://localhost:8000/test/end_to_end/'
        }));
});

gulp.task('watch-mocha', function() {
    gulp.watch(['src/js/**', 'src/test/**'], ['mocha']);
});