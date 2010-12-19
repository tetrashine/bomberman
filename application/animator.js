Namespace.register("Application");

/*******************************************************
 *	This class will animate the object. Base on the
 *	timing passed in. This will determine when should
 *	the object be switch to the next frame.
 *******************************************************/
Application.Animator = function () {

	return {
		animate : function (animatedGameObject, dt) {
		
			animatedGameObject.timeSinceLastFrame -= dt;
			if (animatedGameObject.timeSinceLastFrame <= 0)
			{
			   animatedGameObject.timeSinceLastFrame = animatedGameObject.timeBetweenFrames;
			   animatedGameObject.currentFrame++;
			   animatedGameObject.currentFrame %= (animatedGameObject.totalFrames / animatedGameObject.numOfTypes);
			}
		}
	};
}