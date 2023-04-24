const assets = {

	images: {
		background: loadImage("static/images/back.png"),		

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
			],

		font: loadImage("static/images/font.png"),
		fontWidths: [
			[96, 0, 0, 0, 0, 0, 0, 93, 0, 0 ],
			[0, 71, 0, 61, 21, 45, 53, 21, 37, 69 ],
			[0, 47, 69, 53, 69, 45, 53, 37, 89, 61 ],
			[0, 29, 39, 53, 53, 45, 53, 69, 63, 53 ], 
			[0, 33, 0, 45, 53, 29, 53, 69, 71, 69 ], 
			[0, 49, 0, 61, 53, 29, 53, 63, 53, 77 ], 
			[0, 75, 61, 61, 53, 37, 53, 21, 69, 51 ], 
			[0, 45, 55, 69, 27, 37, 29, 45, 0, 69 ], 
			[0, 45, 21, 49, 53, 61, 29, 69, 53, 95 ], 
			[0, 53, 61, 55, 29, 61, 37, 79, 77, 69 ], 
			[0, 63, 53, 49, 53, 61, 37, 37, 45, 77 ], 
			[0, 63, 51, 51, 51, 59, 51, 51, 27, 75 ], 
			[59, 19, 59, 51, 51, 59, 51, 61, 71, 67 ],
			[35, 43, 59, 51, 43, 59, 51, 25, 39, 67 ],
			[51, 25, 27, 51, 59, 59, 51, 57, 71, 67 ],
			[55, 43, 51, 51, 45, 59, 51, 0, 75, 67 ], 
			[51, 27, 29, 27, 57, 59, 51, 45, 75, 67 ],
			[55, 0, 19, 51, 57, 63, 51, 81, 83, 0 ], 
			[55, 0, 67, 51, 57, 51, 51, 0, 67, 0 ], 
			[43, 63, 59, 19, 59, 51, 51, 39, 61, 0 ], 
			[55, 0, 59, 35, 19, 51, 67, 29, 67, 0 ], 
			[59, 0, 55, 43, 47, 51, 63, 27, 43, 0 ]
			]
	},

	music: [
		new Audio("static/music/Shuffle or Boogie - Final Fantasy VIII.mp4")
	]
};

function loadImage(src){
	let img = new Image();
	img.src = src;

	img.addEventListener('load', () => {
		img.loaded = true;
	})

	return img;
}

/*
function getFontWidths(){

	const tempCanvas = document.createElement("canvas");
	const tempCTX = tempCanvas.getContext("2d");

	for(let x = 0; x < assets.images.font.width/96; x ++){
		let str = "";

		for(let y = 0; y < assets.images.font.height/96; y ++){

			tempCTX.clearRect(0, 0, 96, 96);

			tempCTX.drawImage(
				assets.images.font,
				x * 96,
				y * 96,
				96,
				96,
				0,
				0,
				96,
				96
				);

			let charWidth = 0;

			for(let i = 1; i < 96; i += 1){
				let pixels = tempCTX.getImageData(96 - i, 48, 1, 1).data;

				// Find first occurence of non-alpha
				for(let u = 0; u < pixels.length; u += 1){

					if(pixels[u] > 0){
						charWidth = 96-i;
						break;
					}
				}

				if(charWidth > 0)
					break;
			}

			str += charWidth + ", ";
		}
		console.log(`,[${str}]`);
	}

	tempCanvas.remove();
}
*/