Namespace.register("Bomberman.Data");

/*******************************************************
 *	This class is a subset of the information stored
 *	in the bomb class. It is send across to all other
 *	players when a player has planted a bomb. The 
 *	additional information is added to support future
 *	skills of bomberman if available.
 *******************************************************/
Bomberman.Data.BombInterface = function (bomb) {

	var that					= {};
	
		// Coordinates
		that.x					= bomb.x;
		that.y					= bomb.y;
		
		// Bomb details
		that.id					= bomb.playerId;
		that.str				= bomb.str;
		
		that.timing				= bomb.timing;
		that.explodeDuration	= bomb.explodeDuration;
		that.detonateTime		= bomb.detonateTime;
		
		// Game Board
		that.isWalkable			= bomb.isWalkable;
		that.canBePlanted		= bomb.canBePlanted;
		that.canBeExploded		= bomb.canBeExploded;
		that.canBeExplodedThru	= bomb.canBeExplodedThru;
		
	return that;
}