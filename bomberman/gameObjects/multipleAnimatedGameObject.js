Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is for animated game object that has multiple
 *	animation. One example is the bomberman, it has
 *	multiple animation because of the different
 *	directions it is facing.
 *******************************************************/
Bomberman.GameObjects.MultipleAnimatedGameObject = function (image, totalFrames, fps, numOfTypes) {

	var that					= new Bomberman.GameObjects.AnimatedGameObject(	image, 
																				totalFrames,
																				fps);
													 
		that.numOfTypes			= numOfTypes;
		that.currentType		= 0;
		
	return that;
}