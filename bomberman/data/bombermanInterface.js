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
	that.ks					= bomberman ? bomberman.kills : 0;
	that.ds					= bomberman ? bomberman.deaths : 0;
	
	// Game Object
	that.h					= bomberman ? bomberman.height : 0;
	that.w					= bomberman ? bomberman.width : 0;
	
	// Movement related
	that.s 					= bomberman ? bomberman.speed : 0;
	that.u 					= bomberman ? bomberman.up : false;
	that.d 					= bomberman ? bomberman.down : false;
	that.l 					= bomberman ? bomberman.left : false;
	that.r 					= bomberman ? bomberman.right : false;
	
	// Bomb related
	that.bS					= bomberman ? bomberman.bombStr : 0;
	that.b					= bomberman ? bomberman.bombs : 0;
	that.bM					= bomberman ? bomberman.bombsMax : 0;
	that.dT					= bomberman ? bomberman.detonateTime : 0;
	that.eD					= bomberman ? bomberman.explodeDuration : 0;
	
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
		that.ks 				= bombermanInterface.ks;
		that.ds 				= bombermanInterface.ds;
		
		// Game Object
		that.h 					= bombermanInterface.h;
		that.w 					= bombermanInterface.w;
		
		// Movement related
		that.s 					= bombermanInterface.s;
		that.u					= bombermanInterface.u;
		that.d 					= bombermanInterface.d;
		that.l 					= bombermanInterface.l;
		that.r 					= bombermanInterface.r;
		
		// Bomb related
		that.bS					= bombermanInterface.bS;
		that.b					= bombermanInterface.b;
		that.bM					= bombermanInterface.bM;
		that.dT					= bombermanInterface.dT;
		that.eD					= bombermanInterface.eD;
		
		// Game Board
		that.iW					= bombermanInterface.isWalkable;
		that.cBP				= bombermanInterface.canBePlanted;
		that.cBE				= bombermanInterface.canBeExploded;
		that.cBET				= bombermanInterface.canBeExplodedThru;
	};
	
	//******************************************************************************
	//	This function updates the coordinates of this bombermanInterface
	//******************************************************************************
	that.updateCoordinates = function (coordinates) {
		that.name		= coordinates.n;
		
		that.x			= coordinates.x;
		that.y			= coordinates.y;
		
		// Movement related
		that.u			= coordinates.u;
		that.d			= coordinates.d;
		that.l			= coordinates.l;
		that.r 			= coordinates.r;
	};
	
	return that;
}

if(typeof window === 'undefined') {
	exports.Bomberman = Bomberman;
	exports.Bomberman.Data = Bomberman.Data;
	exports.Bomberman.Data.BombermanInterface = Bomberman.Data.BombermanInterface;
}

