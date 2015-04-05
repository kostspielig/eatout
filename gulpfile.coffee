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
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'

sources =
    sass: 'style/**/*.scss'
    css:  'style/stylesheets/style.css'
    html: 'index.html'
    coffee: 'src/coffee/**/*.coffee'

dest =
    coffee: 'src/coffee'
    css: 'dist/styles'
    html: 'dist/'
    js: 'dist/js'

# Styles
gulp.task 'styles', ->
    gulp.src(sources.css)
        .pipe(rename(suffix: '.min'))
        .pipe(minifycss())
        .pipe(gulp.dest(dest.css))
        .pipe(notify(message: 'Styles task complete'))

gulp.task 'coffee', ->
    gulp.src(sources.coffee)
        .pipe(coffee({bare: true}).on('error', gutil.log))
        .pipe(gulp.dest(dest.coffee))

gulp.task 'lint', ->
    gulp.src(sources.coffee)
        .pipe(coffeelint())
        .pipe(coffeelint.reporter())

# Scripts
gulp.task 'scripts', ->
    gulp.src('src/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(rename(suffix: '.min'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.js))
        .pipe(notify(message: 'Scripts task complete'));

# Images
# gulp.task('images', function() {
#    return gulp.src('src/images/**/*')
#        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
#        .pipe(gulp.dest('dist/images'))
#        .pipe(notify({ message: 'Images task complete' }));
#});

# Clean
gulp.task 'clean', ->
    gulp.src([dest.js, dest.css], {read: false})
        .pipe clean()

# Default task
gulp.task 'default', ['clean'], ->
    gulp.start 'styles', 'coffee', 'scripts'
