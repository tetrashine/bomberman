Namespace.register("Bomberman.Data");

/*******************************************************
 *	This class is a subset of the information stored
 *	in the bomberman class. It is used to retrieve 
 *	the statistics information of the player's score.
 *******************************************************/
Bomberman.Data.PlayerScore = function (bomberman) {

		var that				= {};
		
		// Details
		that.playerId			= bomberman.playerId;
		that.name				= bomberman.name;
		
		// Statistics
		that.kills				= bomberman.kills;
		that.deaths				= bomberman.deaths;
		
		return that;
}