const canvas = document.getElementById("draw");

if(canvas == null)
	throw new Error("Draw canvas was not found!");

const ctx = canvas.getContext("2d");

// Set size of canvas to the page
function onResize(){
	canvas.width = canvas.parentElement.clientWidth;
	canvas.height = canvas.width * 3/4;

	ctx.scaleX = (canvas.width) / 800;
	ctx.scaleY = (canvas.height) / 600;

	ctx.scale(ctx.scaleX, ctx.scaleY);
}
window.addEventListener("resize", onResize);
onResize();

function fillRect(style, x, y, w, h){
	ctx.fillStyle = style;
	ctx.fillRect(x, y, w, h);
}

function drawCard(card, team, x, y, width, height){

	if(card != null){
		let offsetX = 3;
		let offsetY = 3;
		let frameWidth = 186;
		let frameHeight = 186;
		let frameSpacingWidth = 5;
		let frameSpacingHeight = 6;

		let gradient = ctx.createLinearGradient(x, y, x, y + height);

		if (team == 0){
			gradient.addColorStop(0, "rgb(248, 177, 207)");
			gradient.addColorStop(1, "rgb(141, 47, 63)");

		}else{
			gradient.addColorStop(0, "rgb(178, 209, 240)");
			gradient.addColorStop(1, "rgb(54, 69, 138)");
		}

		// Draw background
		fillRect(gradient, x, y, width, height);

		// Draw card
		ctx.drawImage(assets.images.cards[card.image], 
			offsetX + card.x * (frameWidth + frameSpacingWidth), 
			offsetY + card.y * (frameHeight + frameSpacingHeight), 
			frameWidth, 
			frameHeight, 
			x, 
			y, 
			width, 
			height);

		// Draw Element
		let drawElement = true;

		switch(card.type){

			case "FIRE":
				offsetX = 0;
				offsetY = 32;
				break;

			case "ICE":
				offsetX = 256;
				offsetY = 32;
				break;

			case "LIGHTNING":
				offsetX = 512;
				offsetY = 32;
				break;

			case "EARTH":
				offsetX = 0;
				offsetY = 96;
				break;

			case "WIND":
				offsetX = 256;
				offsetY = 96;
				break;

			case "WATER":
				offsetX = 512;
				offsetY = 96;
				break;

			case "HOLY":
				offsetX = 0;
				offsetY = 160;
				break;

			case "POISON":
				offsetX = 256;
				offsetY = 160;
				break;

			default:
				drawElement = false;
				break;
		}

		if(drawElement){
			//let frame = Math.floor((Date.now() % 500) / 125);

			ctx.drawImage(
				assets.images.text[0],
				offsetX, 
				offsetY, 
				64, 
				64,
				x + width-56, 
				y - 8,
				64,
				64
				);
		}

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