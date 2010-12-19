Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is the bomb object of the bomberman game. It
 *	has mutiple additional parameters which are fixed.
 *	In future version where bomberman might have more
 *	powers, it will be useful.
 *******************************************************/
Bomberman.GameObjects.Bomb = function (image, x, y, playerId, str, detonateTime, duration) {

	var that					= new Bomberman.GameObjects.AnimatedGameObject(image, 
																				Bomberman.ImageManager.TotalBombFrames, 
																				Bomberman.ImageManager.BombFps);
	
		// Coordinates
		that.x					= x;
		that.y					= y;
		
		that.type				= Bomberman.GameObjects.Type.Bomb;
		
		// Bomb details
		that.id					= playerId;
		that.str				= str;
		
		that.timing				= 0;
		that.explodeDuration	= duration;
		that.detonateTime		= detonateTime;
		
		// Game Board
		that.isWalkable			= false;
		that.canBePlanted		= false;
		that.canBeExploded		= true;
		that.canBeExplodedThru	= false;
		
	return that;
}