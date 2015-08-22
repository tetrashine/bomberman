Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is the explosion object of the bomberman game.
 *	This is designed such that the explosion could be 
 *	customizable to the player.
 *******************************************************/
Bomberman.GameObjects.BombermanPlayer = function (id, image) {

	var that			= new Bomberman.GameObjects.MultipleAnimatedGameObject(image, Bomberman.ImageManager.TotalBombermanFrames, Bomberman.ImageManager.BombermanFps, Bomberman.ImageManager.TotalBombermanTypes);
															
		that.playerId	= id;
		that.name		= "Player " + id;
		
		that.type		= Bomberman.GameObjects.Type.Bomberman;
		
		// Statistics
		that.kills		= 0;
		that.deaths		= 0;
		
		// Game Object
		that.height		= 32;
		that.width		= 32;
		
		// Movement related
		that.speed		= 150;
		that.up			= false;
		that.down		= false;
		that.left		= false;
		that.right		= false;
		
		// Bomb related
		that.bombStr		= 8;
		that.bombs			= 8;
		that.bombsMax		= that.bombs;
		that.detonateTime	= 3;			// secs
		that.explodeDuration= 1;			// secs
		
		// Game related
		that.invisible		= true;
		that.invisTiming	= 0;			// secs
		that.invisLength	= 4;			// secs
		
		// Game Board
		that.isWalkable			= true;
		that.canBePlanted		= true;
		that.canBeExploded		= true;
		that.canBeExplodedThru	= true;
	
	//******************************************************************************
	//	This function respawns the current player. Respawn will perform the
	//	following:
	//		1) Increase the death count
	//		2) Reset total bombs that can be planted
	//		3) Set player to invisible
	//		4) Set player to be unkillable by bomb
	//******************************************************************************
	that.respawn = function () {
		that.deaths++;
		that.invisTiming	= 0;
		that.invisible		= true;
		that.canBeExploded	= false;
		that.bombs			= that.bombsMax;
	};
	
	//******************************************************************************
	//	This function denote that a bomb from the player has exploded. Therefore it
	//	will increase back the player's total bomb plantable.
	//******************************************************************************
	that.detonate = function () {
		if(that.bombs < that.bombsMax) {
			that.bombs ++;
		}
	};
	
	//******************************************************************************
	//	This function denote that the player will attempt to plant a bomb. The
	//	function will return whether the player is able to plant a bomb. If it is
	//	able, the necessary actions will be executed.
	//******************************************************************************
	that.plant = function () {
		planted = false;
		if(that.bombs > 0) {
			that.bombs --;
			planted = true;
		}
		
		return planted;
	};
	
	//******************************************************************************
	//	This function performs a full update from the bombermanInterface. This is 
	//	performed when the player just connected to the server and the new player
	//	will be updated with all the existing players.
	//******************************************************************************
	that.update = function (bombermanInterface) {
		that.name				= bombermanInterface.name;
		
		// Coordinates
		that.x					= bombermanInterface.x;
		that.y					= bombermanInterface.y;

		// Statistics
		that.kills				= bombermanInterface.ks;
		that.deaths				= bombermanInterface.ds;
		
		// Game Object
		that.height				= bombermanInterface.h;
		that.width				= bombermanInterface.w;
		
		// Movement related
		that.speed				= bombermanInterface.s;
		that.up					= bombermanInterface.u;
		that.down				= bombermanInterface.d;
		that.left				= bombermanInterface.l;
		that.right				= bombermanInterface.r;
		
		// Bomb related
		that.bombStr			= bombermanInterface.bS;
		that.bombs				= bombermanInterface.b;
		that.bombsMax			= bombermanInterface.bM;
		that.detonateTime		= bombermanInterface.dT;
		that.explodeDuration	= bombermanInterface.eD;
		
		// Game Board related
		that.isWalkable			= bombermanInterface.iW;
		that.canBePlanted		= bombermanInterface.cBP;
		that.canBeExploded		= bombermanInterface.cBE;
		that.canBeExplodedThru	= bombermanInterface.cBET;
	};
	
	//******************************************************************************
	//	This function performs a partial update from the coordinates. This is 
	//	performed when the player move or has performed a change in name.
	//******************************************************************************
	that.updateCoordinates = function (coordinates) {
		that.name		= coordinates.n;
		
		that.x			= coordinates.x;
		that.y			= coordinates.y;
		
		// Movement related
		that.up			= coordinates.u == 1;
		that.down		= coordinates.d == 1;
		that.left		= coordinates.l == 1;
		that.right		= coordinates.r == 1;
	};
	
	return that;
}

