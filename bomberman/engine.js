Namespace.register("Bomberman");

/*******************************************************
 *	This class is the engine of the bomberman game. 
 *	It will handle the interval and the entire game play.
 *******************************************************/
Bomberman.Engine = function (id, engineInterface) {
	var FPS			= 30,
		Interval	= 1000 / FPS,
		dts			= Interval,
		lastTiming	= new Date().getTime(),
		bombs		= [],
		players		= [],
		explosions	= [],
		animator	= new Application.Animator(),
		core		= engineInterface,
		CellWidth	= core.getCellWidth(),
		gameStarted	= false,
		IntervalId	= 0,
		gameBoard	= new Bomberman.GameBoard(Bomberman.Map.getMap()),
		mapHeight	= Bomberman.Map.rows(),
		mapWidth	= Bomberman.Map.cols(),
		playerId	= id,
		gameIntervalCounter = 0;
		
	//******************************************************************************
	//	This function runs through the entire list of the 
	//	players and return the position of the player.
	//******************************************************************************
	function findPlayerPositionById (playerId) {
		var position = -1,
			length = players.length;
			
		for( position = 0; position < length; position++ ) {
			if( players[position].playerId === playerId ) {
				return position;
			}
		}
		
		return position;
	}
	
	//******************************************************************************
	//	This function checks whether the current player is moving
	//******************************************************************************
	function isPlayerMoving () {
		var player = players[findPlayerPositionById(playerId)];
		
		return (player.up || player.down || player.left || player.right);
	}
		
	//******************************************************************************
	//	This function converts coordinates to a point in the map
	//******************************************************************************
	function coordToPoint (coord) {
		return Math.floor(coord / CellWidth);
	}
	
	//******************************************************************************
	//	This function converts from point to coordinate in the map
	//	The coordinate will be top left corner of the area.
	//******************************************************************************
	function pointToCoord (point) {
		return (point * CellWidth);
	}
	
	//******************************************************************************
	//	This function is in-charge of the drawing of the game.
	//	The order of drawing is in relation with the z-position of the objects.
	//******************************************************************************
	function drawGame () {
		// Clear UI
		core.clearUI();
		
		// Draw Bombs
		core.drawObjects(bombs);
		
		// Draw Explosions
		core.drawObjects(explosions);
		
		// Draw Chars
		core.drawObjects(players);
	}
	
	//******************************************************************************
	//	This function is in-charge of the logic that occurs every interval.
	//******************************************************************************
	function gameInterval () {
		var i = 0,
			pointX = 0,
			pointY = 0  ,
			thisTiming = new Date().getTime(),
			dt = ((thisTiming - lastTiming) / 1000),	// secs
			playersNumber = players.length,
			bombsNumber = bombs.length,
			explosionNumber = explosions.length;
		
		gameIntervalCounter ++;
		gameIntervalCounter %= 1000;
		
		// Move Characters
		moveChars(dt);	// in secs
		
		if((gameIntervalCounter % 2 === 0) && isPlayerMoving()) {
			core.sendPosMsg(players[findPlayerPositionById(playerId)]);
		}
		
		// Add timing
		for( i = 0; i < playersNumber; i++ ) {
			if( players[i] === undefined ) { continue; }
			
			if(players[i].invisible && ((players[i].invisTiming += dt) > players[i].invisLength)) {
				players[i].invisible = false;
				players[i].canBeExploded = true;
			}
		}
		
		// Animate Bombs
		for( i = 0; i < bombsNumber; i++ ) {
			animator.animate(bombs[i], dt);
		}
		
		// Animate Explosions
		for( i = 0; i < explosionNumber; i++ ) {
			animator.animate(explosions[i], dt);
		}
		
		// Check for Bombs to Explosions
		for( i = bombsNumber-1; i >= 0; i-- ) {
			if((bombs[i].timing += dt) > bombs[i].detonateTime) {
				var position = findPlayerPositionById(bombs[i].id);
				players[position].detonate();
				
				pointX = coordToPoint(bombs[i].x);
				pointY = coordToPoint(bombs[i].y);
				
				// Remove bombs from display and game board
				gameBoard.removeGameObject(pointX, pointY, bombs[i]);
				
				// Explosion
				setExplosion(pointX, pointY, bombs[i].str, bombs[i].explodeDuration, bombs[i].id);
				
				bombs.splice(i, 1);
			}
		}
		
		// Check to remove Explosions
		for( i = explosionNumber-1; i >= 0; i-- ) {
			// Checks for explosion is done every alternate game interval
			if((gameIntervalCounter % 2 === 0) && explosions[i].timing > 0.5){
				explodeLocation(coordToPoint(explosions[i].x), coordToPoint(explosions[i].y), explosions[i].id);
			}
			
			if(explosions[i].addAndReturnIfRemovable(dt)) {

				pointX = coordToPoint(explosions[i].x);
				pointY = coordToPoint(explosions[i].y);
			
				// Remove explosion from display and game board
				gameBoard.removeGameObject(pointX, pointY, explosions[i]);
				
				explosions.splice(i, 1);
			} 
		}
	}
	
	//******************************************************************************
	//	This function will run through the point of explosion and 
	//	setup explosion on all the available points. It will stop 
	//	when it hits something that cannot be exploded through.
	//******************************************************************************
	function setExplosion (x, y, str, duration, playerId) {
		var i = 0,
			pointX = 0,
			pointY = 0,
			explosion = new Bomberman.GameObjects.Explosion(Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionCenter),
															  pointToCoord(x),
															  pointToCoord(y),
															  duration,
															  playerId);
															  
		Bomberman.AudioManager.playAudio(Bomberman.AudioManager.Explosion);
		
		// Explosion Center
		explosion.canBeExplodedThru = false;		// core does not need to be exploded through
		explodeLocation(x, y, playerId);	
		explosions.push(explosion);
		gameBoard.addGameObject(x, y, explosion);
		
		// Up
		for( i = 1; i < str; i++ ) {
			
			pointX = x;
			pointY = y-i;
			
			explodeLocation(pointX, pointY, playerId);
			
			// An object has block the explosion
			if(!gameBoard.canExplodeThru(pointX, pointY)) { break; }
		
			if(pointY >= 0) {
				explosion = new Bomberman.GameObjects.Explosion((i == str-1) ? Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionUp) :
																				Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionUpDownLink),
																  pointToCoord(pointX),
																  pointToCoord(pointY),
																  duration,
																  playerId);
										  
				explosions.push(explosion);
				gameBoard.addGameObject(pointX, pointY, explosion);
			}
		}
		
		// Down
		for( i = 1; i < str; i++ ) {
		
			pointX = x;
			pointY = y+i;
			
			explodeLocation(pointX, pointY, playerId);
			
			// An object has block the explosion
			if(!gameBoard.canExplodeThru(pointX, pointY)) { break; }
		
			if(pointY < mapHeight) {
				explosion = new Bomberman.GameObjects.Explosion((i == str-1) ? Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionDown) :
																				 Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionUpDownLink),
																  pointToCoord(pointX),
																  pointToCoord(pointY),
																  duration,
																  playerId);
										  
				explosions.push(explosion);
				gameBoard.addGameObject(pointX, pointY, explosion);
			}
		}
		
		// Left
		for( i = 1; i < str; i++ ) {
		
			pointX = x-i;
			pointY = y;
			
			explodeLocation(pointX, pointY, playerId);
			
			// An object block the explosion
			if(!gameBoard.canExplodeThru(pointX, pointY)) { break; }
		
			if(pointX >= 0) {
				explosion = new Bomberman.GameObjects.Explosion((i == str-1) ? Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionLeft) :
																				 Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionLeftRightLink),
																  pointToCoord(pointX),
																  pointToCoord(pointY),
																  duration,
																  playerId);
				
				explosions.push(explosion);
				gameBoard.addGameObject(pointX, pointY, explosion);
			}
		}
		
		// Right
		for( i = 1; i < str; i++ ) {
		
			pointX = x+i;
			pointY = y;
		
			explodeLocation(pointX, pointY, playerId);
			
			// An object block the explosion
			if(!gameBoard.canExplodeThru(pointX, pointY)) { break; }
		
			if(pointX < mapWidth) {
				explosion = new Bomberman.GameObjects.Explosion((i == str-1) ? Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionRight) :
																				 Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.ExplosionLeftRightLink),
																  pointToCoord(pointX),
																  pointToCoord(pointY),
																  duration,
																  playerId);
				
				explosions.push(explosion);
				gameBoard.addGameObject(pointX, pointY, explosion);
			}
		}
	}
	
	//******************************************************************************
	//	This function will run through objects in the specific point of the map.
	//	For all the objects, if it is a bomb, it will trigger the bomb to be
	//	exploded. If it is a player, it will kill the player. For now, there's no
	//	other objects.
	//******************************************************************************
	function explodeLocation (x, y, id) {
		var i,
			position,
			explodables = gameBoard.removeAllExplodable(x, y),
			length = explodables.length;
		
		for( i = 0; i < length; i++ ) {
			
			switch(explodables[i].type) {
				case Bomberman.GameObjects.Type.Bomberman:
					// Every client will only account for the player that is playing on itself
					if( playerId === explodables[i].playerId && 
						!explodables[i].invisible ) {				// player is invisible
						
						position = findPlayerPositionById(id);
						
						// If player is suicide, no score will be given
						if(id != explodables[i].playerId) { players[position].kills ++; }
							
						explodables[i].respawn();	
						
						moveToRandomEmptyPoint(explodables[i]);
						
						core.sendDiedMsg(id, explodables[i]);
					}
					break;
				case Bomberman.GameObjects.Type.Bomb:
					position = findPlayerPositionById(explodables[i].id);
					players[position].detonate();
					
					pointX = coordToPoint(explodables[i].x);
					pointY = coordToPoint(explodables[i].y);
					
					// Explosion
					setExplosion(pointX, pointY, explodables[i].str, explodables[i].explodeDuration, id);
					
					// Remove from bombs array
					bombs.splice(bombs.indexOf(explodables[i]), 1);
					break;
			}
		}
	}
	
	//******************************************************************************
	//	This function move the object the a random empty point in the map.
	//******************************************************************************
	function moveToRandomEmptyPoint (object) {
		var x = 0,
			y = 0;
		
		do {
			y = Math.floor(Math.random()*(mapHeight-2)) + 1;
			x = Math.floor(Math.random()*(mapWidth-2)) + 1;
			
		} while ( !gameBoard.isTileMovable(x, y) );
		
		// Move the object to the coordinates
		object.move(pointToCoord(x), pointToCoord(y));
		
		// Add to game board
		gameBoard.addGameObject(x, y, object);
	}
	
	//******************************************************************************
	//	This function will moves all the players. This function is written so that
	//	the player can move up/down and left/right at the same time, but not in
	//	opposite directions.
	//******************************************************************************
	function moveChars (dt) {
		var speed = 0,
			playersNumber = players.length;
		
		for( i = 0; i < playersNumber; i++ ) {
		
			speed = Math.round(players[i].speed * dt) % (2*CellWidth);
		
			// Player can only be moving upwards or downwards at any 1 time.
			// If both are pressed, going upwards take higher priority.
			if(players[i].up) {
				players[i].currentType = Bomberman.ImageManager.UpMovement;
				animator.animate(players[i], dt);
				
				moveCharacter(players[i], Bomberman.Common.Direction.UP, speed);
			} else if(players[i].down) {		
				players[i].currentType = Bomberman.ImageManager.DownMovement;
				animator.animate(players[i], dt);
				
				moveCharacter(players[i], Bomberman.Common.Direction.DOWN, speed);
			}
			
			// Player can only be moving left or right at any 1 time.
			// If both are pressed, going left take higher priority.
			if(players[i].left) {
				players[i].currentType = Bomberman.ImageManager.LeftMovement;
				animator.animate(players[i], dt);
				
				moveCharacter(players[i], Bomberman.Common.Direction.LEFT, speed);
			} else if(players[i].right) {
				players[i].currentType = Bomberman.ImageManager.RightMovement;
				animator.animate(players[i], dt);
				
				moveCharacter(players[i], Bomberman.Common.Direction.RIGHT, speed);
			}
		}
	}
	
	//******************************************************************************
	//	This function performs the computation on whether the player can move in
	//	the direction the player has chosen.
	//	Additional, this function allows the player to move although the player has
	//	not fit into the size directly. If the player wants to move up and it cannot
	//	fit into the uppermovement, this function will check for the possibility to
	//	move the player 1 step to the left/right first before moving up. Moving up
	//	will then be moved in the next trigger.
	//	Also, the player might not be able to make full movement in the direction as
	//	player might met into a wall or bomb. Therefore in such cases, the function
	//	will move the player to align with the obsticle.
	//******************************************************************************
	function moveCharacter (player, direction, speed) {
	
		var newX,
			newY,
			newCoord = new Bomberman.GameObjects.GameObject(),
			topLeft = new Bomberman.GameObjects.GameObject(), 
			topRight = new Bomberman.GameObjects.GameObject(), 
			bottomLeft = new Bomberman.GameObjects.GameObject(), 
			bottomRight = new Bomberman.GameObjects.GameObject(),
			charX = Math.round(player.x),
			charY = Math.round(player.y),
			charSpeed = speed,
			charWidth = player.width-1,
			charHeight = player.height-1,
			pointX = coordToPoint(player.x + (player.width/2)),
			pointY = coordToPoint(player.y + (player.height/2)),
			oriTopLeft = new Bomberman.GameObjects.GameObject(),
			oriTopRight = new Bomberman.GameObjects.GameObject(),
			oriBottomLeft = new Bomberman.GameObjects.GameObject(),
			oriBottomRight = new Bomberman.GameObjects.GameObject();
	
		oriTopLeft.x = charX;
		oriTopLeft.y = charY;
		
		oriTopRight.x = charX + charWidth;
		oriTopRight.y = charY;
		
		oriBottomLeft.x = charX;
		oriBottomLeft.y = charY + charHeight;
		
		oriBottomRight.x = charX + charWidth;
		oriBottomRight.y = charY + charHeight;
		
		switch(direction) {
			case Bomberman.Common.Direction.UP:
				
				// Top left hand corner
				topLeft.x = charX;
				topLeft.y = (charY - charSpeed);
				
				newY = toTileSide(charY);
				newCoord.x = charX;
				newCoord.y = newY;
				break;
			case Bomberman.Common.Direction.DOWN:
				
				// Top Left hand corner
				topLeft.x = charX;
				topLeft.y = (charY + charSpeed);

				newY = toTileSide(charY+charHeight);
				newCoord.x = charX;
				newCoord.y = newY;
				break;
			case Bomberman.Common.Direction.LEFT:

				// Top Left hand corner
				topLeft.x = (charX - charSpeed);
				topLeft.y = charY;
				
				newX = toTileSide(charX);
				newCoord.x = newX;
				newCoord.y = charY;
				break;
			case Bomberman.Common.Direction.RIGHT:

				// Top Left hand corner
				topLeft.x = (charX + charSpeed);
				topLeft.y = charY;
				
				newX = toTileSide(charX+charWidth);
				newCoord.x = newX;
				newCoord.y = charY;
				break;
			default:	
				break;
		}
		
		// Top right hand corner
		topRight.x = (topLeft.x + charWidth);
		topRight.y = topLeft.y;						
		
		// Bottom left hand corner
		bottomLeft.x = topLeft.x;
		bottomLeft.y = (topLeft.y + charHeight);
		
		// Bottom right hand corner
		bottomRight.x = (topLeft.x + charWidth);
		bottomRight.y = (topLeft.y + charHeight);
		
		var movableA = isSameTile(oriTopLeft, topLeft) ? true : isTileMovable(topLeft),
			movableB = isSameTile(oriTopRight, topRight) ? true : isTileMovable(topRight),
			movableC = isSameTile(oriBottomLeft, bottomLeft) ? true : isTileMovable(bottomLeft),
			movableD = isSameTile(oriBottomRight, bottomRight) ? true : isTileMovable(bottomRight);
			
		if(movableA && movableB && movableC && movableD) {
		
			player.x = topLeft.x;
			player.y = topLeft.y;
			
		} else if(player.hit(newCoord)) {
			var moveDist = 0,
				checkRad = 5*charSpeed;
			
			switch(direction) {
			
				case Bomberman.Common.Direction.UP:
					var topRightToLeft = new Bomberman.GameObjects.GameObject(),
						topLeftToRight = new Bomberman.GameObjects.GameObject();
						
						topRightToLeft.x = (topRight.x - checkRad);
						topRightToLeft.y = (topRight.y - checkRad);
						
						topLeftToRight.x = (topLeft.x + checkRad);
						topLeftToRight.y = (topLeft.y - checkRad);
					
					// If we wish to move left and up later on,
					// the top right should not be able to move upwards
					if(!movableB && isTileMovable(topRightToLeft)) {
					
						// move left
						moveDist = player.x - toTileSide(topRightToLeft.x);
						if(moveDist > charSpeed) { 
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.LEFT, moveDist);
					
					// If we wish to move right and up later on,
					// the top left should not be able to move upwards
					} else if(!movableA && isTileMovable(topLeftToRight)) {
					
						// move right
						moveDist = toTileSide(topLeftToRight.x) - player.x;
						if(moveDist > charSpeed) {
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.RIGHT, moveDist);
					}
					break;
				case Bomberman.Common.Direction.DOWN:
					var botRightToLeft = new Bomberman.GameObjects.GameObject(),
						botLeftToRight = new Bomberman.GameObjects.GameObject();
						
						botRightToLeft.x = (bottomRight.x - checkRad);
						botRightToLeft.y = (bottomRight.y + checkRad);
												
						botLeftToRight.x = (bottomLeft.x + checkRad);
						botLeftToRight.y = (bottomLeft.y + checkRad);
				
					// If we wish to move left and down later on,
					// the top right should not be able to move upwards
					if(!movableD && isTileMovable(botRightToLeft)) {
					
						// move left
						moveDist = player.x - toTileSide(botRightToLeft.x);
						if(moveDist > charSpeed) { 
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.LEFT, moveDist);
					
					// If we wish to move right and down later on,
					// the top right should not be able to move upwards
					}else if(!movableC && isTileMovable(botLeftToRight) ) {
					
						// move right
						moveDist = toTileSide(botLeftToRight.x) - player.x;
						if(moveDist > charSpeed) { 
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.RIGHT, moveDist);
					}
					break;
				case Bomberman.Common.Direction.LEFT:
					var botLeftToTop = new Bomberman.GameObjects.GameObject(),
						topLeftToDown = new Bomberman.GameObjects.GameObject();
						
						botLeftToTop.x = (bottomLeft.x - checkRad);
						botLeftToTop.y = (bottomLeft.y - checkRad);
						
						topLeftToDown.x = (topLeft.x - checkRad);
						topLeftToDown.y = (topLeft.y + checkRad);
						
					if(!movableC && isTileMovable(botLeftToTop)) {
					
						// move top
						moveDist = player.y - toTileSide(botLeftToTop.y);
						if(moveDist > charSpeed) { 
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.UP, moveDist);
					
					} else if(!movableA && isTileMovable(topLeftToDown)) {
					
						// move down
						moveDist = toTileSide(topLeftToDown.y) - player.y;
						if(moveDist > charSpeed) {
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.DOWN, moveDist);
					}
					break;
				case Bomberman.Common.Direction.RIGHT:	
					var botRightToTop = new Bomberman.GameObjects.GameObject(),
						topRightToDown = new Bomberman.GameObjects.GameObject();
						
						botRightToTop.x = (bottomRight.x + checkRad);
						botRightToTop.y = (bottomRight.y - checkRad);
												
						topRightToDown.x = (topRight.x + checkRad);
						topRightToDown.y = (topRight.y + checkRad);
						
					if(!movableD && isTileMovable(botRightToTop) ) {
						// move top
						moveDist = player.y - toTileSide(botRightToTop.y);
						if(moveDist > charSpeed) {
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.UP, moveDist);
					
					}else if(!movableB && isTileMovable(topRightToDown) ) {
					
						// move down
						moveDist = toTileSide(topRightToDown.y) - player.y;
						if(moveDist > charSpeed) { 
							moveDist = charSpeed;
						}
						
						moveCharacter(player, Bomberman.Common.Direction.DOWN, moveDist);
					}
					break;
				default:				
					break;
			}
		} else {
			player.x = newCoord.x;
			player.y = newCoord.y;
		}
		
		// This is to check that the player has moved enough
		// to change a slot to another slot in the gameboard.
		newX = coordToPoint(player.x + (player.width/2));
		newY = coordToPoint(player.y + (player.height/2));
			
		if(pointX !== newX || pointY !== newY) {
			// Remove from prev location
			if(gameBoard.removeGameObject(pointX, pointY, player)) {
				// Add to new location
				gameBoard.addGameObject(newX, newY, player);
			}
		}
	}
	
	//******************************************************************************
	//	This function calculates the coordinate to align to the tile.
	//******************************************************************************
	function toTileSide (coord) {
		return Math.floor(coord/CellWidth)*CellWidth;
	}
	
	//******************************************************************************
	//	This function calculates whether object 1 and 2 are on the same tile
	//	currently.
	//******************************************************************************
	function isSameTile (object1, object2) {
		var pointX1 = coordToPoint(object1.x),
			pointY1 = coordToPoint(object1.y),
			pointX2 = coordToPoint(object2.x),
			pointY2 = coordToPoint(object2.y);
			
		return ((pointX1 === pointX2) && (pointY1 === pointY2));
	}
	
	//******************************************************************************
	//	This function returns whether the tile can be moved into.
	//******************************************************************************
	function isTileMovable (point) {
		return gameBoard.isTileMovable(coordToPoint(point.x), 
									   coordToPoint(point.y));
	}

	//******************************************************************************
	//	This function is the engine interval. Consist of two parts - logic n drawing
	//******************************************************************************
	function engineInterval () {
		var thisTiming = new Date().getTime(),
			dt = ((thisTiming - lastTiming) / 1000);
		
		var framePerSec = Math.round(1/dt*100)/100;
		
		core.writeDebugMessage("FPS:" + framePerSec);
		
		// Make interval changes
		gameInterval();
		
		// Draw Game
		drawGame();
		
		// Draw the score board
		core.drawScore(getScores());
		
		lastTiming = thisTiming;
	}
	
	//******************************************************************************
	//	This function adds player to the engine.
	//******************************************************************************
	function EngineAddPlayer (id, isSelf, player) {
		if( !gameStarted ) { return; }
		
		var image		= (isSelf) ? Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.SelfBomberman):Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.OppBomberman),
			bomberman	= new Bomberman.GameObjects.BombermanPlayer(id, image);
	
		players.push(bomberman);
		
		// Move to random location or to where the added players is
		if(isSelf) {	
			moveToRandomEmptyPoint(bomberman);
		} else {
			bomberman.update(player);
		}
	}
	
	//******************************************************************************
	//	This function obtain all the score from the players respectively
	//******************************************************************************
	function getScores () {
		var i,
			length = players.length,
			scores = [];
		
		for( i = 0; i < length; i++ ) {
			scores.push(new Bomberman.Data.PlayerScore(players[i]));
		}
		
		return scores;
	}
	
	//******************************************************************************
	//	This function plants the bomb
	//******************************************************************************
	function plantBomb (playerId, player, pointX, pointY, str, time, duration) {
		var bomb,
			x = pointToCoord(pointX),
			y = pointToCoord(pointY);
		
		if( gameBoard.canBePlanted(pointX, pointY) &&
			player.plant() ) {

			bomb = new Bomberman.GameObjects.Bomb(	Bomberman.ImageManager.getImageResource(Bomberman.ImageManager.Bomb),
													x,
													y, 
													playerId, 
													str,
													time,
													duration);

			bombs.push(bomb);

			gameBoard.addGameObject(pointX, pointY, bomb);

		}
		
		return bomb;
	}
				
	return {
	
		//******************************************************************************
		//	This function starts the game
		//	If the game has started, then it cannot be started again.
		//******************************************************************************
		start : function () {
			if( gameStarted ) { return; }
			
			gameStarted = true;
			
			// Map will only be drawn once at start
			core.drawMap(Bomberman.Map.getMap());
			
			// Set game interval
			IntervalId = setInterval(engineInterval, Interval);
		},
		
		//******************************************************************************
		//	This function returns whether the game is still going on
		//******************************************************************************
		hasStarted : function () {
			return gameStarted;
		},
		
		//******************************************************************************
		//	This function ends the game
		//	If the game has not been started, then it cannot be stopped.
		//******************************************************************************
		end : function () {
			if( !gameStarted ) { return; }
			
			clearTimeout(IntervalId);
			
			// clear all arrays
			bombs = [];
			players = [];
			explosion = [];
			
			gameStarted = false;
		},
		
		//******************************************************************************
		//	This function is the public API for adding a player to the engine
		//******************************************************************************
		addPlayer : function (id, isSelf, player) {
			EngineAddPlayer(id, isSelf, player);
		},
		
		//******************************************************************************
		//	This function is the public API for this player to plant a bomb to the engine
		//******************************************************************************
		selfPlant : function () {
			if( !gameStarted ) { return; }
	
			var bomb,
				position = findPlayerPositionById(playerId);
			
			if(position >= 0 && position < players.length) {
				bomb = plantBomb (	playerId, 
									players[position], 
									coordToPoint(players[position].x + (players[position].width/2)),
									coordToPoint(players[position].y + (players[position].height/2)), 
									players[position].bombStr, 
									players[position].detonateTime, 
									players[position].explodeDuration);
			}
			
			return bomb;
		},
		
		//******************************************************************************
		//	This function is the public API for when other players planted a bomb
		//******************************************************************************
		plantBomb : function (playerId, bombInterface) {
			if( !gameStarted ) { return; }
			
			var bomb,
				position = findPlayerPositionById(playerId);
			
			if(position >= 0 && position < players.length) {
				bomb = plantBomb (	playerId, 
									players[position], 
									coordToPoint(bombInterface.x),
									coordToPoint(bombInterface.y),
									bombInterface.s, 
									bombInterface.dT, 
									bombInterface.eD);
			}
			
			return bomb;
		},
		
		//******************************************************************************
		//	This function is to perform a change in direction for the player
		//******************************************************************************
		changeDirection : function (playerId, direction) {
			if( !gameStarted ) { return; }
			
			var position = findPlayerPositionById(playerId);
			
			if(position >= 0 && position < players.length) {
				switch(direction)
				{
					case Bomberman.Common.Direction.UP:
						players[position].up = true;
						break;
					case Bomberman.Common.Direction.DOWN:
						players[position].down = true;
						break;
					case Bomberman.Common.Direction.LEFT:
						players[position].left = true;
						break;
					case Bomberman.Common.Direction.RIGHT:
						players[position].right = true;
						break;
					default:
						break;
				}
			}
		},
		
		//******************************************************************************
		//	This function is to perform a stop in direction for the player
		//******************************************************************************
		stopDirection : function (playerId, direction) {
			if( !gameStarted ) { return; }
			
			var position = findPlayerPositionById(playerId);
			
			if(position >= 0 && position < players.length) {
				switch(direction)
				{
					case Bomberman.Common.Direction.UP:
						players[position].up = false;
						break;
					case Bomberman.Common.Direction.DOWN:
						players[position].down = false;
						break;
					case Bomberman.Common.Direction.LEFT:
						players[position].left = false;
						break;
					case Bomberman.Common.Direction.RIGHT:
						players[position].right = false;
						break;
					default:
						break;
				}
			}
		},
		
		//******************************************************************************
		//	This function gets the player by its id
		//******************************************************************************
		getPlayer : function (playerId) {
			return players[findPlayerPositionById(playerId)];
		},
		
		//******************************************************************************
		//	This function updates the player from engine
		//******************************************************************************
		updatePlayer : function (playerId, bombermanInterface) {
			if( !gameStarted ) { return; }
			
			var position = findPlayerPositionById(playerId);
			
			if( position >= 0 && position < players.length ) {
				// Update
				players[position].update(bombermanInterface);
			}
		},
		
		//******************************************************************************
		//	This function updates the player's coordinates from engine
		//******************************************************************************
		updatePlayerPosition : function (playerId, coordinates) {
			if( !gameStarted ) { return; }
			
			var position = findPlayerPositionById(playerId);
			
			if( position >= 0 && position < players.length ) {
				// Update
				players[position].updateCoordinates(coordinates);
			}
		},
		
		//******************************************************************************
		//	This function removes the player from engine
		//******************************************************************************
		removePlayer : function (playerId) {
			var position = findPlayerPositionById(playerId);
			
			players.splice(position, 1);
		},
		
		//******************************************************************************
		//	This function performs the funeral for the dead player
		//******************************************************************************
		playerDied : function (killerId, victimId, x, y) {
			var killerPosition = findPlayerPositionById(killerId),
				victimPosition = findPlayerPositionById(victimId);
			
			if( (killerPosition >= 0 && killerPosition < players.length) &&
				(victimPosition >= 0 && victimPosition < players.length) ) {	
				
				if(killerId != victimId) { players[killerPosition].kills ++; }
				
				players[victimPosition].respawn();
											
				players[victimPosition].move(x, y);
			}
		},
		
		//******************************************************************************
		//	This function performs name changing for the player
		//******************************************************************************
		changeName : function (newName) {
			players[playerId].name = newName;
		}
	};
}
