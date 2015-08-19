Namespace.register("Bomberman");

/*******************************************************
 *	This is an Audio Manager, all audio will only be
 *	loaded in this class. Playing of audio will also go
 *	through this class.
 *******************************************************/
Bomberman.AudioManager = (function () {
	var audio = [];
	
	//audio[0] = new Audio("/audio/bomb.mp3");
	
	return {
		// Items Index
		Explosion		: 0,
		
		playAudio : function (index) {
			//if(audio[index].networkState === 1) {
			//	audio[index].currentTime = 0;
			//	audio[index].play();
			//}
		}
	};
}());