# Load plugins
gulp = require 'gulp'
sass = require 'gulp-ruby-sass'
autoprefixer = require 'gulp-autoprefixer'
minifycss = require 'gulp-minify-css'
jshint = require 'gulp-jshint'
uglify = require 'gulp-uglify'
imagemin = require 'gulp-imagemin'
rename = require 'gulp-rename'
clean = require 'gulp-clean'
concat = require 'gulp-concat'
notify = require 'gulp-notify'
cache = require 'gulp-cache'
livereload = require 'gulp-livereload'

# Styles
gulp.task 'styles', ->
  gulp.src('style/stylesheets/style.css')
    .pipe(rename(suffix: '.min'))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify(message: 'Styles task complete'))

# Scripts
gulp.task 'scripts', ->
  gulp.src('js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename(suffix: '.min'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify(message: 'Scripts task complete'));

# Images
# gulp.task('images', function() {
#  return gulp.src('src/images/**/*')
#    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
#    .pipe(gulp.dest('dist/images'))
#    .pipe(notify({ message: 'Images task complete' }));
#});

# Clean
gulp.task 'clean', ->
  gulp.src(['dist/styles', 'dist/scripts'], {read: false})
    .pipe clean()

# Default task
gulp.task 'default', ['clean'], ->
  gulp.start 'styles', 'scripts'
