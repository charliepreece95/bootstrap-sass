const gulp = require('gulp');
const browserSync  = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const concat = require('gulp-concat');

/*
    --TOP LEVEL FUNCTIONS--
    gulp.task - Define tasks
    gulp.src - Point to files to use
    gulp.public - Points to folder to output
    gulp.watch - watch files and folders for changes
*/

//logs the message
gulp.task('message', (res) => {
    console.log('Gulp is running...');
    return res();
});

//copy all the html files
gulp.task('copyhtml', (res) => {
    gulp.src('src/html/*.html')
    .pipe(gulp.dest('public/html'));
    return res();
});

//copy index html
gulp.task('copyindex', (res) => {
    gulp.src('src/*.html')
    .pipe(gulp.dest('public'));
    return res();
});

//optimize/compress images
gulp.task('imagemin', (res) => {
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('public/images'));
        return res();
});

//minify/uglify JS
gulp.task('minify', (res) => {
    gulp.src('src/js/*')
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
    return res();
});

//JS vendor files
gulp.task('js_vendor', (res) => {
    gulp.src(['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js'])
    .pipe(gulp.dest('public/js'));
    return res();
});


//complile sass
gulp.task('sass', (res) => {
    gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
    return res();
});

//concat JS script files
gulp.task('concat', (res) => {
    gulp.src('src/js/*')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
    return res();
});

//watch for changes
gulp.task('watch', (res) => {
    gulp.watch('src/html/*.html', gulp.series('copyhtml'));
    gulp.watch('src/index.html', gulp.series('copyindex'));
    gulp.watch('src/scss/*.scss', gulp.series('sass'));
    gulp.watch('src/js/*.js', gulp.series('concat'));
    gulp.watch('src/images/*', gulp.series('imagemin'));
    return res();
});

//Sync and refresh browser
gulp.task('serve', (res) => {
    browserSync.init({
        server: './public'
    });
    gulp.watch('src/index.html').on('change', browserSync.reload);
    gulp.watch('src/html/*.html').on('change', browserSync.reload);
    gulp.watch('src/css/*.css').on('change', browserSync.reload);
    gulp.watch('src/js/*.js').on('change', browserSync.reload);
    return res();
});

//Watch and serve
gulp.task('watchserve', gulp.series(['message', 'watch', 'serve']));

//Run all tasks
gulp.task('default', gulp.series(['message', 'copyindex', 'copyhtml', 'imagemin', 'sass', 'concat', 'watch', 'serve']));