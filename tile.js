function Tile(x, y, image, solid, transparent) {
	var self = this;

	this.x = x;
	this.y = y;
	this.dx = x*32;
	this.dy = y*32;
	this.image = image;

	this.solid = solid;
	this.transparent = transparent;
	this.light = 0.0;
	this.light_color = "rgba(0, 0, 0, 1)";
	this.lit = false;

	this.up = null;
	this.down = null;
	this.left = null;
	this.right = null;

	this.visited = false;

	this.update = function() {

	};

	this.draw = function(ctx, sctx) {
		ctx.drawImage(self.image, self.dx, self.dy);

		sctx.save();
		sctx.globalAlpha = 1 - self.light;
		sctx.fillStyle = self.light_color;
		sctx.fillRect(self.dx, self.dy, 32, 32);
		sctx.restore();
	};

	this.neighbors = function() {
		var ret = 0;
		if(self.up && self.up.solid) ret++;
		if(self.down && self.down.solid) ret++;
		if(self.left && self.left.solid) ret++;
		if(self.right && self.right.solid) ret++;
		return ret;
	};

	this.clear_light = function() {
		if(self.light == 0) return;

		if(self.down) self.down.clear_light();
		if(self.right) self.right.clear_light();
	};

	this.apply_light = function(light, color, source) {
		if(light <= 0.1 || light < self.light) return;

		self.light_color = color;
		self.light = light;
		light /= 1.3;

		if(self.right && self.right.transparent) self.right.apply_light(light, color, "left");
		if(self.up && self.up.transparent) self.up.apply_light(light, color, "down");
		if(self.left && self.left.transparent) self.left.apply_light(light, color, "right");
		if(self.down && self.down.transparent) self.down.apply_light(light, color, "up");

		/*switch(source) {
			case "left":
				if(self.right && self.right.transparent) self.right.apply_light(light, color, "left");
				if(self.up && self.up.transparent) self.up.apply_light(light, color, "down");
				break;
			case "right":
				if(self.left && self.left.transparent) self.left.apply_light(light, color, "right");
				if(self.down && self.down.transparent) self.down.apply_light(light, color, "up");
				break;
			case "up":
				if(self.up && self.up.transparent) self.up.apply_light(light, color, "down");
				if(self.right && self.right.transparent) self.right.apply_light(light, color, "left");
				break;
			case "down":
				if(self.down && self.down.transparent) self.down.apply_light(light, color, "up");
				if(self.left && self.left.transparent) self.left.apply_light(light, color, "right");
				break;
			case "center":
				if(self.up && self.up.transparent) self.up.apply_light(light, color, "down");
				if(self.down && self.down.transparent) self.down.apply_light(light, color, "up");
				if(self.left && self.left.transparent) self.left.apply_light(light, color, "right");
				if(self.right && self.right.transparent) self.right.apply_light(light, color, "left");
				break;
		}*/
	};
}