#
# Utilities for the eatoutberlin app
#

all: default

NPM=npm
GO=go
GIT=git

BOWER=./node_modules/bower/bin/bower
GULP=./node_modules/gulp/bin/gulp.js

export GOPATH=$(CURDIR)/server

default:
	$(GULP) default

deps:
	$(GIT) submodule update --recursive --init
	$(NPM) install
	$(BOWER) install
	$(GO) get eatout

app.yaml: BRANCH  = $(shell git rev-parse --abbrev-ref HEAD)
app.yaml: app.yaml.in .git/HEAD
	@echo Generating $@ for branch: $(BRANCH)
	@sed 's/%BRANCH/$(BRANCH)/g' $< > $@

serve-appengine: app.yaml
	dev_appserver.py .

deploy-appengine: app.yaml
	appcfg.py --oauth2 -A eatoutberlin update .

serve:
	export GOPATH=$(GOPATH)
	$(GO) run server/main.go

clean:
	rm -f app.yaml
