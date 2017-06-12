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
        'bower-background',
        'bower-content',
        'bower-option',
        'bower-popup',
        'bower-ui-test',
        'bower-end-to-end-test',
        ['cspify-background-components','cspify-content-components', 'cspify-option-components','cspify-popup-components'], // <- in parallel
        'mocha_unit',
        'mocha_integration',
        callback);
});

gulp.task('bower-background',function(){
    return bower({cmd: 'update', cwd: './src/js/background' })
});

gulp.task('bower-content',function(){
    return bower({cmd: 'update', cwd: './src/js/content' })
});

gulp.task('bower-option',function(){
    return bower({ cmd: 'update', cwd: './src/js/option' })
});

gulp.task('bower-popup',function(){
    return bower({cmd: 'update', cwd: './src/js/popup' })
});



gulp.task('bower-ui-test',function(){
    return bower({cmd: 'update', cwd: './test/ui' })
});

gulp.task('bower-end-to-end-test',function(){
    return bower({ cmd: 'update', cwd: './test/end_to_end' })
});


gulp.task('cspify-background-components',function(){
    gulp.src('./src/js/background/bower_components/**/*.html')
        .pipe(crisper({
            scriptInHead: false
        }))
        .pipe(gulp.dest('./src/js/option/bower_components'));
});


gulp.task('cspify-content-components',function(){
    gulp.src('./src/js/content/bower_components/**/*.html')
        .pipe(crisper({
            scriptInHead: false
        }))
        .pipe(gulp.dest('./src/js/option/bower_components'));
});

gulp.task('cspify-option-components',function(){
    gulp.src('./src/js/option/bower_components/**/*.html')
        .pipe(crisper({
            scriptInHead: false
        }))
        .pipe(gulp.dest('./src/js/option/bower_components'));
});

gulp.task('cspify-popup-components',function(){
    gulp.src('./src/js/popup/bower_components/**/*.html')
        .pipe(crisper({
            scriptInHead: false
        }))
        .pipe(gulp.dest('./src/js/popup/bower_components'));
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