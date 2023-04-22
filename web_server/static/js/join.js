let client = new tt_client(url, onOpen);
let time = Date.now();

const game = {
	action: "none",

	players: [ { name: "", team: -1, hand: [] }, ],

	board: [],

	input: {
		mouse: { x: 0, y: 0, click: false, selected: -1}
	}
};

/*
	Input Event Listeners
*/
canvas.addEventListener('mousemove', (event) => {
	game.input.mouse.x = event.offsetX;
	game.input.mouse.y = event.offsetY;
});

canvas.addEventListener('mousedown', (event) => {
	game.input.mouse.click = true;
});

canvas.addEventListener('mouseup', (event) => {
	game.input.mouse.click = false;
});

canvas.addEventListener('touchmove', (event) => {
	game.input.mouse.x = event.touches[0].clientX;
	game.input.mouse.y = event.touches[0].clientY;
	console.log(game.input.mouse);
});

canvas.addEventListener('touchstart', (event) => {
	game.input.mouse.click = true;	
});

canvas.addEventListener('touchend', (event) => {
	game.input.mouse.click = false;
});


function onOpen(){
	const params = new URLSearchParams(location.search);
	let code = params.get("code");
	let name = prompt("Enter your name");
	client.joinGame(code, name, gameLoop);
}

function onStatus(status){

	if(status.action !== undefined)
		game.action = status.action;	

	if(status.players !== undefined)
		game.players = status.players;

	if(status.board !== undefined)
		game.board = status.board;
}

function inRect(pos, rect){
	return (pos.x > rect.x && pos.x < rect.x + rect.w) && (pos.y > rect.y && pos.y < rect.y + rect.h);
}

function gameLoop(){

	// Clear screen
	fillRect("black", 0, 0, canvas.width, canvas.height);

	ctx.drawImage(assets.images.board, 0, 0, 800, 600);

	// Only allow selections while it's your turn
	if(game.action != "turn")
		game.input.mouse.selected = -1;

	else
		// Don't update from status while selections are being made
		if(game.input.mouse.selected != -1)
			time = Date.now();

	// Draw game board
	if(game.players.length == 2){
		let self = game.players[0];
		let other = game.players[1];

		let offsetX = 200;
		let offsetY = 40;
		let width = 133;
		let height = 173;

		let selection = {x: -1, y: -1};

		for(let x = 0; x < game.board.length; x ++){
			for(let y = 0; y < game.board[x].length; y ++){
				let rect = {
					x: offsetX + x*width,
					y: offsetY + y*height,
					w: width,
					h: height
				};

				// Draw card from board
				if(game.board[x][y].card != null)
					drawCard(game.board[x][y].card, game.board[x][y].team, rect.x, rect.y, rect.w, rect.h);
				
				else{

					// Check if mouse is trying to select a card
					if(game.input.mouse.selected != -1){

						if(inRect(game.input.mouse, rect))
							selection = {x: x, y: y};
					}
				}
			}
		}

		// Make placement
		if(!game.input.mouse.click){

			if(selection.x != -1){
				client.updateGame(game.input.mouse.selected, selection.x, selection.y, onStatus);
				game.board[selection.x][selection.y].card = self.hand[game.input.mouse.selected];
				self.hand.splice(game.input.mouse.selected, 1);
			}
			game.input.mouse.selected = -1;
		}

		// Draw hand
		offsetX = 633;
		offsetY = 40; 
		width = 133;
		height = 173;

		selection = -1;

		for(let i = 0; i < self.hand.length; i ++){
			let rect = {
				x: offsetX,
				y: offsetY + i * height / 2,
				w: width,
				h: height
			};

			if(game.input.mouse.selected != i)
				drawCard(self.hand[i], self.team, rect.x, rect.y, rect.w, rect.h);

			// Check if mouse is trying to select a card
			if(game.input.mouse.selected == -1){

				if(inRect(game.input.mouse, rect))
					selection = i;
			}
		}

		// Make selection from hand
		if (game.input.mouse.click && selection != -1)
			game.input.mouse.selected = selection;
	

		// Draw selected card
		if (game.input.mouse.selected != -1){
			let width = 133;
			let height = 173;

			let card = self.hand[game.input.mouse.selected];

			drawCard(card, self.team, game.input.mouse.x - width/2, game.input.mouse.y - height/2, width, height);		
		}
	}

	// Display what the player can do 
	switch(game.action){

		case "spectating":
			ctx.font = "32px sans-serif";
			ctx.fillStyle = "lightgrey";
			ctx.fillText("Spectating", 0, 32);
			break;			

		case "waiting-for-players":
			ctx.font = "32px sans-serif";
			ctx.fillStyle = "lightgrey";
			ctx.fillText("Waiting for Players to Join...", 0, 32);
			break;

		case "waiting":
			ctx.font = "32px sans-serif";
			ctx.fillStyle = "lightgrey";
			ctx.fillText("Waiting for Opponents Move...", 0, 32);
			break;

		case "turn":
			ctx.font = "32px sans-serif";
			ctx.fillStyle = "lightgrey";
			ctx.fillText("Your Turn!", 0, 32);
			break;

		case "win":
			drawWinner();
			break;

		case "loss":
			drawLoser();
			break;
	}	
		

	// Update status of the game on a 3 second interval
	if(Date.now() - time > 3000){
		time = Date.now();
		client.statusGame(onStatus);
	}

	requestAnimationFrame(gameLoop);
}
