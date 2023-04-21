function loadImage(src){
	let img = new Image();
	img.src = src;

	img.addEventListener('load', () => {
		img.loaded = true;
	})

	return img;
}

const assets = {

	images: {
		background: [
			loadImage("static/images/back_0.png"),		
	 		loadImage("static/images/back_1.png"),
			],

		board: loadImage("static/images/board.png"),
	 
		cards: [
			loadImage("static/images/cards_0.png"),
			loadImage("static/images/cards_1.png"),
			loadImage("static/images/cards_2.png"),
			loadImage("static/images/cards_3.png"),
			loadImage("static/images/cards_4.png"),
			loadImage("static/images/cards_5.png"),
			loadImage("static/images/cards_6.png"),
			loadImage("static/images/cards_7.png"),
			loadImage("static/images/cards_8.png"),
			loadImage("static/images/cards_9.png"),
			loadImage("static/images/cards_10.png"),
			loadImage("static/images/cards_11.png"),
			loadImage("static/images/cards_12.png"),
			loadImage("static/images/cards_13.png")
			],

		text: [
			loadImage("static/images/text_0.png"),
			loadImage("static/images/text_1.png"),
			loadImage("static/images/text_2.png")
			]
	}
};