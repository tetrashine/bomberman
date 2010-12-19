Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is the bomb object of the bomberman game. It
 *	has mutiple additional parameters which are fixed.
 *	In future version where bomberman might have more
 *	powers, it will be useful.
 *******************************************************/
Bomberman.GameObjects.GameObject = function () {

	var that		= new Bomberman.GameObjects.GameBoardTile(true, true, true);
	
		that.x		= 32;
		that.y		= 32;
		that.height	= 32;
		that.width	= 32;
		that.color	= "#000000";
		that.type	= Bomberman.GameObjects.Type.Nothing;
		
		//******************************************************************************
		//	This function check if the object has hit another object
		//******************************************************************************
		that.hit = function (object) {
			return (this.x === object.x && this.y === object.y);
		};
		
		//******************************************************************************
		//	This function moves this object to the new coordinates
		//******************************************************************************
		that.move = function (x, y) {
			that.x = x;
			that.y = y;
		};
	
	return that;
}
