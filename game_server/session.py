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
		self.host = ""

		# Card pool and rule set
		self.cards = cards
		self.max_cards = max_cards

		# State control of current game
		self.players = []
		self.connect_attempts = 0

		self.board = []
		for i in range(3):
			self.board.append([boardCard(), boardCard(), boardCard()])

		self.turn = None
		self.winner = None


	def add_user(self, unique_id, unique_name):
		self.connect_attempts += 1

		for ply in self.players:
			if ply.id == unique_id:
				return

		# Add requesting player if there are less than 2 players already
		if len(self.players) < 2 and self.turn is None:
			self.players.append(player(unique_id, unique_name, len(self.players)))

			# Assign host to the first player to successfully join
			if self.host == "":
				self.host = unique_name;

			# If the number of players is 2 then start game
			if len(self.players) == 2:
				self.start();


	def remove_user(self, unique_id):

		# Game has already started and player left
		if self.turn is not None:
	
			if self.winner is None:
				if self.players[0].id == unique_id:
					self.winner = self.players[1]

				elif self.players[1].id == unique_id:
					self.winner = self.players[0]

		for ply in self.players:
			if ply.id == unique_id:
				self.players.remove(ply)


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


	# Get status of board and get context per player
	def status(self, who):

		status = {'action': 'spectating', 'board': self.board}

		for ply in self.players:
			if ply.id == who:

				# Win Conition met
				if self.winner is not None:
					if self.winner.id == who:
						status = {'action': 'win', 'team': ply.team, 'cards': ply.hand,'board': self.board}
					else:
						status = {'action': 'loss', 'team': ply.team, 'cards': ply.hand,'board': self.board}
					return status

				# Game still in progress
				if self.turn is not None:
					if self.turn.id == who:
						status = {'action': 'turn', 'team': ply.team, 'cards': ply.hand, 'board': self.board}
					else:
						status = {'action': 'waiting', 'team': ply.team, 'cards': ply.hand, 'board': self.board}
					return status

				else:
					status = {'action': 'waiting-for-players', 'team': ply.team}

		return status