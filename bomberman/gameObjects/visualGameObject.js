Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is a class that represent any object that does
 *	not animate. An example would be a wall.
 *******************************************************/
Bomberman.GameObjects.VisualGameObject = function (image) {
	var that			= new Bomberman.GameObjects.GameObject();
		that.image		= image;
		that.numOfTypes	= 1;

	return that;
}