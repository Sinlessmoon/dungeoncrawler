var WIDTH = 672;
var HEIGHT = 672;
var LEVEL_W = 61;
var LEVEL_H = 61;
var FPS = 60;

var canvas, ctx;
var keyboard;

var room;

var player;
var monsters = [];
var monstersToSpawn = 10;

var update_delay = 0.5 * FPS;
var update_current = update_delay;

function init() {
	keyboard = new Keyboard();
	window.onkeydown = keyboard.keydown;
	window.onkeyup = keyboard.keyup;

	// TODO: Initialize the game (load graphics, etc.)
	Content.add_image("floor", "./image/floor.png");
	Content.add_image("wall", "./image/wall.png");
	Content.add_image("door", "./image/door.png");
	Content.add_image("player", "./image/player.png");
	Content.add_image("monster", "./image/monster.png");
	Content.finalize();

	room = new DungeonFloor(LEVEL_W, LEVEL_H, 500);

	var start_tile = room.tiles[0];
	for(var i = 0; i < room.tiles.length; i++) {
		if(!room.tiles[i].solid) {
			start_tile = room.tiles[i];
			break;
		}
	}

	var monsterGen = new MonsterGenerator(room, monstersToSpawn, ctx, Content.monster);
	monsters = monsterGen.generate();

	player = new Player(start_tile, Content.player);
	start_tile.apply_light(1, "rgba(0, 0, 0, 1)", "center", 1);
}

function main() {
	update();
	draw();
}

function update() {
	keyboard.update();

	player.update();

	if(update_current <= 0) {
		// TODO: Update logic
		for(var i = 0; i < monsters.length; i++) {
			monsters[i].update();
		}

		update_current = update_delay;
	} else {
		update_current--;
	}
}

function draw() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, WIDTH, HEIGHT);

	// Draw Game Objects
	ctx.save();
	ctx.translate(player.camera.offsetX, player.camera.offsetY);

	// Tiles and shadow mask
	var shadows = document.createElement('canvas');
	shadows.width = LEVEL_W*32;
	shadows.height = LEVEL_H*32;
	var sctx = shadows.getContext('2d');
	for(var i = 0; i < room.tiles.length; i++) {
		room.tiles[i].draw(ctx, sctx);
	}

	for(var i = 0; i < monsters.length; i++){
		monsters[i].draw(ctx);
	}

	player.draw(ctx);
	ctx.drawImage(shadows, 0, 0);
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

	init();
};

function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(num, min, max) {
	return Math.min(Math.max(num, min), max);
}