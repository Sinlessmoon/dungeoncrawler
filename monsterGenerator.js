function MonsterGenerator(room, amount, ctx, image)
{
	var self = this;

	this.room = room
	this.amount = amount;
	this.ctx = ctx;
	this.image = image;

	this.monsters = [];

	this.generate = function() {


		for(var i = 0; i < self.amount; i++)
		{
			var tileSpawn = self.checkTile();
			self.monsters.push(new Monster(tileSpawn, self.image));
		}

		return self.monsters;

	};

    //Lmao, Rudimentary checking of tiles to make sure that the monster doesn't spawn in walls.
	this.checkTile = function() {

		var TileFound = false;
		var tile;

		while(TileFound != true)
		{
			var randTile = self.room.tiles[rand(1, 3000)];
			var tile;

			if(randTile.solid == false)
			{
				tile = randTile;
				TileFound = true;
			}

		}

		return tile;
	};
}