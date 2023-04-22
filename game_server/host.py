import json
import os
from threading import Thread, Lock
from random import sample

from websockets.sync.server import serve

from .message import send, receive
from .session import session
from .card	import card, load_cards


path = os.path.dirname(__file__)


class host:
	"""
	"""


	def __init__(self, host, port):

		# Load cards file
		self.cards = load_cards(f'{path}/cards.csv')

		# Session List of on-going games
		self.session_list = []
		self.session_lock = Lock()

		# Connections List
		self.connection_count = 0
		self.connection_lock = Lock()

		# Host alive status
		self.alive = True

		self.server = serve(self.handler, host, port)


	def run(self):
		print('Triple Triad server start')
		self.server.serve_forever()


	def stop(self):
		self.alive = False
		self.server.shutdown()
		print('Triple Triad gracefully closed')


	def handler(self, ws):

		# Mark socket as open
		connected = True
		client = -1

		# Assign self a unique client number
		with self.connection_lock:
			client = self.connection_count
			self.connection_count += 1

		print(f'client{client}@{ws.remote_address} connected')

		# Start event loop
		while self.alive and connected:
			data = receive(ws)
			method = data.get('method')

			# Disconnect from any existing sessions
			if method == 'close':
				connected = False
				self.leave_game(client)

			elif method == 'list-games':
				send(ws, {'response': 'list-games', 'games': self.list_games()})

			elif method == 'create-game':
				max_cards = data.get('max-cards', 5)
				code = self.create_game(max_cards)
				send(ws, {'response': 'create-game', 'code': code})

			elif method == 'join-game':
				code = data.get('code')
				name = data.get('name')
				self.join_game(client, name, code)
				send(ws, {'response': 'join-game', 'code': code})

			elif method == 'status-game':
				code = data.get('code')
				send(ws, {'response': 'status-game', 'status': self.status_game(client, code)})

			elif method == 'update-game':
				code = data.get('code')
				card = data.get('card')
				x = data.get('x');
				y = data.get('y');
				self.update_game(client, code, card, x, y)
				send(ws, {'response': 'update-game', 'status': self.status_game(client, code)})


	def list_games(self):
		results = []

		with self.session_lock:		
			for game in self.session_list:
				results.append({'code': game.code, 'players': len(game.players)})

		return results


	def create_game(self, max_cards):
		code = ''

		with self.session_lock:
			code = ''.join(sample('AEIOUYMNLPR', 5))
			self.session_list.append(session(code, self.cards, max_cards))
	
		return code


	def join_game(self, client, name, code):

		# Attempt to add clent to the session
		with self.session_lock:
			for game in self.session_list:
				if game.code == code:
					game.add_user(client, name)
					return True

		return False


	def leave_game(self, client):

		# Attempt to remove from every session
		with self.session_lock:
			for game in self.session_list:

				# Delete when last active member of session leaves
				if len(game.connections) > 0:
					game.remove_user(client)

					if len(game.connections) == 0:
						self.session_list.remove(game)


	def status_game(self, client, code):
		status = {'action': 'fail'}

		# Match any session games to the code
		with self.session_lock:
			for game in self.session_list:
				if game.code == code:
					status = game.status(client)
		
		return status	


	def update_game(self, client, code, card, x, y):

		with self.session_lock:
			for game in self.session_list:
				if game.code == code:
					game.place_card(client, card, x, y)			