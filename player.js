function Player(tile, image) {
	var self = this;

	this.tile = tile;
	this.image = image;

	this.camera = {
		offsetX:-(clamp(self.tile.dx - 320, 0, (LEVEL_W*32) - WIDTH)),
		offsetY:-(clamp(self.tile.dy - 320, 0, (LEVEL_H*32) - HEIGHT)),
		update:function() {
			this.offsetX = -(clamp(self.tile.dx - 320, 0, (LEVEL_W*32) - WIDTH));
			this.offsetY = -(clamp(self.tile.dy - 320, 0, (LEVEL_H*32) - HEIGHT));

			if(this.offsetX > 0) this.offsetX = 0;
			if(this.offsetY > 0) this.offsetY = 0;
		}
	};

	this.update = function() {

	};

	this.draw = function(ctx) {
		ctx.drawImage(self.image, self.tile.dx, self.tile.dy);
	};

	this.moveUp = function() {
		if(self.tile.up != null && !self.tile.up.solid) {
			self.tile = self.tile.up;
			self.camera.update();
		}
	};

	this.moveDown = function() {
		if(self.tile.down != null && !self.tile.down.solid) {
			self.tile = self.tile.down;
			self.camera.update();
		}
	};

	this.moveLeft = function() {
		if(self.tile.left != null && !self.tile.left.solid) {
			self.tile = self.tile.left;
			self.camera.update();
		}
	};

	this.moveRight = function() {
		if(self.tile.right != null && !self.tile.right.solid) {
			self.tile = self.tile.right;
			self.camera.update();
		}
	};
}