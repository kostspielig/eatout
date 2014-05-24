#
# Utilities for the eatoutberlin app
#

all: once

serve: 	
	../google_appengine/dev_appserver.py .

deploy:	
	../google_appengine/appcfg.py update .

#clean:
#	rm -f app.yaml
#	rm -rf build
