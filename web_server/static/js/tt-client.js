class tt_client{
	#ws;
	#code;
	#callbacks;

	constructor(url, onopen){
		this.#ws = new WebSocket(url);
		this.#ws.onopen = onopen;

		this.#callbacks = {};

		// Parse response message
		this.#ws.onmessage = (event) => {
			let json = JSON.parse(event.data)

			switch(json.response){

				case "list-games":
					this.doCallback("list" ,json.games)
					break;

				case "create-game": 
					this.doCallback("create", json.code);
					break;

				case "join-game":
					this.#code = json.code;
					this.doCallback("join", json.code);
					break;

				case "status-game":
					this.doCallback("status", json.status);
					break;

				case "update-game":
					this.doCallback("update", json.status);
					break;
			}		
		};
	}


	doCallback(name, ...args){
		let callback = this.#callbacks[name];

		// Generic checker to do callback functions
		if(callback !== undefined)
			callback(...args);

		this.#callbacks[name] = undefined;
	}


	listGames(callback) {
		this.#callbacks["list"] = callback;
		this.#ws.send(JSON.stringify({method: "list-games"}));
	}


	createGame(callback){
		this.#callbacks["create"] = callback;
		this.#ws.send(JSON.stringify({method: "create-game"}));
	}


	joinGame(code, name, callback){
		this.#callbacks["join"] = callback;
		this.#ws.send(JSON.stringify({method: 'join-game', code: code, name: name}));
	}


	statusGame(callback){
		this.#callbacks["status"] = callback;
		this.#ws.send(JSON.stringify({method: 'status-game', code: this.#code}));
	}


	updateGame(card, x, y, callback){
		this.#callbacks["update"] = callback;
		this.#ws.send(JSON.stringify({method: 'update-game', code: this.#code, card: card, x: x, y: y}));
	}
}

