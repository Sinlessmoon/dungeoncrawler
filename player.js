function Player(tile, image) {
	var self = this;

	this.tile = tile;
	this.image = image;

	this.update = function() {

	};

	this.draw = function(ctx) {
		ctx.drawImage(self.image, self.tile.x, self.tile.y);
	};

	this.moveUp = function() {
		if(self.tile.up != null && !self.tile.up.solid) {
			self.tile = self.tile.up;
		}
	};

	this.moveDown = function() {
		if(self.tile.down != null && !self.tile.down.solid) {
			self.tile = self.tile.down;
		}
	};

	this.moveLeft = function() {
		if(self.tile.left != null && !self.tile.left.solid) {
			self.tile = self.tile.left;
		}
	};

	this.moveRight = function() {
		if(self.tile.right != null && !self.tile.right.solid) {
			self.tile = self.tile.right;
		}
	};
}