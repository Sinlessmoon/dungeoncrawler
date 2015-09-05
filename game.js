var WIDTH = 1920;
var HEIGHT = 1920;
var FPS = 60;

var canvas, ctx;

var tiles = [];

var player;

function init() {
	// TODO: Initialize the game (load graphics, etc.)
	Content.add_image("floor", "./image/floor.png");
	Content.add_image("wall", "./image/wall.png");
	Content.add_image("door", "./image/door.png");
	Content.add_image("player", "./image/player.png");
	Content.finalize();

	var generator = new DungeonGenerator(60, 60, 10000, ctx);
	tiles = generator.generate();

	player = new Player(tiles[1+(1*60)], Content.player);
}

function main() {
	update();
	draw();
}

function update() {
	// TODO: Update logic
}

function draw() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	// TODO: More drawing logic
	for(var i = 0; i < tiles.length; i++) {
		tiles[i].draw(ctx);
	}
	player.draw(ctx);
}

window.onload = function() {
	canvas = document.getElementById("game");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.width = "900px";
	canvas.style.height = "900px";
	ctx = canvas.getContext('2d');

	window.onkeydown = function(e) {
		switch(e.which) {
			case 37:
				player.moveLeft();
				break;
			case 38:
				player.moveUp();
				break;
			case 39:
				player.moveRight();
				break;
			case 40:
				player.moveDown();
				break;
		}
	};

	init();
};

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}