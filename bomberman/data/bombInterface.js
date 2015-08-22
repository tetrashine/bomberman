Namespace.register("Bomberman.Data");

/*******************************************************
 *	This class is a subset of the information stored
 *	in the bomb class. It is send across to all other
 *	players when a player has planted a bomb. The 
 *	additional information is added to support future
 *	skills of bomberman if available.
 *******************************************************/

function toBit(booleanVar) {
	return booleanVar ? 1 : 0;
}

Bomberman.Data.BombInterface = function (bomb) {

	var that					= {};
	
		// Coordinates
		that.x					= bomb.x;
		that.y					= bomb.y;
		
		// Bomb details
		that.id					= bomb.playerId;
		that.s					= bomb.str;
		
		that.t					= bomb.timing;
		that.eD	 				= bomb.explodeDuration;
		that.dT					= bomb.detonateTime;
		
		// Game Board
		/*that.iW				= bomb.isWalkable;
		that.cBP				= bomb.canBePlanted;
		that.cBE				= bomb.canBeExploded;
		that.cBET				= bomb.canBeExplodedThru;*/
		
	return that;
}