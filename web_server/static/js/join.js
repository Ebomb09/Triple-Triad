let client = new tt_client("ws://192.168.50.50:5001", onopen);
let time = Date.now();

const game = {
	action: "none",
	team: -1,
	cards: [],
	board: [],

	input: {
		mouse: { x: 0, y: 0, click: false, selected: -1}
	}
};

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

function onopen(){
	const params = new URLSearchParams(location.search);
	let code = params.get("code");
	let name = prompt("Enter your name");
	client.joinGame(code, name);
	gameLoop();
}

function onstatus(){

	if(client.status.action !== undefined)
		game.action = client.status.action;	

	if(client.status.team !== undefined)
		game.team = client.status.team;

	if(client.status.cards !== undefined)
		game.cards = client.status.cards;

	if(client.status.board !== undefined)
		game.board = client.status.board;
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
	{
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
				client.updateGame(game.input.mouse.selected, selection.x, selection.y);
				game.board[selection.x][selection.y].card = game.cards[game.input.mouse.selected];
				game.cards.splice(game.input.mouse.selected, 1);
			}
			game.input.mouse.selected = -1;
		}
	}

	// Draw hand
	{
		let offsetX = 633;
		let offsetY = 40; 
		let width = 133;
		let height = 173;

		let cards = game.cards;
		let selection = -1;

		for(let i = 0; i < cards.length; i ++){
			let rect = {
				x: offsetX,
				y: offsetY + i * height / 2,
				w: width,
				h: height
			};

			if(game.input.mouse.selected != i)
				drawCard(cards[i], game.team, rect.x, rect.y, rect.w, rect.h);

			// Check if mouse is trying to select a card
			if(game.input.mouse.selected == -1){

				if(inRect(game.input.mouse, rect))
					selection = i;
			}
		}

		// Make selection from hand
		if (game.input.mouse.click && selection != -1)
			game.input.mouse.selected = selection;
	}

	// Draw selected card
	if (game.input.mouse.selected != -1){
		let width = 133;
		let height = 173;

		let card = game.cards[game.input.mouse.selected];

		drawCard(card, game.team, game.input.mouse.x - width/2, game.input.mouse.y - height/2, width, height);		
	}

	if (game.action == 'loss')
		drawLoser();
	if (game.action == 'win')
		drawWinner();

	// Update status of the game on a 3 second interval
	if(Date.now() - time > 3000){
		time = Date.now();
		client.statusGame(onstatus);
	}

	requestAnimationFrame(gameLoop);
}
