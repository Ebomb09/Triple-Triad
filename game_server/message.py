import json

from websockets.exceptions import WebSocketException


def receive(ws):
	"""
	Wait for a JSON message from a websocket ws. If 
	fail to get one return that it should be closed
	"""

	try:
		msg = ws.recv(3)
		data = json.loads(msg)
		return data

	except WebSocketException as e:
		#print(e)
		return {'method': 'close'}

	except TimeoutError:
		return {}


def send(ws, data):
	"""
	Send a JSON message to a websocket ws. If
	fail to send log reason.
	"""

	try:
		msg = json.dumps(data, default=vars)
		ws.send(msg)

	except WebSocketException as e:
		print(e)