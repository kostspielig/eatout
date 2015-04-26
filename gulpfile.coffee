# Load plugins
gulp = require 'gulp'
sass = require 'gulp-ruby-sass'
autoprefixer = require 'gulp-autoprefixer'
minifycss = require 'gulp-minify-css'
jshint = require 'gulp-jshint'
uglify = require 'gulp-uglify'
imagemin = require 'gulp-imagemin' # Compress images
imageResize = require 'gulp-image-resize'
rename = require 'gulp-rename'
clean = require 'gulp-clean'
concat = require 'gulp-concat'
notify = require 'gulp-notify'
cache = require 'gulp-cache'
livereload = require 'gulp-livereload'
coffee = require 'gulp-coffee'
gutil = require 'gulp-util'
changed = require 'gulp-changed'
debug = require 'gulp-debug'

sources =
    sass:    'style/**/*.scss'
    css:     'style/stylesheets/style.css'
    html:    'index.html'
    coffee:  'src/coffee/**/*.coffee'
    sources: 'src/**/*.js'
    images:  'style/images/places/**/*.{JPG,jpg}'

dest =
    coffee: 'src/coffee'
    css:    'dist/styles'
    html:   'dist/'
    js:     'dist/js'
    images: 'dist/images'

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
    gulp.src(sources.js)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(dest.js))
        .pipe(rename(suffix: '.min'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.js))
        .pipe(notify(message: 'Scripts task complete'))

# Images
# gulp.task('images', function() {
#    return gulp.src('src/images/**/*')
#        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
#        .pipe(gulp.dest('dist/images'))
#        .pipe(notify({ message: 'Images task complete' }));
#});

# Images -resize
gulp.task 'resize', ->
    gulp.src(sources.images) # 'style/images/places/Lagari/*.{JPG,jpg}'
        .pipe imageResize
            width : 1000
            upscale : false
        #.pipe(rename(suffix: "-M"))
        .pipe(gulp.dest((file) ->
            # process.stdout.write(file.base)
            return file.base.replace('places', 'places-M')
        )) # Destination in the same folder as source


# Clean
gulp.task 'clean', ->
    gulp.src([dest.js, dest.css], {read: false})
        .pipe clean()

# Default task
gulp.task 'default', ['clean'], ->
    gulp.start 'styles', 'coffee', 'scripts'
