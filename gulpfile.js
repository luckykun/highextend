var gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    open = require('gulp-open'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat');

//server
gulp.task('connect', function() {
    connect.server({
        root: ['demo', 'src', 'mock/data'],
        port: 3010,
        livereload: true,
        middleware: function(connect, opt) {
            return [
                require('./server/route')()
            ]
        }
    });
});

//livereload
gulp.task('html', function() {
    gulp.src('./demo/**/*.html')
        .pipe(connect.reload());
});

gulp.task('js', function() {
    gulp.src('./src/**/*')
        .pipe(connect.reload());
});
//auto open
gulp.task('open', function() {
    gulp.src(__filename)
        .pipe(open({
            uri: 'http://localhost:3010'
        }));
});
//JS压缩
gulp.task('uglify', function() {
    return gulp.src('./src/js/yd-config.js')
        .pipe(uglify())
        .pipe(concat('highextend.js'))
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(gulp.dest('./build/js'));
});

//CSS压缩
gulp.task('cssmin', ['less'], function() {
    return gulp.src('./src/**/*.css')
        .pipe(cssmin())
        .pipe(rename({
            suffix: '-min'
        }))
        .pipe(gulp.dest('./build'));
});

//LESS->CSS
gulp.task('less', function() {
    return gulp.src('./src/**/*.less')
        .pipe(less())
        .pipe(gulp.dest('./src'))
        .pipe(connect.reload());
});

//图片压缩
gulp.task('images', function() {
    gulp.src('./src/image/**/*')
        .pipe(imagemin({
            progressive: false
        }))
        .pipe(gulp.dest('./build/image'));
});

//文件监听 LESS->CSS
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(['./src/**/*.less'], ['less'])
    gulp.watch(['./demo/**/*.html'], ['html'])
    gulp.watch(['./src/**/*'], ['js'])
})

//清除
gulp.task('clean', function() {
    del.sync(['./build'], {
        force: true
    }); //同步执行
});


// gulp.task('copy', function() {
//     gulp.src(['./src/js/yd-config.js'])
//         .pipe(gulp.dest('./build'));
// });

gulp.task('default', ['connect', 'watch', 'open']);
gulp.task('build', gulpSequence('clean', ['uglify', 'cssmin', 'images']));
