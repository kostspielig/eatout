
![Eat Out Berlin Logo](https://cdn.rawgit.com/kostspielig/eatout/master/style/images/eatoutb.png)

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

# License

Programming source code is licensed under the
[Affero General Public License v3](https://www.gnu.org/licenses/agpl-3.0.html).
![AGPLv3 logo](https://www.gnu.org/graphics/agplv3-155x51.png)

Content, including all text and pictures in the `data` folder, are licensed under
[Creative Commons + Attribution + Non Commercial + Share Alike v4](https://creativecommons.org/licenses/by-nc-sa/4.0/).
![CC-BY-NC-SA logo](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)
