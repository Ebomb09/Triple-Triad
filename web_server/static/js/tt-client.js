class tt_client{
	#ws;
	#code;
	status = {};
	#status_callback;

	constructor(url, onopen){
		this.#ws = new WebSocket(url);
		this.#ws.onopen = onopen;

		// Parse response message
		this.#ws.onmessage = (event) => {
			let json = JSON.parse(event.data)

			switch(json.response){

				case "create-game": 
					location.href = `join?code=${json.code}`
					break;

				case "list-games":
					const table = document.getElementById("loaded-games");
					table.innerHTML = "";

					json.games.forEach((game) => {
						table.innerHTML += `
							<tr>
								<td> <a href="join?code=${game.code}"> ${game.code} </a> </td>
								<td> ${game.players} </td>
							</tr>
						`;
					});
					break;

				case "status-game":
					this.status = json;

					if(this.#status_callback !== undefined)
						this.#status_callback();
					break;
			}		
		};
	}


	getGames() {
		this.#ws.send(JSON.stringify({method: "list-games"}));
	}


	createGame(){
		this.#ws.send(JSON.stringify({method: "create-game"}));
	}


	joinGame(code, name){
		this.#code = code;
		this.#ws.send(JSON.stringify({method: 'join-game', code: code, name: name}));
	}


	statusGame(callback){
		this.#status_callback = callback;
		this.#ws.send(JSON.stringify({method: 'status-game', code: this.#code}));
	}


	updateGame(card, x, y){
		this.#ws.send(JSON.stringify({method: 'update-game', code: this.#code, card: card, x: x, y: y}));
	}
}

