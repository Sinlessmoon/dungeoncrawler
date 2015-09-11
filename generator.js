function DungeonFloor(width, height, room_density) {
	var self = this;

	this.w = width % 2 == 0 ? width + 1 : width;
	this.h = height % 2 == 0 ? height + 1 : height;
	this.d = room_density;

	this.tiles = [];

	this.generate = function() {
		var sw = Math.floor(self.w / 2);
		var sh = Math.floor(self.h / 2);

		var meta = self.fill_meta(sw, sh);
		meta = self.place_rooms(meta, sw, sh);

		while(!self.level_filled(meta)) {
			var tile = self.scan_unvisited(meta);
			self.carve_hall(tile);
		}
		while(self.connect_rooms(meta));
		while(self.clear_halls(meta));

		self.tiles = self.meta_to_tiles(meta, sw, sh);
	};

	this.fill_meta = function(sw, sh) {
		var meta = [];
		for(var y = 0; y < sh; y++) {
			for(var x = 0; x < sw; x++) {
				// Instantiate MetaTile
				meta[x + (y * sw)] = new MetaTile(x, y);

				// Set Left and Right neighbors
				if(x > 0) {
					meta[x + (y * sw)].nl = meta[(x-1) + (y * sw)];
					meta[x + (y * sw)].nl.nr = meta[x + (y * sw)];
				}

				// Set Up and Down neighbors
				if(y > 0) {
					meta[x + (y * sw)].nu = meta[x + ((y - 1) * sw)];
					meta[x + (y * sw)].nu.nd = meta[x + (y * sw)];
				}
			}
		}
		return meta;
	};

	this.place_rooms = function(meta, sw, sh) {
		var cd = self.d;
		var res = false;

		while(cd > 0) {
			res = self.carve_room(rand(1, sw - 1), rand(1, sh - 1), rand(2, 10), rand(2, 10), meta, sw, sh);
			if(!res) {
				cd--;
			} else {
				meta = res;
				cd = self.d;
			}
		}

		return meta;
	};

	this.carve_room = function(rx, ry, w, h, meta, sw, sh) {
		if(rx + w > sw) return false;
		if(ry + h > sh) return false;

		// Scan
		for(var y = ry; y < ry + h; y++) {
			for(var x = rx; x < rx + w; x++) {
				if(!meta[x + (y*sw)] || !meta[x + (y*sw)].solid) {
					return false;
				}
			}
		}

		// Carve
		for(var y = ry; y < ry + h; y++) {
			for(var x = rx; x < rx + w; x++) {
				meta[x + (y*sw)].solid = false;
				if(x == rx) meta[x + (y*sw)].room_border = true;
				if(x == rx+w-1) meta[x + (y*sw)].room_border = true;
				if(y == ry) meta[x + (y*sw)].room_border = true;
				if(y == ry+h-1) meta[x + (y*sw)].room_border = true;

				if(x > rx) {
					meta[x + (y*sw)].wl = false;
					if(y > ry) {
						meta[x + (y*sw)].wul = false;
					}
					if(y < ry+h-1) {
						meta[x + (y*sw)].wdl = false;
					}
				}
				if(x < rx + w - 1) {
					meta[x + (y*sw)].wr = false;
					if(y > ry) {
						meta[x + (y*sw)].wur = false;
					}
					if(y < ry+h-1) {
						meta[x + (y*sw)].wdr = false;
					}
				}
				if(y > ry) {
					meta[x + (y*sw)].wu = false;
				}
				if(y < ry + h - 1) {
					meta[x + (y*sw)].wd = false;
				}
			}
		}

		return meta;
	};

	this.carve_hall = function(tile, dir) {
		tile.solid = false;

		switch(dir) {
			case "up":
				tile.nu.wd = false;
				tile.wu = false;
				break;
			case "down":
				tile.nd.wu = false;
				tile.wd = false;
				break;
			case "left":
				tile.nl.wr = false;
				tile.wl = false;
				break;
			case "right":
				tile.nr.wl = false;
				tile.wr = false;
				break;
		}

		while(true) {
			var options = [];
			if(tile.nu && tile.nu.solid) options.push({tile:tile.nu, dir:"down"});
			if(tile.nd && tile.nd.solid) options.push({tile:tile.nd, dir:"up"});
			if(tile.nr && tile.nr.solid) options.push({tile:tile.nr, dir:"left"});
			if(tile.nl && tile.nl.solid) options.push({tile:tile.nl, dir:"right"});
			if(options.length == 0) break;

			var index = Math.floor(Math.random() * options.length);
			self.carve_hall(options[index].tile, options[index].dir);
		}
	};

	this.level_filled = function(meta) {
		for(var i = 0; i < meta.length; i++) {
			if(meta[i].solid) return false;
		}
		return true;
	};

	this.scan_unvisited = function(meta) {
		for(var i = 0; i < meta.length; i++) {
			if(meta[i].solid) return meta[i];
		}
		return false;
	};

	this.connect_rooms = function(meta) {
		// Scan Tiles
		var tile = null;
		for(var i = 0; i < meta.length; i++) {
			if(meta[i].room_border) {
				tile = meta[i];
				break;
			}
		}
		if(tile == null) return false;

		self.next_room_tile(tile, rand(0, 10));
		self.clear_room(tile);
		return true;
	};

	this.next_room_tile = function(tile, i) {
		if(i <= 0) {
			// Punch Hole
			if(tile.wu) {
				tile.room_border = false;
				tile.wu = false;
				tile.nu.wd = false;
			} else if(tile.wd) {
				tile.room_border = false;
				tile.wd = false;
				tile.nd.wu = false;
			} else if(tile.wl) {
				tile.room_border = false;
				tile.wl = false;
				tile.nl.wr = false;
			} else if(tile.wr) {
				tile.room_border = false;
				tile.wr = false;
				tile.nr.wl = false;
			}
			return false;
		}

		if(tile.nu && tile.nu.room_border && !tile.wu) if(!self.next_room_tile(tile.nu, i - 1)) return false;
		if(tile.nd && tile.nd.room_border && !tile.wd) if(!self.next_room_tile(tile.nd, i - 1)) return false;
		if(tile.nl && tile.nl.room_border && !tile.wl) if(!self.next_room_tile(tile.nl, i - 1)) return false;
		if(tile.nr && tile.nr.room_border && !tile.wr) if(!self.next_room_tile(tile.nr, i - 1)) return false;
	};

	this.clear_room = function(tile) {
		tile.room_border = false;

		if(tile.nu && tile.nu.room_border && !tile.wu && !tile.nu.wd) self.clear_room(tile.nu);
		if(tile.nd && tile.nd.room_border && !tile.wd && !tile.nd.wu) self.clear_room(tile.nd);
		if(tile.nl && tile.nl.room_border && !tile.wl && !tile.nl.wr) self.clear_room(tile.nl);
		if(tile.nr && tile.nr.room_border && !tile.wr && !tile.nr.wl) self.clear_room(tile.nr);
	};

	this.clear_halls = function(meta) {
		for(var i = 0; i < meta.length; i++) {
			if(meta[i].is_dead_end()) {
				self.clear_hall(meta[i]);
				return true;
			}
		}
		return false;
	};

	this.clear_hall = function(tile) {
		if(tile.is_dead_end()) {
			tile.solid = true;

			if(!tile.wu) {
				tile.nu.wd = true;
				self.clear_hall(tile.nu);
			}
			if(!tile.wd) {
				tile.nd.wu = true;
				self.clear_hall(tile.nd);
			}
			if(!tile.wl) {
				tile.nl.wr = true;
				self.clear_hall(tile.nl);
			}
			if(!tile.wr) {
				tile.nr.wl = true;
				self.clear_hall(tile.nr);
			}

			tile.wu = true;
			tile.wd = true;
			tile.wl = true;
			tile.wr = true;
		}
	};

	this.meta_to_tiles = function(meta, sw, sh) {
		var tiles = [];

		for(var y = 0; y < sh; y++) {
			for(var x = 0; x < sw; x++) {
				var tile = meta[x + (y*sw)];

				var tx = (tile.x * 2) + 1;
				var ty = (tile.y * 2) + 1;

				// Center
				tiles[tx + (ty*self.w)] = new Tile(tx, ty, tile.solid?Content.wall:Content.door, tile.solid, !tile.solid);

				// Right
				tiles[(tx + 1) + (ty*self.w)] = new Tile(tx + 1, ty, tile.wr?Content.wall:Content.door, tile.wr, !tile.wr);
				// Bottom Right
				tiles[(tx + 1) + ((ty + 1)*self.w)] = new Tile(tx + 1, ty + 1, tile.wdr?Content.wall:Content.door, tile.wdr, !tile.wdr);
				// Bottom
				tiles[tx + ((ty + 1)*self.w)] = new Tile(tx, ty + 1, tile.wd?Content.wall:Content.door, tile.wd, !tile.wd);

				if(x == 0) {
					// Left
					tiles[(tx - 1) + (ty*self.w)] = new Tile(tx - 1, ty, tile.wl?Content.wall:Content.door, tile.wl, !tile.wl);
					// Bottom Left
					tiles[(tx - 1) + ((ty + 1)*self.w)] = new Tile(tx - 1, ty + 1, tile.wdl?Content.wall:Content.door, tile.wdl, !tile.wdl);
				}

				if(y == 0) {
					// Top
					tiles[tx + ((ty - 1)*self.w)] = new Tile(tx, ty - 1, tile.wu?Content.wall:Content.door, tile.wu, !tile.wu);
					// Top Right
					tiles[(tx + 1) + ((ty - 1)*self.w)] = new Tile(tx + 1, ty - 1, tile.wur?Content.wall:Content.door, tile.wur, !tile.wur);
				}

				if(x == 0 && y == 0) {
					// Top Left
					tiles[(tx - 1) + ((ty - 1)*self.w)] = new Tile(tx - 1, ty - 1, tile.wul?Content.wall:Content.door, tile.wul, !tile.wul);
				}
			}
		}

		for(var y = 0; y < self.h; y++) {
			for(var x = 0; x < self.w; x++) {
				if(y > 0) tiles[x + (y*self.w)].up = tiles[x + ((y-1)*self.w)];
				if(x > 0) tiles[x + (y*self.w)].left = tiles[(x-1) + (y*self.w)];
				if(y < self.h - 1) tiles[x + (y*self.w)].down = tiles[x + ((y+1)*self.w)];
				if(x < self.w - 1) tiles[x + (y*self.w)].right = tiles[(x+1) + (y*self.w)];
			}
		}

		return tiles;
	};

	while(true) {
		try {
			self.generate();
			break;
		} catch (e) {

		}
	}
}

function MetaTile(x, y) {
	var self = this;

	// State
	this.solid = true;
	this.room_border = false;

	// Tile Position
	this.x = x;
	this.y = y;

	this.dx = 32 + (x*64);
	this.dy = 32 + (y*64);

	// Tile Walls (Up, Down, Left, Right)
	this.wu = true;
	this.wd = true;
	this.wl = true;
	this.wr = true;

	this.wul = true;
	this.wur = true;
	this.wdl = true;
	this.wdr = true;

	// Tile Neighbors (Up, Down, Left, Right)
	this.nu = null;
	this.nd = null;
	this.nl = null;
	this.nr = null;

	this.draw = function(ctx) {
		if(self.solid) ctx.drawImage(Content.wall, self.dx, self.dy);

		if(self.wu) ctx.drawImage(Content.wall, self.dx, self.dy - 32);
		if(self.wd) ctx.drawImage(Content.wall, self.dx, self.dy + 32);
		if(self.wl) ctx.drawImage(Content.wall, self.dx - 32, self.dy);
		if(self.wr) ctx.drawImage(Content.wall, self.dx + 32, self.dy);

		if(self.wul) ctx.drawImage(Content.wall, self.dx - 32, self.dy - 32);
		if(self.wur) ctx.drawImage(Content.wall, self.dx + 32, self.dy - 32);
		if(self.wdl) ctx.drawImage(Content.wall, self.dx - 32, self.dy + 32);
		if(self.wdr) ctx.drawImage(Content.wall, self.dx + 32, self.dy + 32);

		ctx.fillStyle = "#f00";
		if(self.room_border) ctx.fillRect(self.dx, self.dy, 32, 32);
	};

	this.is_dead_end = function() {
		var ret = 0;
		if(!self.wu) ret++;
		if(!self.wd) ret++;
		if(!self.wl) ret++;
		if(!self.wr) ret++;
		
		if(ret == 1) return true;
		return false;
	};

	this.get_tiles = function() {
		

		var tiles = [];
		tiles.push(new Tile(tx - 1, ty - 1, tile.wul?Content.wall:Content.floor));
	};
}