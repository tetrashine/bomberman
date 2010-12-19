Namespace.register("Bomberman");

/*******************************************************
 *	This is an 
 *******************************************************/
Bomberman.ImageManager = (function () {
	var images = [];
	
	images[0] = new Image();
	images[0].src = "/images/brick.png";
	
	images[1] = new Image();
	images[1].src = "/images/selfbomberman.png";
				
	images[2] = new Image();
	images[2].src = "/images/oppbomberman.png";
	
	images[3] = new Image();
	images[3].src = "/images/bomb.png";
	
	images[4] = new Image();
	images[4].src = "/images/explosionCenter.png";
	
	images[5] = new Image();
	images[5].src = "/images/explosionLeftRightLink.png";
	
	images[6] = new Image();
	images[6].src = "/images/explosionUpDownLink.png";
	
	images[7] = new Image();
	images[7].src = "/images/explosionUp.png";
	
	images[8] = new Image();
	images[8].src = "/images/explosionDown.png";
	
	images[9] = new Image();
	images[9].src = "/images/explosionLeft.png";
	
	images[10] = new Image();
	images[10].src = "/images/explosionRight.png";
	
	return {
		// Items Index
		Brick			: 0,
		SelfBomberman	: 1,
		OppBomberman	: 2,
		Bomb			: 3,
		
		// Bomb
		BombFps			: 5,
		TotalBombFrames	: 4,
		
		// Bomberman
		BombermanFps			: 8,	
		TotalBombermanFrames	: 16,
		TotalBombermanTypes		: 4,
		
		DownMovement	: 0,
		UpMovement		: 1,
		LeftMovement	: 2,
		RightMovement	: 3,
		
		// Explosion
		ExplosionCenter			: 4,
		ExplosionLeftRightLink	: 5,
		ExplosionUpDownLink		: 6,
		ExplosionUp				: 7,
		ExplosionDown			: 8,
		ExplosionLeft			: 9,
		ExplosionRight			: 10,
		
		ExplosionFps			: 7,
		TotalExplosionFrames	: 16,
		
		getImageResource : function (index) {
			return images[index];
		}
	};
}());