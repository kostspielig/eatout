#
# Utilities for the eatoutberlin app
#

all: once

app.yaml: BRANCH  = $(shell git rev-parse --abbrev-ref HEAD)
app.yaml: app.yaml.in .git/HEAD
	@echo Generating $@ for branch: $(BRANCH)
	@sed 's/%BRANCH/$(BRANCH)/g' $< > $@

serve: app.yaml
	dev_appserver.py .

deploy:	app.yaml
	appcfg.py --oauth2 -A eatoutberlin update .

clean:
	rm -f app.yaml
