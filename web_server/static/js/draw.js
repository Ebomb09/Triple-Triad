const canvas = document.getElementById("draw");
const ctx = canvas.getContext("2d");

function fillRect(style, x, y, w, h){
	ctx.fillStyle = style;
	ctx.fillRect(x, y, w, h);
}

function drawCard(card, team, x, y, width, height){

	if(card.image != -1){
		let offsetX = 3;
		let offsetY = 3;
		let frameWidth = 186;
		let frameHeight = 186;
		let frameSpacingWidth = 5;
		let frameSpacingHeight = 6;

		if (team == 0)
			fillRect('brown', x, y, width, height);
		else
			fillRect('blue', x, y, width, height);

		ctx.drawImage(assets.images.cards[card.image], 
			offsetX + card.x * (frameWidth + frameSpacingWidth), 
			offsetY + card.y * (frameHeight + frameSpacingHeight), 
			frameWidth, 
			frameHeight, 
			x, 
			y, 
			width, 
			height);

		// Draw Number Identifiers on cards
		ctx.drawImage(assets.images.text[0],
			card.top * 32, 0,
			32, 32,
			x + 16, y,
			32, 32
			);

		ctx.drawImage(assets.images.text[0],
			card.right * 32, 0,
			32, 32,
			x+32, y+24,
			32, 32
			);

		ctx.drawImage(assets.images.text[0],
			card.bottom * 32, 0,
			32, 32,
			x+16, y+48,
			32, 32
			);

		ctx.drawImage(assets.images.text[0],
			card.left * 32, 0,
			32, 32,
			x, y+24,
			32, 32
			);
	}
}

function drawWinner(){
	ctx.drawImage(assets.images.text[1],
		0, 0,
		2502, 500,
		0, 200,
		800, 170
		);
}

function drawLoser(){
	ctx.drawImage(assets.images.text[1],
		0, 500,
		2502, 500,
		0, 200,
		800, 170
		);
}