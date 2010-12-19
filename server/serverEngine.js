// In Nodejs, window does not exist.
if(typeof window === 'undefined') {
	Server = {};
} else {
	Namespace.register("Server");
}

/*******************************************************
 *	This class is a enumerator to be used between the
 *	client and the server. This is the message codes for
 *	all the message transmission.
 *******************************************************/
Server.ServerEngine = (function () {

	return {
		numOfPlayers		: 0,
		MaxNumberOfPlayers	: 5,
		players				: [],
		clients				: [],
		Initial				: 1,		// Done
		Plant				: 2,		// Planting of bomb
		Died				: 3,		// Player died
		Disconnect			: 4,		// Player disconnected
		UpdatePlayer		: 5,		// Updating of all player information
		UpdatePosition		: 6,		// Updating of coordinates and name information
		NewPlayer			: 7			// A new player has connected to the server
	};
}());

if(typeof window === 'undefined') {
	exports.Server = Server;
	exports.Server.ServerEngine = Server.ServerEngine;
}