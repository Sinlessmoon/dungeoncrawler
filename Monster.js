/*So here's a little placeholder for monsters, its fairly rudimentary but eventually it could support different types
of monsters with very little effort. Just gotta make sure it has all the right variables so it works properly.
*/

function Monster(tile, image)
{
	 var self = this;
	 var x;
	 var dir = null;
	 this.tile = tile;
	 this.image = image;

	this.update = function() {

		var canMoveToTile = false;

		//There is probably a much simpler way to check for available tiles to move too.
		while(canMoveToTile != true){

			//For Reference: 1 = left, 2 = up, 3 = down, 4 = right
			
			 x = rand(1, 4);
			 
			 if(dir != null)
			 {	 	
			 	if(self.randomPrecentage() >= 80)
			 	{
			 		x = dir;
			 	}
			 }

			switch(x)
			{
				case 1:
					if(self.tile.left != null && !self.tile.left.solid) 
						{
							self.tile = self.tile.left;
							dir = 1;
							canMoveToTile = true;
						}
					break;

				case 2:
				if(self.tile.up != null && !self.tile.up.solid) 
						{
							self.tile = self.tile.up;
							dir = 2;
							canMoveToTile = true;
						}
					break;

				case 3:
				if(self.tile.down != null && !self.tile.down.solid) 
						{
							self.tile = self.tile.down;
							dir = 3;
							canMoveToTile = true;
						}
					break;

				case 4:
				if(self.tile.right != null && !self.tile.right.solid) 
						{
							self.tile = self.tile.right;
							dir = 4;
							canMoveToTile = true;
						}
					break;
			}
		}

	};

	this.randomPrecentage = function()
	{
		var precent = rand(1, 100);

		return precent;
	}

	this.spawn = function() {



	};

	this.draw = function(ctx) {

		ctx.drawImage(self.image, self.tile.dx, self.tile.dy);

	};
}