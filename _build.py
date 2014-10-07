import os
import sys
import subprocess
import tempfile
import hashlib
import ConfigParser

try:
  import yuicompressor
except ImportError:
  print 'Install yuicompressor first. "sudo pip install yuicompressor"'
  sys.exit()

CONFIG_FILENAME = 'setup.cfg'

config = ConfigParser.RawConfigParser()
if not config.read(CONFIG_FILENAME):
  print 'Cannot read setup.cfg.'
  sys.exit()


def compress(sources, output, files_type):
  """ Compress input files into single minimized output file.
  Args:
    sources: List of files to compress.
    output: Output filename.
    files_type: "css" or "js".
  """
  handle, combined_filename = tempfile.mkstemp()
  os.close(handle)
  try:
    with open(combined_filename, mode='wb') as out:
      for input_file in sources:
        out.write(open(input_file, mode='rb').read())
    yuicompressor_jar = yuicompressor.get_jar_filename()
    args = ['java', '-jar', yuicompressor_jar,
                    '--type', files_type,
                    '-o', output, combined_filename]
    process = subprocess.Popen(args=args, stdout=subprocess.PIPE,
                               stderr=subprocess.STDOUT)
    output, _ = process.communicate()
    retcode = process.poll()
    if retcode != 0:
      cmd = ' '.join(args)
      msg = 'Cannot run command "%s": %s' % (cmd, output)
      raise EnvironmentError(msg)
  finally:
    os.remove(combined_filename)


def hashed(files):
  """
  Args:
    files: List of files. ['css/main.css']

  Returns:
    List of files with with hash at the end of each file. e.g.:
    ['/css/main.css?5324235']
  """
  md5 = lambda s: hashlib.md5(s).hexdigest()[:5]
  return ['/%s?%s' % (f, md5(open(f).read())) for f in files]

if config.has_section('minify_css'):
  sources = config.get('minify_css', 'sources').split(' ')
  output = config.get('minify_css', 'output')
  print 'Compressing %s -> %s...' % (sources, output)
  compress(sources, output, 'css')

  print 'Writing hashed values for css...'
  config.set('css', 'dev', ' '.join(hashed(sources)))
  config.set('css', 'prod', ' '.join(hashed([output])))

if config.has_section('minify_js'):
  sources = config.get('minify_js', 'sources').split(' ')
  output = config.get('minify_js', 'output')
  print 'Compressing %s -> %s...' % (sources, output)
  compress(sources, output, 'js')

  print 'Writing hashed values for js...'
  config.set('js', 'dev', ' '.join(hashed(sources)))
  config.set('js', 'prod', ' '.join(hashed([output])))

with open(CONFIG_FILENAME, 'wb') as f:
  config.write(f)
