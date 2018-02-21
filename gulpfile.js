var gulp           = require('gulp'),
    gutil          = require('gulp-util' ),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    concat         = require('gulp-concat'),
    uglify         = require('gulp-uglify'),
    cleanCSS       = require('gulp-clean-css'),
    rename         = require('gulp-rename'),
    del            = require('del'),
    imagemin       = require('gulp-imagemin'),
    cache          = require('gulp-cache'),
    autoprefixer   = require('gulp-autoprefixer'),
    ftp            = require('vinyl-ftp'),
    notify         = require("gulp-notify"),
    rsync          = require('gulp-rsync');

// Скрипты проекта

gulp.task('main-js', function() {
    return gulp.src([
        'app/js/main.js',     
    ])
    .pipe(concat('main.min.js'))
    // .pipe(uglify()) // Минифицирует js
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('libs-js', function() {
    return gulp.src([
        'app/libs/jquery/jquery.js',
        'app/libs/owl.carousel/owl.carousel.js',        
        'app/libs/slick-carousel/slick.js',
        'app/libs/jquery.maskedinput/jquery.maskedinput.js'
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify()) // Минимизировать весь js (на выбор)
    .pipe(gulp.dest('app/js'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        // tunnel: true,
        // tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
    });
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.+(sass|scss)')
        .pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix : ''}))
        .pipe(autoprefixer(['last 15 versions']))
        // .pipe(cleanCSS()) // Опционально, закомментировать при отладке
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'libs-js', 'main-js', 'browser-sync'], function() {
    gulp.watch('app/sass/**/*.+(sass|scss)', ['sass']);
    gulp.watch(['app/js/main.js'], ['main-js']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin()))
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'libs-js', 'main-js'], function() {

    var buildFiles = gulp.src([
        'app/*.html',
        'app/*.php',
        'app/.htaccess',
    ]).pipe(gulp.dest('dist'));

    var buildVideos = gulp.src([
        'app/videos/*'
    ]).pipe(gulp.dest('dist/videos'));

    var buildCss = gulp.src([
		'app/css/libs.min.css',
        'app/css/main.min.css',
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/libs.min.js',
        'app/js/main.min.js',
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*',
    ]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

    var conn = ftp.create({
        host:      'hostname.com',
        user:      'username',
        password:  'userpassword',
        parallel:  10,
        log: gutil.log
    });

    var globs = [
        'dist/**',
        'dist/.htaccess',
    ];

    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('/path/to/folder/on/server'));
});

gulp.task('rsync', function() {
    return gulp.src('dist/**')
        .pipe(rsync({
            root: 'dist/',
            hostname: 'username@yousite.com',
            destination: 'yousite/public_html/',
            archive: true,
            silent: false,
            compress: true
        }));
});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
