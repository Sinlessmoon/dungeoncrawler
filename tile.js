function Tile(x, y, image, solid) {
	var self = this;

	this.x = x;
	this.y = y;
	this.dx = x*32;
	this.dy = y*32;
	this.image = image;

	this.solid = solid;

	this.up = null;
	this.down = null;
	this.left = null;
	this.right = null;

	this.visited = false;

	this.update = function() {

	};

	this.draw = function(ctx) {
		ctx.drawImage(self.image, self.dx, self.dy);
	};

	this.neighbors = function() {
		var ret = 0;
		if(self.up && self.up.solid) ret++;
		if(self.down && self.down.solid) ret++;
		if(self.left && self.left.solid) ret++;
		if(self.right && self.right.solid) ret++;
		return ret;
	};
}