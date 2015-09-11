function Player(tile, image) {
	var self = this;

	this.tile = tile;
	this.target = tile;
	this.image = image;

	this.x = tile.dx;
	this.y = tile.dy;
	this.speed = 8;

	this.camera = {
		offsetX:-(clamp(self.x - 320, 0, (LEVEL_W*32) - WIDTH)),
		offsetY:-(clamp(self.y - 320, 0, (LEVEL_H*32) - HEIGHT)),
		update:function() {
			this.offsetX = -(clamp(self.x - 320, 0, (LEVEL_W*32) - WIDTH));
			this.offsetY = -(clamp(self.y - 320, 0, (LEVEL_H*32) - HEIGHT));

			if(this.offsetX > 0) this.offsetX = 0;
			if(this.offsetY > 0) this.offsetY = 0;
		}
	};

	this.update = function() {
		if(self.tile != self.target) {
			if(self.target.dx != self.x) {
				if(self.x < self.target.dx) self.x += 32 / self.speed;
				else if(self.x > self.target.dx) self.x -= 32 / self.speed;
			} else {
				if(self.y < self.target.dy) self.y += 32 / self.speed;
				else if(self.y > self.target.dy) self.y -= 32 / self.speed;
			}
			self.camera.update();

			if(self.x == self.target.dx && self.y == self.target.dy) self.tile = self.target;
			for(var i = 0; i < room.tiles.length; i++) {
				if(room.tiles[i].lit) room.tiles[i].light = 0.3;
				else room.tiles[i].light = 0;
				room.tiles[i].light_color = "rgba(0, 0, 0, 1)";
			}
			self.tile.apply_light(1, "rgba(0, 0, 0, 1)", "center", 1);
		} else {
			if(keyboard.IsKeyDown(Keys.Left)) {
				self.moveLeft();
			} else if(keyboard.IsKeyDown(Keys.Right)) {
				self.moveRight();
			} else if(keyboard.IsKeyDown(Keys.Up)) {
				self.moveUp();
			} else if(keyboard.IsKeyDown(Keys.Down)) {
				self.moveDown();
			}
		}
	};

	this.draw = function(ctx) {
		ctx.drawImage(self.image, self.x, self.y);
	};

	this.moveUp = function() {
		if(self.tile.up != null && !self.tile.up.solid) {
			self.target = self.tile.up;
		}
	};

	this.moveDown = function() {
		if(self.tile.down != null && !self.tile.down.solid) {
			self.target = self.tile.down;
		}
	};

	this.moveLeft = function() {
		if(self.tile.left != null && !self.tile.left.solid) {
			self.target = self.tile.left;
		}
	};

	this.moveRight = function() {
		if(self.tile.right != null && !self.tile.right.solid) {
			self.target = self.tile.right;
		}
	};
}