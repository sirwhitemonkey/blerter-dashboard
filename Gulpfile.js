var webPath = __dirname;
var tinylr;

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    helmet = require('helmet'),
    replace = require('gulp-string-replace'),
    argv = require('yargs').argv;


gulp.task('replace-host', function () {
    var host = (argv.source === undefined) ? '' : argv.source;
    var type = (argv.type === undefined) ? '' : argv.type;
    if (type == "grpc") {
        gulp.src(["swagger/grpc.json"])
            .pipe(replace('SOURCE-URL', host))
            .pipe(gulp.dest('app/swagger'))
    } else {
        gulp.src(["swagger/rest.json"])
            .pipe(replace('SOURCE-URL', host))
            .pipe(gulp.dest('app/swagger'))
    }

});

gulp.task('copy-bowercomponents-css', function() {
    var sourceFiles = [ 'bower_components/bootstrap/dist/css/bootstrap.min.css',
        'bower_components/angular-material/angular-material.css',
        'bower_components/angular-swagger-ui/dist/css/swagger-ui.min.css',
        'bower_components/angular-material-expansion-panel/dist/md-expansion-panel.min.css'];
    return gulp.src(sourceFiles)
        .pipe(gulp.dest('app/styles/css'));
});

gulp.task('copy-bowercomponents-libs', function() {
    var sourceFiles = [ 'bower_components/angular/angular.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-material/angular-material.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-material-expansion-panel/dist/md-expansion-panel.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/lodash/dist/lodash.min.js',
        'bower_components/moment/min/moment.min.js',
        'bower_components/angular-swagger-ui/dist/scripts/swagger-ui.js'];
    return gulp.src(sourceFiles)
        .pipe(gulp.dest('app/scripts'));
});

gulp.task('copy-app-scripts', function() {
    var sourceFiles = [ 'package.json', 'server.js' ];
    return gulp.src(sourceFiles)
        .pipe(gulp.dest('docker/connector'));
});

gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

gulp.task('watch', function() {
    gulp.watch('app/styles/sass/**/*.scss', ['styles']);
    gulp.watch('app/**/.html', notifyLiveReload);
    gulp.watch('app/styles/css/**/*.css', notifyLiveReload);
    gulp.watch('app/src/**/*.js', notifyLiveReload);
});

gulp.task('styles', function() {
    return sass('app/styles/sass', { style: 'expanded' })
        .pipe(gulp.dest('app/styles/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('app/styles/css'));
});

gulp.task('express', function() {
    var express = require('express');
    var app = express();
    app.use(helmet.frameguard());
    app.use(require('connect-livereload')({port: 35729}));
    app.use(express.static(webPath + '/app'));
    app.listen(7000, '0.0.0.0');
});

gulp.task('monitor', ['copy-bowercomponents-css', 'copy-bowercomponents-libs', 'styles', 'express', 'livereload','watch'], function() {

});


function notifyLiveReload(event) {
    var fileName = require('path').relative(webPath, event.path);

    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}




