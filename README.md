
# Eat Out Berlin

Eat Out Berlin is a tool to discover great places to eat in Berlin.


# Usage


## Dependencies

To install all the dependencies run:
```
    npm install
    bower install
```

## Compilation

The project uses CoffeeScript and Sass, which require a precompilation
step.  To compile code, run
```
    gulp dev
```

This compiles all the sources, but will only make the `/debug` version
work. The production version requires minification and other
processes.  For that, just run:
```
    gulp
```

During development, it is useful to compile things automatically as
you change files.  For this (but only for `/debug`), run:
```
    gulp watch
```

There are other useful Gulp tasks:

* **gulp data** : Build the json data from the yaml files
* **gulp resize** : Resize images to get an optimized size
* **gulp wacht** : Build coffee and sass files on save (file change)
* **gulp lint** : Run the linter on the coffee files

## Install

Run the project locally by running:
```
    make serve
```

Deploy the current version to gcloud:
```
    make deploy
```
