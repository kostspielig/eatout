#!/usr/bin/env coffee
#
# Copyright (C) 2015 by EatOutBerlin
#

fs = require 'fs'
yaml = require 'js-yaml'
colors = require 'colors/safe'
path = require 'path'
diff = require 'diff'
mkdirp = require 'mkdirp'

INPUT_FILE = path.join 'data', 'places.json'
OUTPUT_DIR = path.join 'data', 'places'
OUTPUT_FILE = 'place.yaml'

options = ->
    require 'argp'
        .createParser once: true
        .description "Converts the data from the monolitic json file to multiple yaml."
        .body()
        .text "Options:"
        .option
            long: 'force'
            short: 'f'
            description: "Actually write files, otherwise do a dry run."
        .option
            long: 'overwrite'
            short: 'F'
            description: "Force and rewrite files that already exist."
        .help()
        .argv()

colors.setTheme
    prompt: [ 'yellow', 'bold' ]
    info: 'cyan'
    error: [ 'red', 'bold' ]
    data: 'grey'
    diffPlus: 'green'
    diffMinus: 'red'

toSlug = (value) ->
    value
      .toLowerCase()
      .replace /-+/g, ''
      .replace /\s+/g, '-'
      .replace /[^a-z0-9-]/g, ''

main = ->
    opts = do options

    writeSafe = (file, data) ->
        if fs.existsSync file
            if opts.overwrite
                console.log colors.prompt "  File already exists, rewriting"
                fs.writeFileSync file, data
            else
                console.log colors.info "  File already exists"
                diff.diffLines fs.readFileSync(file, 'utf8'), data
                    .forEach (part) ->
                        color = switch
                            when part.added then 'diffPlus'
                            when part.removed then 'diffMinus'
                            else 'data'
                        console.log colors[color](part.value)
        else
            if opts.force
                mkdirp.sync path.dirname file
                fs.writeFileSync file, data
            else
                console.log colors.data data

    console.log colors.prompt "* Reading input file: #{INPUT_FILE}"
    places = JSON.parse fs.readFileSync INPUT_FILE, 'utf8'
    for place in places
        slug = toSlug place.name
        fpath = path.join OUTPUT_DIR, slug, OUTPUT_FILE
        console.log colors.prompt "* Writing output file: #{fpath}"
        writeSafe fpath, yaml.dump place

main() if require.main is module
