import os

import web
from web.contrib.template import render_jinja


urls = (
	'/',			'index',
	'/join',		'join',
)

path = os.path.dirname(__file__)
os.chdir(path)

render = render_jinja(f'{path}/templates', encoding='utf-8')
app = web.application(urls, globals())


class index:

	def GET(self):
		return render.index()


class join:

	def GET(self):
		return render.join()