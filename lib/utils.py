
# eatout - yummy places in the hood
# Copyright (C) 2014-2016 Maria Carrasco Rodriguez
#
# This file is part of eatout.
#
# eatout is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# eatout is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with eatout.  If not, see <http://www.gnu.org/licenses/>.

#
#  utils.py : File with a bunch off useful stuff
#
# Written in 2014 by Maria Carrasco  <kostspielig@gmail.com>
#

import re
import hmac

# Google images
from google.appengine.api import images

# Global variables
USER_RE = re.compile(r"^[a-zA-Z0-9_-]{3,20}$")
PASS_RE = re.compile(r"^.{3,20}$")
EMAIL_RE  = re.compile(r'^[\S]+@[\S]+\.[\S]+$')
URL_RE = re.compile(r"^((https?|ftp)://|(www|ftp)\.)[a-z0-9-]+(\.[a-z0-9-]+)+([/?].*)?$")

secret = 'fart';

# Validating inputs
def valid_username(username):
    return username and USER_RE.match(username) and username.isalpha()

def valid_password(password):
    return password and PASS_RE.match(password)

def valid_email(email):
    return not email or EMAIL_RE.match(email)

def valid_url(url):
    return url and URL_RE.match(url)

# Other stuf
def make_secure_val(val):
    return '%s|%s' % (val, hmac.new(secret, val).hexdigest())

def check_secure_val(secure_val):
    val = secure_val.split('|')[0]
    if secure_val == make_secure_val(val):
        return val



        