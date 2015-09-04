function DungeonGenerator(width, height, room_density, ctx) {
	var self = this;

	this.width = width;
	this.height = height;
	this.density = room_density;

	this.tiles = [];
	this.meta_grid = [];
	this.rooms = [];

	this.visited = [];
	this.walls = [];

	this.ctx = ctx;

	this.generate = function() {
		self.rooms = [];

		self.fill();

		var cur_density = self.density;
		while(cur_density > 0) {
			if(self.carve_room(rand(1, self.width - 1), rand(1, self.height - 1), rand(4, 10), rand(4, 10), self.width, self.height)) {
				cur_density = self.density;
			} else {
				cur_density--;
			}
		}

		self.find_visited();
		self.fill_passages(self.width, self.height);

		return self.tiles;
	};

	this.fill = function() {
		for(var y = 0; y < self.height; y++) {
			for(var x = 0; x < self.width; x++) {
				self.tiles[x + (y * self.width)] = new Tile(x, y, Content.wall, true);

				if(x == 0 || x == self.width - 1 || y == 0 || y == self.height - 1) {
					self.tiles[x + (y * self.width)].visited = true;
				}

				if(x > 0) {
					self.tiles[x + (y * self.width)].left = self.tiles[(x - 1) + (y * self.width)];
					self.tiles[x + (y * self.width)].left.right = self.tiles[x + (y * self.width)];
				}

				if(y > 0) {
					self.tiles[x + (y * self.width)].up = self.tiles[x + ((y - 1) * self.width)];
					self.tiles[x + (y * self.width)].up.down = self.tiles[x + (y * self.width)];
				}
			}
		}

		for(var y = 1, my = 0; y < self.height; y += 2, my++) {
			for(var x = 1, mx = 0; x < self.height; x += 2, mx++) {
				var tile = self.tiles[x + (y * self.width)];
				self.meta_grid[mx + (my*(self.width/2))] = new MetaTile(tile, tile.left, tile.right, tile.up, tile.down);
				if(mx != 0) self.meta_grid[mx + (my*(self.width/2))].adjacent.left = self.meta_grid[(mx - 1) + (my*(self.width/2))];
				if(my != 0) self.meta_grid[mx + (my*(self.width/2))].adjacent.left = self.meta_grid[mx + ((my-1)*(self.width/2))];
			}
		}
	};

	this.carve_room = function(rx, ry, rw, rh, lw, lh) {
		var r = new Room(rx, ry, rw, rh);

		// Scan
		if(r.out_of_bounds(lw, lh)) {
			return false;;
		}
		for(var i = 0; i < self.rooms.length; i++) {
			if(self.rooms[i].overlaps(r)) {
				return false;
			}
		}

		for(var i = 0; i < self.rooms.length; i++) {
			if(!self.rooms[i].odd_distance(r)) {
				return false;
			}
		}

		// Carve
		self.tiles = r.carve(self.tiles, lw);
		self.rooms.push(r);
		return true;
	};

	this.find_visited = function() {
		for(var i = 0; i < self.tiles.length; i++) {
			if((self.tiles[i].left && !self.tiles[i].left.solid) || (self.tiles[i].right && !self.tiles[i].right.solid) || (self.tiles[i].up && !self.tiles[i].up.solid) || (self.tiles[i].down && !self.tiles[i].down.solid) || !self.tiles[i].solid) {
				self.visited.push(self.tiles[i]);
			}
		}
	}

	this.fill_passages = function(lw, lh) {
		var wall = self.tiles[Math.floor(Math.random() * self.tiles.length)];
		while(self.visited.indexOf(wall) != -1) {
			wall = self.tiles[Math.floor(Math.random() * self.tiles.length)];
		}

		self.carve_passage(wall, lw, lh);
	};

	this.carve_passage = function(wall, lw, lh) {
		wall.image = Content.floor;
		wall.solid = false;
		wall.visited = true;

		//self.draw(self.ctx);

		var options = [];
		if(wall.left && !wall.left.visited && wall.left.neighbors() == 3) options.push(wall.left);
		if(wall.right && !wall.right.visited && wall.right.neighbors() == 3) options.push(wall.right);
		if(wall.up && !wall.up.visited && wall.up.neighbors() == 3) options.push(wall.up);
		if(wall.down && !wall.down.visited && wall.down.neighbors() == 3) options.push(wall.down);

		if(options.length > 0) {
			self.walls.push(wall);
			self.carve_passage(options[Math.floor(Math.random() * options.length)], lw, lh);
		} else if(self.walls.length > 0) {
			var last = self.walls[self.walls.length - 1];
			self.walls.pop();
			self.carve_passage(last, lw, lh);
		}
		return;
	}

	this.draw = function(ctx) {
		for(var i = 0; i < self.tiles.length; i++) {
			if(self.tiles[i].solid) {
				ctx.fillStyle = "#333";
			} else {
				ctx.fillStyle = "#666";
			}
			ctx.fillRect(self.tiles[i].dx, self.tiles[i].dy, 32, 32);
		}
	}
}

function Room(x, y, w, h) {
	var self = this;

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.overlaps = function(r) {
		if((self.x >= r.x && self.x <= r.x + r.w) || (r.x >= self.x && r.x <= self.x + self.w) && ((self.y >= r.y && self.y <= r.y + r.h) || (r.y >= self.y && r.y <= self.y + self.h))) {
			return true;
		}
		return false;
	};

	this.odd_distance = function(r) {
		if((self.x >= r.x && self.x <= r.x + r.w) || (r.x >= self.x && r.x <= self.x + self.w)) {
			if(self.y < r.y) {
				if((r.y - (self.y + self.h)) % 2 == 0) return false;
			} else {
				if((self.y - (r.y + r.h)) % 2 == 0) return false;
			}
		}
		if((self.y >= r.y && self.y <= r.y + r.h) || (r.y >= self.y && r.y <= self.y + self.h)) {
			if(self.x < r.x) {
				if((r.x - (self.x + self.w)) % 2 == 0) return false;
			} else {
				if((self.x - (r.x + r.w)) % 2 == 0) return false;
			}
		}
		return true;
	};

	this.out_of_bounds = function(lw, lh) {
		if(self.x < 1 || self.x + self.w > lw - 2 || self.y < 1 || self.y + self.h > lh - 2) {
			return true;
		}
		return false;
	};

	this.carve = function(tiles, width) {
		for(var y = self.y - 1; y < self.y + self.h + 1; y++) {
			for(var x = self.x - 1; x < self.x + self.w + 1; x++) {
				try {
					if(x > self.x - 1 && x < self.x + self.w && y > self.y - 1 && y < self.y + self.h) {
						tiles[x + (y * width)].image = Content.floor;
						tiles[x + (y * width)].solid = false;
					}
					tiles[x + (y * width)].visited = true;
				} catch (e) {
					console.log("ERROR");
				}
			}
		}

		return tiles;
	};
}

function MetaTile(tile, wl, wr, wu, wd) {
	this.tile = tile;

	this.walls = {
		up:wu,
		down:wd,
		left:wl,
		right:wr
	};
	this.adjacent = {
		up:undefined,
		down:undefined,
		left:undefined,
		right:undefined
	};
}