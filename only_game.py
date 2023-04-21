import os, sys
sys.path.append(os.path.dirname(__file__))

from game_server.host import host

if __name__ == '__main__':
	myHost = host('0.0.0.0', 5001)
	myHost.run()