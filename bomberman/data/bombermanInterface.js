// In Nodejs, window does not exist.
if(typeof window === 'undefined') {
	Bomberman = {};
	Bomberman.Data = {};
} else {
	Namespace.register("Bomberman.Data");
}

/*******************************************************
 *	This class is a subset of the information stored
 *	in the bomberman class. It is sent across to other 
 *	players to update them regarding the other players
 *	in game. This is sent only when a new player has
 *	joined and when a player needs synchronization.
 *	The animation will not be synchronized as it is not
 *	important for all players to see the same action
 *	across. Alot of these items are not required because
 *	the values does not change. Furthermore, the player
 *	will not bothered it.
 *******************************************************/
Bomberman.Data.BombermanInterface = function (bomberman) {

	var that				= {};
	
	that.playerId			= bomberman ? bomberman.playerId : 0;
	that.name				= bomberman ? bomberman.name : "";
	
	// Coordinates
	that.x					= bomberman ? bomberman.x : 0;
	that.y					= bomberman ? bomberman.y : 0;
	
	// Statistics
	that.kills				= bomberman ? bomberman.kills : 0;
	that.deaths				= bomberman ? bomberman.deaths : 0;
	
	// Game Object
	that.height				= bomberman ? bomberman.height : 0;
	that.width				= bomberman ? bomberman.width : 0;
	
	// Movement related
	that.speed				= bomberman ? bomberman.speed : 0;
	that.up					= bomberman ? bomberman.up : false;
	that.down				= bomberman ? bomberman.down : false;
	that.left				= bomberman ? bomberman.left : false;
	that.right				= bomberman ? bomberman.right : false;
	
	// Bomb related
	that.bombStr			= bomberman ? bomberman.bombStr : 0;
	that.bombs				= bomberman ? bomberman.bombs : 0;
	that.bombsMax			= bomberman ? bomberman.bombsMax : 0;
	that.detonateTime		= bomberman ? bomberman.detonateTime : 0;
	that.explodeDuration	= bomberman ? bomberman.explodeDuration : 0;
	
	// Game Board
	that.isWalkable			= bomberman ? bomberman.isWalkable : false;
	that.canBePlanted		= bomberman ? bomberman.canBePlanted : false;
	that.canBeExploded		= bomberman ? bomberman.canBeExploded : false;
	that.canBeExplodedThru	= bomberman ? bomberman.canBeExplodedThru : false;
	
	//******************************************************************************
	//	This function updates the current bombermanInterface with another one
	//******************************************************************************
	that.update = function (bombermanInterface) {
		that.name				= bombermanInterface.name;
	
		// Coordinates
		that.x					= bombermanInterface.x;
		that.y					= bombermanInterface.y;
		
		// Statistics
		that.kills				= bombermanInterface.kills;
		that.deaths				= bombermanInterface.deaths;
		
		// Game Object
		that.height				= bombermanInterface.height;
		that.width				= bombermanInterface.width;
		
		// Movement related
		that.speed				= bombermanInterface.speed;
		that.up					= bombermanInterface.up;
		that.down				= bombermanInterface.down;
		that.left				= bombermanInterface.left;
		that.right				= bombermanInterface.right;
		
		// Bomb related
		that.bombStr			= bombermanInterface.bombStr;
		that.bombs				= bombermanInterface.bombs;
		that.bombsMax			= bombermanInterface.bombsMax;
		that.detonateTime		= bombermanInterface.detonateTime;
		that.explodeDuration	= bombermanInterface.explodeDuration;
		
		// Game Board
		that.isWalkable			= bombermanInterface.isWalkable;
		that.canBePlanted		= bombermanInterface.canBePlanted;
		that.canBeExploded		= bombermanInterface.canBeExploded;
		that.canBeExplodedThru	= bombermanInterface.canBeExplodedThru;
	};
	
	//******************************************************************************
	//	This function updates the coordinates of this bombermanInterface
	//******************************************************************************
	that.updateCoordinates = function (coordinates) {
		that.name		= coordinates.name;
		
		that.x			= coordinates.x;
		that.y			= coordinates.y;
		
		// Movement related
		that.up			= coordinates.up;
		that.down		= coordinates.down;
		that.left		= coordinates.left;
		that.right		= coordinates.right;
	};
	
	return that;
}

if(typeof window === 'undefined') {
	exports.Bomberman = Bomberman;
	exports.Bomberman.Data = Bomberman.Data;
	exports.Bomberman.Data.BombermanInterface = Bomberman.Data.BombermanInterface;
}

