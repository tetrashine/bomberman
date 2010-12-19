Namespace.register("Bomberman.Common");

/*******************************************************
 *	This is an enumerator of the directions available
 *	for the bomberman to move. To emulate the properties
 *	of a emulator, Direction has already been declared
 *	as a singleton class as there is no need to declare 
 *	multiple Direction objects.
 *******************************************************/
Bomberman.Common.Direction = (function () {
	return {
		UP		: 1,
		DOWN	: 2,
		LEFT	: 3,
		RIGHT	: 4
	};
}());