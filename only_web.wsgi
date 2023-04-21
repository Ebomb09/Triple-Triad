import os, sys
sys.path.append(os.path.dirname(__file__))

from web_server.host import app

application = app.wsgifunc()