function Keyboard() {
	var self = this;
	
	this.pressed = [];

	this.state = [];

	this.update = function(e) {
		self.state = self.pressed;
	};

	this.keydown = function(e) {
		self.pressed[e.which] = true;
	};

	this.keyup = function(e) {
		self.pressed[e.which] = false;
	};

	this.IsKeyDown = function(key) {
		return self.state[key];
	};

	this.IsKeyUp = function(key) {
		return !self.state[key];
	};
}

this.Keys = {
	Up:38,
	Down:40,
	Left:37,
	Right:39
};