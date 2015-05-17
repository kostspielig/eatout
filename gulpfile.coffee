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
yaml = require 'gulp-yaml'
jsoncombine = require 'gulp-jsoncombine'
_ = require 'underscore'
path = require 'path'
marked = require 'marked'

sources =
    sass:    'style/**/*.scss'
    css:     'style/stylesheets/style.css'
    html:    'index.html'
    coffee:  'src/coffee/**/*.coffee'
    sources: 'src/**/*.js'
    images:  'style/images/places/**/*.{JPG,jpg}'
    yaml:    'data/**/*.yaml'

dest =
    coffee: 'src/coffee'
    css:    'dist/styles'
    html:   'dist/'
    js:     'dist/js'
    images: 'dist/images'
    json:   'data'

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

# Images -resize
gulp.task 'resize', ->
    gulp.src(sources.images)
        .pipe imageResize
            width : 1000
            upscale : false
        .pipe(gulp.dest((file) ->
            file.base.replace('places', 'places-M')
        )) # Destination in the same folder as source

# Convert json to
gulp.task 'yaml2json', ->
    gulp.src(sources.yaml)
        .pipe yaml()
        .pipe jsoncombine 'places.json',
            ((data) ->
                result = _.pairs data
                    .map ([fname, obj]) ->
                        _.extend obj,
                            slug: path.basename path.dirname fname
                            description: marked obj.description
                new Buffer JSON.stringify result),
        .pipe gulp.dest dest.json

# Clean
gulp.task 'clean', ->
    gulp.src([dest.js, dest.css], {read: false})
        .pipe clean()

# Default task
gulp.task 'default', ['clean'], ->
    gulp.start 'styles', 'coffee', 'scripts'
