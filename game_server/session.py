from random import randint, sample


class player:


	def __init__(self, unique_id, unique_name, team):
		self.hand = []
		self.id = unique_id
		self.name = unique_name
		self.team = team


class boardCard:


	def __init__(self):
		self.card = None
		self.team = None


class session:
	

	def __init__(self, code, cards, max_cards):
		# Session identification
		self.code = code

		# Card pool and rule set
		self.cards = cards
		self.max_cards = max_cards

		# State control of current game
		self.connections = []
		self.players = []

		self.board = []
		for i in range(3):
			self.board.append([boardCard(), boardCard(), boardCard()])

		self.turn = None
		self.winner = None


	def add_user(self, unique_id, name):

		# Check if already in game
		for conn in self.connections:
			if conn.id == unique_id:
				conn.name = name

		ply = player(unique_id, name, -1)

		# Join by default as spectator
		self.connections.append(ply)

		# Join as a player if there is still room
		if len(self.players) < 2 and self.turn is None:

			# Default team to index of player
			ply.team = len(self.players)

			self.players.append(ply)

			# If the number of players is 2 then start game
			if len(self.players) == 2:
				self.start();


	def remove_user(self, unique_id):

		# Remove from connection list
		for conn in self.connections:
			if conn.id == unique_id:
				self.connections.remove(conn)

		# If not started then can safely remove player
		if self.turn is None:
			for ply in self.players:
				if ply.id == unique_id:		
					self.players.remove(ply)

		# Game has already started and player forefeit match
		if self.turn is not None:
			if self.winner is None:

				for ply in self.players:
					if ply.id == unique_id:

						if self.players[0].id == unique_id:
							self.winner = self.players[1]

						elif self.players[1].id == unique_id:
							self.winner = self.players[0]


	def start(self):
		self.turn = self.players[randint(0, 1)]

		for ply in self.players:
			ply.hand = sample(self.cards, self.max_cards)


	def place_card(self, who, cardIndex, x, y):

		if self.turn is not None:
			if self.turn.id == who:

				# Valid card in hand and board spot
				if cardIndex < len(self.turn.hand):	
					placed = self.get_placed(x, y)

					# Place card on board and remove form hand
					if placed is not None and placed.card is None:
						card = self.turn.hand[cardIndex]

						self.board[x][y].card = card
						self.board[x][y].team = self.players.index(self.turn)
						self.turn.hand.remove(card)

						# Process cards around recently placed
						self.update_board(x, y)

						# Decide next player's turn 
						self.next_turn()

						# Check if board is filled and decide winner
						self.check_winner()


	def update_board(self, x, y):

		placed 	= self.get_placed(x,		y		)

		if placed is None or placed.card is None:
			return

		top 	= self.get_placed(x, 		y - 1	)
		right 	= self.get_placed(x + 1, 	y		)
		bottom 	= self.get_placed(x, 		y + 1	)
		left 	= self.get_placed(x - 1, 	y		)

		if top is not None and top.card is not None:
			if top.card.bottom < placed.card.top:
				top.team = placed.team

		if right is not None and right.card is not None:
			if right.card.left < placed.card.right:
				right.team = placed.team

		if bottom is not None and bottom.card is not None:
			if bottom.card.top < placed.card.bottom:
				bottom.team = placed.team

		if left is not None and left.card is not None:
			if left.card.right < placed.card.left:
				left.team = placed.team


	def get_placed(self, x, y):

		# Stops looping backwards on board
		if x < 0 or y < 0:
			return None

		try:
			return self.board[x][y]
		except IndexError:
			return None


	def check_winner(self):
		scores = [0, 0]

		for x in range(3):
			for y in range(3):
				placed = self.get_placed(x, y)

				if placed is None or placed.card is None:
					return

				scores[placed.team] += 1

		if scores[0] > scores[1]:
			self.winner = self.players[0]
		else:
			self.winner = self.players[1]


	# Get current index of turn holder and increment
	def next_turn(self):

		if self.turn is not None:
			index = self.players.index(self.turn) + 1

			if index >= len(self.players):
				index = 0

			self.turn = self.players[index]


	# Count non players connected to session
	def count_spectators(self):
		count = 0

		for conn in self.connections:
			if conn not in self.players:	
				count += 1

		return count


	# Get status of board and get context per player
	def status(self, who = -1):

		action = 'spectating'
		board = self.board
		players = []

		# PLayer only actions
		for ply in self.players:
			if ply.id == who:
				
				# Check if turn order decided
				if self.turn is None:
					action = 'waiting-for-players'

				# Game still in progress
				if self.turn is not None:
					if self.turn.id == who:
						action = 'turn'
					else:
						action = 'waiting'

				# Win Conition met
				if self.winner is not None:
					if self.winner.id == who:
						action = 'win'
					else:
						action = 'loss'

		# Get status of players
		for ply in self.players:
			name = ply.name
			team = ply.team
			hand = [None] * len(ply.hand)

			# The person who owns the hand can see the real hand
			if ply.id == who:
				hand = ply.hand
				players.insert(0, {
					'name': name,
					'team': team,
					'hand': hand
					})

			# Disallow view other's hands to prevent spectator cheating
			else:
				players.append({
					'name': name,
					'team': team,
					'hand': hand
					})				

		status = {
			'action': action,
			'board': board,
			'players': players
		}
		return status