from dataclasses import dataclass, asdict

@dataclass
class card:
	image:	int
	x:		int
	y:		int
	name:	str
	type:	str
	top:	int
	right:	int
	bottom:	int
	left:	int


	def serialize(self):
		return asdict(self)


def load_cards(csvfile):
	cards = []

	with open(csvfile) as file:
		# Ignore first declarative line
		file.readline()

		for line in file.readlines():
			atr = line.split(',')

			# Try adding card based on the csv values
			if len(atr) == 9:

				try:
					add = card(
						int(atr[0]), 
						int(atr[1]), 
						int(atr[2]), 
						atr[3], 
						atr[4], 
						int(atr[5]),
						int(atr[6]),
						int(atr[7]),
						int(atr[8])
						)
					cards.append(add)

				except ValueError:
					pass

	return cards