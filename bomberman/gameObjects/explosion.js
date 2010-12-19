Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is the explosion object of the bomberman game.
 *	This is designed such that the explosion could be 
 *	customizable to the player.
 *******************************************************/
Bomberman.GameObjects.Explosion = function (image, x, y, duration, playerId) {

	var that					= new Bomberman.GameObjects.AnimatedGameObject(image, Bomberman.ImageManager.TotalExplosionFrames, (Bomberman.ImageManager.ExplosionFps/duration));
		that.id					= playerId;
	
		// Coordinates
		that.x					= x;
		that.y					= y;
		
		that.type				= Bomberman.GameObjects.Type.Explosion;
		
		that.timing				= 0;
		that.explodeDuration	= duration;
		
		// Game Board
		that.isWalkable			= true;
		that.canBePlanted		= true;
		that.canBeExploded		= false;
		that.canBeExplodedThru	= true;
		
		that.addAndReturnIfRemovable = function (dt) {
			that.timing += dt;
			
			return (that.timing > that.explodeDuration);
		}
		
	return that;
}