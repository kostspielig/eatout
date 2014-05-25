#
# Utilities for the eatoutberlin app
#

all: once

serve: 	
	dev_appserver.py .

deploy:	
	appcfg.py --oauth2 -A eatoutberlin update .


#clean:
#	rm -f app.yaml
#	rm -rf build
