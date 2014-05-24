#
#  main.py : Main module for the url parsing of the application
#
# Written in 2014 by Maria Carrasco  <kostspielig@gmail.com>
#
#  *NOTE: move out all the handlers

import webapp2
import cgi
import jinja2
import os
import logging
import sys
import json

from google.appengine.ext import db
from google.appengine.api import images


sys.path.append('./lib/')
import utils

sys.path.append('./lib/DB/')
#import art
import appuser

#from google.appengine.api import memcache
#from instagram.client import InstagramAPI


template_dir = os.path.join(os.path.dirname(__file__), 'templates')
angular_dir = os.path.join(os.path.dirname(__file__), 'angular')

jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir),
                               autoescape = True)


def datetimeformat(value, format='%H:%M / %d-%m-%Y'):
    return value.strftime(format)
jinja_env.filters['datetimeformat'] = datetimeformat

post =  000;


class Handler(webapp2.RequestHandler):
    """Class representing a handler template."""

    def write(self, *a, **kw):
        self.response.out.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))
    def set_secure_cookie(self, name, val):
        cookie_val = utils.make_secure_val(val)
        self.response.headers.add_header(
            'Set-Cookie',
            '%s=%s; Path=/' % (name, cookie_val))

    def read_secure_cookie(self, name):
        cookie_val = self.request.cookies.get(name)
        return cookie_val and utils.check_secure_val(cookie_val)

    def login(self, user):
        self.set_secure_cookie('user_id', str(user.key().id()))

    def logout(self):
        self.response.headers.add_header('Set-Cookie', 'user_id=; Path=/')

    def initialize(self, *a, **kw):
        webapp2.RequestHandler.initialize(self, *a, **kw)
        uid = self.read_secure_cookie('user_id')
        self.user = uid and appuser.User.by_id(int(uid))


        
        """data = json.loads(self.request.body)
        name = data['username']
        pw = data['password']
        u = appuser.User.login(name.lower(),
                               pw)
        if u:
            self.login(u)
            user =appuser.User.by_name(name)
            
            self.write(json.dumps({'logged': bool(u), 'user' :
                {'key'          : str(user.key()),
                 'id'           : user.key().id(),
                 'name'         : user.name}}))
"""

class Signup(Handler):
    """Class representing the Signup page."""
    def get(self):
        self.render("signup-form.html")

    def post(self):
        have_error = False
        self.username = self.request.get('username').strip().lower()
        self.password = self.request.get('password')
        self.verify = self.request.get('verify')
        self.description = self.request.get('description').strip()
        self.email = self.request.get('email')
        self.avatar = self.request.get('avatar')
        self.website = self.request.get('website').strip().lower()

        logging.error('WHATEVER'+self.avatar);
        
        params = dict(username = self.username,
                      description = self.description,
                      email = self.email,
                      website = self.website)

        if not utils.valid_username(self.username):
            params['error_username'] = "That's not a valid username."
            have_error = True
        elif appuser.User.by_name(self.username):
            params['error_username'] = 'That user already exists.'
            have_error = True
        if not utils.valid_password(self.password):
            params['error_password'] = "That wasn't a valid password."
            have_error = True
        elif self.password != self.verify:
            params['error_verify'] = "Your passwords didn't match."
            have_error = True

        if not utils.valid_email(self.email):
            params['error_email'] = "That's not a valid email."
            have_error = True

        if not utils.valid_url(self.website):
            params['error_website'] = "That's not a valid website."
            have_error = True

        if not self.avatar:
            params['error_avatar'] = "We need a profile picture."
            have_error = True

        if have_error:
            self.write(json.dumps({'error': 'have error.'}));
            #self.render('signup-form.html', **params)
        else:
            self.done()

    def done(self, *a, **kw):
        """Overwrite this method to save user's data."""
        raise NotImplementedError



class Register(Signup):
    """Class that handles the storing of the new user."""
    def done(self):
        #make sure the user doesn't already exist
        u = appuser.User.by_name(self.username)
        if u:
            msg = 'That user already exists.'
            self.render('signup-form.html', error_username = msg)
        else:
            img = images.Image(self.avatar)

            # Resize & crop the profile picture: square small icon
            if img:
                img.im_feeling_lucky()

                if img.width != img.height:
                    size =  img.height if (img.width > img.height) else img.width
                    img.crop(0.0, 0.0, float(size)/float(img.width), float(size)/float(img.height))

                if img.width > 250:
                    img.resize(250)
                img = db.Blob(img.execute_transforms(output_encoding=images.JPEG))

            # Adding the user to the database if everything is correct
            u = appuser.User.register(self.username, self.password, self.description, self.email, self.website, img)
            u.put()

            self.login(u)
            self.redirect('/')


    
            
class Signup2(Handler):
    """Class representing the Signup page."""
    def get(self):
        self.render("signup-form.html")

    def post(self):
        have_error = False
        self.username = self.request.get('username').strip().lower()
        self.password = self.request.get('password')
        self.verify = self.request.get('verify')
        self.description = self.request.get('description').strip()
        self.email = self.request.get('email')
        self.avatar = self.request.get('avatar')
        self.website = self.request.get('website').strip().lower()

        params = dict(username = self.username,
                      description = self.description,
                      email = self.email,
                      website = self.website)

        if not utils.valid_username(self.username):
            params['error_username'] = "That's not a valid username."
            have_error = True
        elif appuser.User.by_name(self.username):
            params['error_username'] = 'That user already exists.'
            have_error = True
        if not utils.valid_password(self.password):
            params['error_password'] = "That wasn't a valid password."
            have_error = True
        elif self.password != self.verify:
            params['error_verify'] = "Your passwords didn't match."
            have_error = True

        if not utils.valid_email(self.email):
            params['error_email'] = "That's not a valid email."
            have_error = True

        if not utils.valid_url(self.website):
            params['error_website'] = "That's not a valid website."
            have_error = True

        if not self.avatar:
            params['error_avatar'] = "We need a profile picture."
            have_error = True

        if have_error:
            self.render('signup-form.html', **params)
        else:
            self.done()

    def done(self, *a, **kw):
        """Overwrite this method to save user's data."""
        raise NotImplementedError


class Register2(Signup2):
    """Class that handles the storing of the new user."""
    def done(self):
        #make sure the user doesn't already exist
        u = appuser.User.by_name(self.username)
        if u:
            msg = 'That user already exists.'
            self.render('signup-form.html', error_username = msg)
        else:
            img = images.Image(self.avatar)

            # Resize & crop the profile picture: square small icon
            if img:
                img.im_feeling_lucky()

                if img.width != img.height:
                    size =  img.height if (img.width > img.height) else img.width
                    img.crop(0.0, 0.0, float(size)/float(img.width), float(size)/float(img.height))

                if img.width > 250:
                    img.resize(250)
                img = db.Blob(img.execute_transforms(output_encoding=images.JPEG))

            # Adding the user to the database if everything is correct
            u = appuser.User.register(self.username, self.password, self.description, self.email, self.website, img)
            u.put()

            self.login(u)
            self.redirect('/')

    
    
    
class LoginOld(Handler):
    """Login of an existing user"""

    def get(self):
        self.render('login-form.html')

    def post(self):
        username = self.request.get('username')
        password = self.request.get('password')

        u = appuser.User.login(username.lower(), password)
        if u:
            self.login(u)
            self.redirect('/')
        else:
            msg = 'Invalid login'
            self.render('login-form.html', error = msg)

class Logout(Handler):
    """Logout of a active user. """
    def get(self):
        self.logout()
        self.redirect('/')

"""def all_arts(update = False):
    key = 'all'
    arts = memcache.get(key)
    if arts is None or update:
        arts = Art.all().order('-date')
        arts = list(arts)
        memcache.set(key,arts)
    return arts
"""
class All(Handler):
    """Class that load all the posts in the system """
    def get(self):
        self.render_front()

    def render_front(self):
        arts = art.Art.all().order('-date')
        # Memcache call
        noinfo = 1
        self.render("index.html", arts = arts, noinfo = noinfo)

def art_to_dict(model):
    return {
        'id'      : model.key().id(),
        'key'     : str(model.key()),
        'owner'   : model.owner.name,
        'date'    : str(model.date),
        'author'  : model.author,
        'url'     : model.url,
        'comment' : model.comment
        }

def user_to_dict(model):
    return {
        'key'          : str(model.key()),
        'id'           : model.key().id(),
        'name'         : model.name,
        'description'  : model.description,
        'website'      : model.website,
        'art_posts'    : map(art_to_dict, model.art_posts)
    }

class ArtList(Handler):
    def get(self, offset):

        ioffset = int(offset)
        arts = art.Art.all().order('-date').run( offset=ioffset, limit=3 )

        self.write(json.dumps(map(art_to_dict, arts)))

class ArtGet(Handler):
    def get(self, post_id):
        key =  db.Key.from_path('Art', int(post_id))
        post = db.get(key)
        self.write(json.dumps(art_to_dict(post)))

    def post(self):
        data = json.loads(self.request.body)

        author = data['author']
        comment = cgi.escape(data['comment'], True)
        img = data['avatar']
        url = data['url']

        valid_url = utils.valid_url(url)

        if author and comment and img:
            #avatar = images.Image(img)
            if images.Image(img).width > 800:
                img = images.resize(img, 800)

            avatar = db.Blob(img)
            a = art.Art(author=author, comment=comment, avatar=avatar, url=url, owner=self.user)
            a.put()
            #all_arts(True)
            #top_arts(True)

            #self.redirect("/blog/%s" % str(a.key().id()))
            return True
        else:
            error = "We need all the fields to continue"
            if not(valid_url):
                error+=". The url is incorrect."
                url = ""
            self.render_front(author, url, comment, error)


        
class UserGet(Handler):
    def get(self, user_id):
        user = appuser.User.by_name(user_id)
        self.write(json.dumps(user_to_dict(user)))

class Login(Handler):
    def post(self):
        data = json.loads(self.request.body)
        name = data['username']
        pw = data['password']
        u = appuser.User.login(name.lower(),
                               pw)
        if u:
            self.login(u)
            user =appuser.User.by_name(name)
            
            self.write(json.dumps({'logged': bool(u), 'user' :
                {'key'          : str(user.key()),
                 'id'           : user.key().id(),
                 'name'         : user.name}}))

class IsUser(Handler):
    def get(self):
        if self.user:
            self.write(json.dumps({'logged': 'true', 'user' :
                {'key'          : str(self.user.key()),
                 'id'           : self.user.key().id(),
                 'name'         : self.user.name}}))

        else:
            self.write(json.dumps({'logged': ''}));
            
class LoadAll(Handler):
    """Load all the posts of a page, minus an offset """
    def get(self, offset):
        self.render_front(offset)

    def render_front(self, offset):
        ioffset = int(offset)
        arts = art.Art.all().order('-date').run( offset=ioffset )
        # Memcache call
        noinfo = 1
        self.render("getPost.html", arts = arts, noinfo = noinfo)


            
class NotFound(Handler):
	def get(self):
		self.render("404.html", user=self.user)


class Social(Handler):
    def get(self):
    # api = InstagramAPI(client_id='7f93273ebbbd4d82b2bc93df598f00c5', client_secret='156630aeb6ac46eb95daaecd84118021')
    #   popular_media = api.media_popular(count=5)
    #   for media in popular_media:
    #   print media.images['standard_resolution'].url

        self.render("social.html", user = self.user)

class Cookie(Handler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        visits_cookie = self.request.cookies.get('visits','0')
        visits = 0
        if visits_cookie:
            visits_cookie = utils.check_secure_val(visits_cookie)
            if visits_cookie:
                visits = int(visits_cookie)

        visits += 1
        visits_new = utils.make_secure_val(str(visits))

        self.response.headers.add_header('Set-Cookie', 'visits=%s' %visits_new)
        self.write("You have been here %s times" % visits)


class NewPost(Handler):
    """New post form handler"""

    def render_front(self, author="", url="",comment="", error = ""):
        self.render("newpost.html", author = author, url=url, comment = comment, error = error, user = self.user )

    def get(self):

        if self.user:
            self.render_front()
        else:
            self.redirect("/notAllowed")

    def post(self):
        #if users.get_current_user():
        #    author = users.get_current_user().nickname()
        #else:

        author = self.request.get("author")
        comment = cgi.escape(self.request.get("comment"), True)
        img = self.request.get("avatar")
        url = self.request.get("url")

        logging.error("comment scaped?")
        valid_url = utils.valid_url(url)

        if author and comment and img:
            #avatar = images.Image(img)
            if images.Image(img).width > 800:
                img = images.resize(img, 800)

            avatar = db.Blob(img)
            a = art.Art(author=author, comment=comment, avatar=avatar, url=url, owner=self.user)
            a.put()
            #all_arts(True)
            #top_arts(True)

            self.redirect("/angular/index.html#/blog/%s" % str(a.key().id()))
        else:
            error = "We need all the fields to continue"
            if not(valid_url):
                error+=". The url is incorrect."
                url = ""
            self.render_front(author, url, comment, error)


class ArtAdd(Handler):
    """New art form handler"""

    def post(self):
        #if users.get_current_user():
        #    author = users.get_current_user().nickname()
        #else:
        data = json.loads(self.request.body)
        author = data['author']
        comment = cgi.escape(data['comment'], True)
        img = {} #data['avatar']
        url = data['url']

        #logging.error("comment scaped?")
        valid_url = utils.valid_url(url)

        if author and comment and img:
            #avatar = images.Image(img)
            if images.Image(img).width > 800:
                img = images.resize(img, 800)

            avatar = db.Blob(img)
            a = art.Art(author=author, comment=comment, avatar=avatar, url=url, owner=self.user)
            a.put()
            #all_arts(True)
            #top_arts(True)
            
            self.write(json.dumps({'success': 'true',
                                   'id'     : a.key().id(),
                                   'error'  : ''}));
            #self.redirect("/blog/%s" % str(a.key().id()))
        else:
            error = "We need all the fields to continue"
            if not(valid_url):
                error+=". The url is incorrect."
                url = ""
            self.write(json.dumps({'success': '',
                                   'id'     : '',
                                   'error'  : error}));

                #self.render_front(author, url, comment, error)

            



"""URL mapping of the application"""
app = webapp2.WSGIApplication([
    ('/api/login', Login),
    ('/api/art/list/([0-9]+)', ArtList),
    ('/api/art/add', ArtAdd),
    ('/api/art/get/([0-9]+)', ArtGet),
    ('/api/user/get/([a-zA-Z0-9_-]+)', UserGet),
    ('/img', handlers.Image),
    ('/signup', Register2),
    ('/login', LoginOld),
    ('/logout', Logout)],
    debug=True)
