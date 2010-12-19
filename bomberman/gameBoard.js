Namespace.register("Bomberman");

/*******************************************************
 *	This is the gameboard that collects all the objects.
 *	This is for easier detection of objects in the grid.
 *******************************************************/
Bomberman.GameBoard = function (map) {
	var i, 
		j,
		isEmpty,
		rows = map.length,
		cols = map[0].length,
		gameBoard = [];

	// Initialize game board
	for( i = 0; i < rows; i++ ) {
		gameBoard[i] = [];
		for( j = 0; j < cols; j++ ) {
			gameBoard[i][j] = [];
			
			isEmpty = (map[i][j] === 0);
			gameBoard[i][j].push(new Bomberman.GameObjects.GameBoardTile(isEmpty, isEmpty, isEmpty));
		}
	}
	
	//******************************************************************************
	//	This function returns whether the particular tile can be walk on.
	//******************************************************************************
	function tileWalkable (tile) {
		return tile.isWalkable;
	}
	
	//******************************************************************************
	//	This function returns whether the particular tile can be planted on.
	//******************************************************************************
	function tilePlantable (tile) {
		return tile.canBePlanted;
	}
	
	//******************************************************************************
	//	This function returns whether the particular tile can be exploded through.
	//******************************************************************************
	function tileExplodableThru (tile) {
		return tile.canBeExplodedThru;
	}
		
	//******************************************************************************
	//	This function returns whether the coordinate is beyond the game board.
	//******************************************************************************
	function beyondGameBoard (x, y) {
		return (y >= rows || x >= cols || x < 0 || y < 0);
	}
		
	return {
		
		//******************************************************************************
		//	This function get all the game objects on a particular coordinate.
		//******************************************************************************
		getGameObjects : function (x, y) {
			return gameBoard[y][x];
		},
		
		//******************************************************************************
		//	This function add a new game object to a particular tile on a particular
		//	coordinate.
		//******************************************************************************
		addGameObject : function (x, y, gameObject) {
			gameBoard[y][x].push(gameObject);
		},
		
		//******************************************************************************
		//	This function remove a particular game object to a particular tile on a 
		//	particular coordinate.
		//******************************************************************************
		removeGameObject : function (x, y, gameObject) {
			if(beyondGameBoard(x, y)) { return false; }
			
			var index = gameBoard[y][x].indexOf(gameObject);
			
			if(index < 0) { return false; }
			
			gameBoard[y][x].splice(index, 1);
			
			return true;
		},

		//******************************************************************************
		//	This function returns whether the tile from the coordinate is walkable
		//******************************************************************************
		isTileMovable : function (x, y) {
			if(beyondGameBoard(x, y)) { return false; }
			
			return gameBoard[y][x].every( tileWalkable );
		},
		
		//******************************************************************************
		//	This function returns whether the tile can be planted on.
		//******************************************************************************
		canBePlanted : function (x, y) {
			if(beyondGameBoard(x, y)) { return false; }
			
			return gameBoard[y][x].every( tilePlantable );
		},
		
		//******************************************************************************
		//	This function returns whether the tile can be exploded through.
		//******************************************************************************
		canExplodeThru : function (x, y) {
			if(beyondGameBoard(x, y)) { return false; }
			
			return gameBoard[y][x].every( tileExplodableThru );
		},
		
		//******************************************************************************
		//	This function removes all the explodable on a particular tile base on the
		//	input coordinate
		//******************************************************************************
		removeAllExplodable : function (x, y) {
			var i,
				explodables = [],
				length = gameBoard[y][x].length;
				
			if(beyondGameBoard(x, y)) { return false; }
				
			for( i = length-1; i >= 0; i-- ) {
				if(gameBoard[y][x][i].canBeExploded) {
					explodables.push(gameBoard[y][x][i]);
					
					gameBoard[y][x].splice(i, 1);
				}
			}
			
			return explodables;
		}
	};
}