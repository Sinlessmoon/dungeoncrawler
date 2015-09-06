/*So here's a little placeholder for monsters, its fairly rudimentary but eventually it could support different types
of monsters with very little effort. Just gotta make sure it has all the right variables so it works properly.
*/

function Monster(tile, image)
{
	var self = this;

	 this.tile = tile;
	 this.image = image;

	this.update = function() {



	}

	this.spawn = function() {



	};

	this.draw = function(ctx) {

		ctx.drawImage(self.image, self.tile.dx, self.tile.dy);

	};
}