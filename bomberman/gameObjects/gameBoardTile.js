Namespace.register("Bomberman.GameObjects");

/*******************************************************
 *	This is the basic building block of the game board.
 *******************************************************/
Bomberman.GameObjects.GameBoardTile = function (walkable, plantable, explodable) {

	return {
		isWalkable			: walkable,
		canBePlanted		: plantable,
		canBeExploded		: false,
		canBeExplodedThru	: explodable
	};
}