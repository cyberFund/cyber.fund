import json
import webapp2
from webapp2_extras import jinja2, sessions, auth
from google.appengine.api import users
from google.appengine.ext import ndb
import model
import ConfigParser
from appengine_config import gae_mini_profiler, DEBUG
import os
import datetime

config = ConfigParser.RawConfigParser()
config.read('setup.cfg')


class Base(webapp2.RequestHandler):
  """ The other handlers inherit from this class. Provides some helper methods
  for rendering a template.
  """
  @webapp2.cached_property
  def auth(self):
    return auth.get_auth()

  @webapp2.cached_property
  def user(self):
    """ Returns dict with user session info or None if no user specified. """
    user = self.auth.get_user_by_session()
    if user:
      return ndb.Key(model.User, user['user_id'])

  @webapp2.cached_property
  def uid(self):
    if self.user:
      return self.user.id()
    elif not self.session.get('uid'):
      self.session['uid'] = os.urandom(8).encode('hex')
    return self.session.get('uid')

  @webapp2.cached_property
  def user_props(self):
    """ Returns dict with user session info or None if no user specified. """
    return self.auth.get_user_by_session()

  @webapp2.cached_property
  def user_model(self):
    """ Returns user model or None if no user specified. """
    if self.user:
      return self.auth.store.user_model.get_by_id(self.user.id())

  def dispatch(self):
    try:
      # Dispatch the request.
      webapp2.RequestHandler.dispatch(self)
    finally:
      # Save all sessions.
      self.session_store.save_sessions(self.response)

  @webapp2.cached_property
  def balances(self):
    if self.user:
      _u = model.Tag(prop='user', value=self.user.id())
      pubkeys = model.PubKey.query(model.PubKey.tags == _u).fetch()
      balances = {}
      for pubkey in pubkeys:
        for balance in pubkey.balances:
          balances.setdefault(balance.asset, 0)
          balances[balance.asset] += balance.value
      return balances
    return {}

  @webapp2.cached_property
  def cursor(self):
    """ Return current cursor parsed from query string.
    If current cursor is invalid user will be redirected on empty cursor.
    """
    curs = self.request.get('cursor')
    if curs.isdigit():
      return int(curs)
    else:
      return 0

  @webapp2.cached_property
  def session_store(self):
    return sessions.get_store(request=self.request)

  @webapp2.cached_property
  def session(self):
    """ Returns a session using the default cookie key. """
    return self.session_store.get_session(backend='securecookie')

  def is_current_user_admin(self):
    return users.is_current_user_admin()

  @webapp2.cached_property
  def donate_balance(self):
    try:
      result = model.Cached.get('donate_balance')
      if result is None:
        balance = ex.blockchain.wallets('1CybeRLRSu8TjBadfqVEshQr5xbkQG3xQV')
        result = balance.callback().get('BTC', 0.0)
        if balance:
          model.Cached.set('donate_balance', result, 60 * 60)
      return result
    except:
      return 0.0

  @webapp2.cached_property
  def _css(self):
    """ Get list of CSS files with hash to solve cache invalidation problem.
    Use single compressed CSS file in production.
    """

    if config.has_section('css'):
      if self.debug:
        return config.get('css', 'dev').split(' ')
      else:
        return config.get('css', 'prod')

  @webapp2.cached_property
  def _js(self):
    """ Get list of JS files with hash to solve cache invalidation problem.
    Use single compressed JS file in production.
    """

    if config.has_section('js'):
      if self.debug:
        return config.get('js', 'dev').split(' ')
      else:
        return config.get('js', 'prod')

  def uri(self, *args, **kwargs):
    if os.getenv('HTTP_HOST').startswith('localhost') and '_netloc' in kwargs:
      kwargs['_netloc'] = os.getenv('HTTP_HOST')
    return self.uri_for(*args, **kwargs)

  def absolute_uri(self, _name, *args, **kwargs):
    """ Shortcut for building absolute uri. """
    return self.uri_for(_name, _full=True, *args, **kwargs)

  @webapp2.cached_property
  def debug(self):
    return True if DEBUG else False

  def jinja2_factory(self, app):
    """ True ninja method for attaching additional globals or filters to jinja2.
    """
    j = jinja2.Jinja2(app)
    j.environment.add_extension('jinja2.ext.loopcontrols')
    j.environment.filters.update({
    })
    j.environment.globals.update({
      'uri': self.uri,
      'debug': self.debug,
      '_css': self._css,
      '_js': self._js,
    })
    if gae_mini_profiler:
      profiler_includes = gae_mini_profiler.templatetags.profiler_includes
    else:
      profiler_includes = lambda: ''
    j.environment.globals.update({
      'profiler_includes': profiler_includes
    })
    return j

  @webapp2.cached_property
  def jinja2(self):
    return jinja2.get_jinja2(factory=self.jinja2_factory)

  uv = {}

  def render_to_string(self, _template, **context):
    path_info = os.getenv('PATH_INFO').split('/')
    http_host = os.getenv('HTTP_HOST').split('.')
    universal_variable = {
      'user': {
        'user_id': self.uid,
      },
      'page': {},
      'version': '1.1.2'
    }
    if len(path_info) > 1:
      universal_variable['page']['type'] = path_info[1].title() or 'Main'
    if len(http_host) > 1:
      universal_variable['page']['domain'] = http_host[0].title()
    if self.user:
      universal_variable['user']['returning'] = 'logged_in'
      universal_variable['user']['name'] = self.user_model.name
      universal_variable['user']['email'] = self.user_model.email
      universal_variable['user']['avatar'] = self.user_model.picture
      universal_variable['user']['birth_date'] = str(self.user_model.birthday)
      universal_variable['user']['gender'] = self.user_model.gender
      universal_variable['user']['country'] = self.user_model.country
      universal_variable['user']['city'] = self.user_model.city
      for auth_id in self.user_model.auth_ids:
        key, value = auth_id.split(':')
        universal_variable['user'][key] = value
      universal_variable['user']['city'] = self.user_model.city
      universal_variable['user']['picture'] = self.user_model.picture
    else:
      universal_variable['user']['returning'] = 'logged_out'
    universal_variable = dict(universal_variable.items() + self.uv.items())

    return self.jinja2.render_template(
      _template,
      user=self.user,
      user_model=self.user_model,
      balances=self.balances,
      is_current_user_admin=self.is_current_user_admin(),
      donate_balance=self.donate_balance,
      request=self.request,
      universal_variable=json.dumps(universal_variable),
      host=os.getenv('HTTP_HOST'),
      session=self.session,
      cursor=self.cursor,
      datetime=datetime,
      **context)

  def render(self, *args, **kwargs):
    return self.response.write(self.render_to_string(*args, **kwargs))

  def render_json(self, response):
    self.response.headers['Content-Type'] = 'application/json'
    self.response.write(json.dumps(response))


class Static(Base):
  def get(self, template, **kwargs):
    """ Shortcut for building static pages from templates. """
    if 'ifanon' in kwargs:
      if not self.user:
        self.redirect_to(kwargs.pop('ifanon'), **kwargs)
    return self.render(template, **kwargs)
