import time
import hashlib
import logging
from google.appengine.ext import deferred
from google.appengine.api import taskqueue, mail


def defer_narrow(obj, *args, **kwargs):
  """ Enqueues an on-demand cron job.

  Each task with the same params will be executed only once
  in given time interval. See the blog post for detailed description.
  http://blog.notdot.net/2010/05/App-Engine-Cookbook-On-demand-Cron-Jobs

  Args:
    obj: The callable to execute.
    _interval: How often the object should run, in seconds. Default is 60.
    _countdown: Seconds to wait before calling the object.
    args: Positional arguments to call the callable with.
    kwargs: Any other keyword arguments are passed through to the callable.
  """
  interval = kwargs.pop('_interval', 60)
  countdown = kwargs.pop('_countdown', None)
  interval_num = int(time.time()) / interval
  if countdown is None:
    countdown = interval

  args_hash = hashlib.md5(str([args, kwargs])).hexdigest()
  task_name = '_'.join([obj.__name__, args_hash, str(interval_num)])
  logging.debug('Executing on-demand cron job with name %s.', task_name)
  try:
    deferred.defer(obj, _name=task_name, _queue='deferred-narrow',
                   _countdown=countdown, *args, **kwargs)
  except (taskqueue.TaskAlreadyExistsError, taskqueue.TombstonedTaskError):
    logging.debug('Task with name %s already in queue.', task_name)


def alert(subject, message, interval=None):
  """ Immediately send an alert message to admin.
  Any further message with same params will be sent only once in given
  interval of time.

  Args:
    subject: The subject of the message, the Subject: line.
    message: The plaintext body content of the message.
  """
  if interval is None:
    interval = 3600
  sender = 'alert@cyberfundio.appspotmail.com'
  defer_narrow(mail.send_mail_to_admins, sender, subject, message,
               _interval=interval, _countdown=0)
