import os
import sys
import logging
import constants

if not os.getenv('SERVER_SOFTWARE'):
  os.environ['SERVER_SOFTWARE'] = 'Devel'

sys.path.insert(0, 'libs')

DEBUG = ((os.getenv('HTTP_HOST') != 'alpha.cyberfund.io' and
         os.getenv('HTTP_HOST') != 'mining.cyberfund.io' and
         os.getenv('CURRENT_VERSION_ID', '').startswith('dev')) or
         os.getenv('SERVER_SOFTWARE', '').startswith('Devel'))

if os.getenv('HTTP_HOST', '').startswith('localhost'):
  constants.WEBAPP2_CONFIG['webapp2_extras.sessions']['cookie_args']['domain'] = None

try:
  import gae_mini_profiler.profiler
  import gae_mini_profiler.templatetags
except ImportError:
  logging.warning('gae_mini_profiler import failed.')
  gae_mini_profiler = None


def webapp_add_wsgi_middleware(app):
  if gae_mini_profiler:
    app = gae_mini_profiler.profiler.ProfilerWSGIMiddleware(app)
  return app


def gae_mini_profiler_should_profile_production():
  if DEBUG:
    return True


def gae_mini_profiler_should_profile_development():
  return True

appstats_CALC_RPC_COSTS = True
appstats_SHELL_OK = True
