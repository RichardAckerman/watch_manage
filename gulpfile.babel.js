'use strict';
import gulp from 'gulp';
import sass from 'gulp-ruby-sass';
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import concat from 'gulp-concat';
import miniCss from 'gulp-clean-css';
import rename from 'gulp-rename';
import notify from 'gulp-notify';
import imageMin from 'gulp-imagemin';
import jsMin from 'gulp-uglify';
// import htmlMin from 'gulp-htmlmin';
import babel from 'gulp-babel';

const dist = {
    root: "app/dist",
    css: "app/dist/css",
    js: "app/dist/js",
    images: "app/dist/images",
    main: "app/dist/main",
    html: "app/dist/html"
};

const path = {
    root: "app",
    components: "app/bower_components",
    assets: "app/assets"
};

gulp.task('clean', function () {
    return gulp.src([dist.root], {read: false}).pipe(clean({force: true}))
});

gulp.task('sass', function () {
    return sass(path.root + "/**/*.scss")
        .on('error', sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'iOS >= 7', 'Chrome >= 42', 'Firefox >= 40', 'Android >= 4.0']
        }))
        .pipe(gulp.dest(dist.css));
});

gulp.task('min-css', ['sass'], function () {
    return gulp.src(dist.css + "/**/*.css")
        .pipe(concat('main.css'))
        .pipe(gulp.dest(dist.main))
        .pipe(rename({suffix: '.min'}))
        .pipe(miniCss())
        .pipe(gulp.dest(dist.main))
        .pipe(notify({message: 'min-css task is success'}))
});

gulp.task('watchScss', function () {
    return gulp.watch(path.root + "/**/*.scss",['min-css']);// 监听的文件
});

gulp.task('min-image', function () {
    return gulp.src(path.assets + "/images/*.{png,jpg,gif,ico}")
        .pipe(imageMin())
        .pipe(gulp.dest(dist.images))
});

gulp.task('js', function () {
    return gulp.src([path.root + "/**/*.js",
        "!" + path.root + "/bower_components/**/*.js",
        "!" + dist.root + "/**/*.js",
        "!" + path.root + "/components/version/interpolate-filter_test.js",
        "!" + path.root + "/components/version/version-directive_test.js",
        "!" + path.root + "/components/version/version_test.js"])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(dist.js));
});

gulp.task('min-js', ['js'], function () {
    return gulp.src(dist.js + "/**/*.js")
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dist.main))
        .pipe(rename({suffix: '.min'}))
        .pipe(jsMin())
        .pipe(gulp.dest(dist.main))
        .pipe(notify({message: 'js task success'}))
});

gulp.task('build', ['clean', 'min-css', 'min-js']);
