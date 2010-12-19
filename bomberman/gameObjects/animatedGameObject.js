Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is a class that represent any object that does
 *	animates repeatly. One example of such object would
 *	be a bomb.
 *******************************************************/
Bomberman.GameObjects.AnimatedGameObject = function (image, totalFrames, fps) {

	var that					= new Bomberman.GameObjects.VisualGameObject(image);
		that.fps				= fps;
		that.totalFrames		= totalFrames;

        that.currentFrame		= 0;
        that.timeBetweenFrames	= 1/fps;
        that.timeSinceLastFrame	= that.timeBetweenFrames;
        that.frameWidth			= that.image.width / that.totalFrames;
	
	return that;
}