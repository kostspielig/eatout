
# Eat Out Berlin

Eat Out Berlin is a tool to discover great places to eat in Berlin.


# Usage

## Install

Run the project locally by running:

```
    make serve
```

Deploy the current version to gcloud:

```
    make deploy
```

The project is pre-configured with a number of gulp helper scripts to make it easy to
run the common tasks that you will need while developing:

* **gulp data** : Build the json data from the yaml files
* **gulp resize** : Resize images to get an optimized size
* **gulp wacht** : Build coffee and sass files on save (file change)
* **gulp lint** : Run the linter on the coffee files
