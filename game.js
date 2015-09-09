var WIDTH = 672;
var HEIGHT = 672;
var LEVEL_W = 61;
var LEVEL_H = 61;
var FPS = 60;

var canvas, ctx;

var floor;


var player;

function init() {
	// TODO: Initialize the game (load graphics, etc.)
	Content.add_image("floor", "./image/floor.png");
	Content.add_image("wall", "./image/wall.png");
	Content.add_image("door", "./image/door.png");
	Content.add_image("player", "./image/player.png");
	Content.add_image("monster", "./image/monster.png");
	Content.finalize();

	floor = new DungeonFloor(LEVEL_W, LEVEL_H, 500);

	var start_tile = floor.tiles[0];
	for(var i = 0; i < floor.tiles.length; i++) {
		if(!floor.tiles[i].solid) {
			start_tile = floor.tiles[i];
			break;
		}
	}
	player = new Player(start_tile, Content.player);
}

function main() {
	update();
	draw();
}

function update() {
	// TODO: Update logic
}

//This could most likely be moved to update.
function tickUpdate() {

	for(var i = 0; i < monsters.length; i++) {

		monsters[i].update();
	}

}

function draw() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	// Draw Game Objects
	ctx.save();
	ctx.translate(player.camera.offsetX, player.camera.offsetY);
	for(var i = 0; i < floor.tiles.length; i++) {
		floor.tiles[i].draw(ctx);
	}

	for(var o = 0; o < monsters.length; o++){
		monsters[o].draw(ctx);
	}
	player.draw(ctx);
	ctx.restore();

	// Draw UI
}

window.onload = function() {
	canvas = document.getElementById("game");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.style.width = "640px";
	canvas.style.height = "640px";
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

	window.setInterval(function () {tickUpdate()}, 1500);

	init();
};

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}