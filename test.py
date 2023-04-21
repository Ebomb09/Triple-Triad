from threading import Thread

from web_server.host import app
from game_server.host import host

myHost = host('192.168.50.50', 5001)

threads = [
	Thread(target=app.run),
	Thread(target=myHost.run)
]

for thread in threads:
	thread.start()

input('Enter to terminate server...\n')
app.stop()
myHost.stop()

for thread in threads:
	thread.join()