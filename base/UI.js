/*******************************************************
 *	This class performs drawing to the UI class.
 *	This is to isolate the UI drawing to this class.
 *******************************************************/
var UI = (function () {
	var MapWidth 	= 1248,
		MapHeight 	= 608,
		CellWidth 	= 32,
		BombRad		= 10,
		canvas		= document.getElementById("canvas").getContext("2d"),
		background	= document.getElementById("background").getContext("2d"),
		scoreBoard 	= Raphael(MapWidth, 30, 400, MapHeight),
		alt 		= 0,
		blinkTiming = 14,
		clearStroke = {'stroke-opacity': 0},
		debugMsg	= "";
		
	//******************************************************************************
	//	This private function draws the map on the UI
	//******************************************************************************
	function drawMap(map) {
		var i = 0, j = 0, rect, 
			lenA = map.length, 
			lenB = map[0].length;	// Assuming regular map
		
		background.clearRect(0, 0, MapWidth, MapHeight);
		
		for(i=0; i<lenA; i++)
		{
			for(j=0; j<lenB; j++)
			{
				if(map[i][j] === 0) {
					background.fillStyle = "#368A00";
					background.beginPath();
					background.rect(j*CellWidth, i*CellWidth, CellWidth, CellWidth);
					background.closePath();
					background.fill();
				} else {
					background.drawImage(Bomberman.ImageManager.getImageResource(0), j*CellWidth, i*CellWidth);
				}
			}
		}
	}
	
	return {	// return singleton
		
		//******************************************************************************
		//	This public function draws the map on the UI
		//******************************************************************************
		draw : function(map) {		
			drawMap(map);
		},
		
		//******************************************************************************
		//	This public function draws the objects on the UI
		//******************************************************************************
		drawObjects : function (objects) {
			var x, rect, sourceX;
			
			for(x=0; x<objects.length; x++) {
				if(objects[x] === undefined) continue;
			
				// GameObject
				if(objects[x].image === undefined) {
					canvas.fillStyle = objects[x].color;
					canvas.beginPath();
					canvas.rect(objects[x].x, objects[x].y, objects[x].width, objects[x].height);
					canvas.closePath();
					canvas.fill();					
				// VisualGameObject
				} else if (objects[x].currentFrame === undefined){
					canvas.drawImage(objects[x].image, 0, 0, objects[x].width, objects[x].height, objects[x].x, objects[x].y, objects[x].width, objects[x].height);
				// AnimatedGameObject
				} else if (objects[x].currentType === undefined) {
					sourceX = objects[x].width * objects[x].currentFrame;
					canvas.drawImage(objects[x].image, sourceX, 0, objects[x].width, objects[x].height, objects[x].x, objects[x].y, objects[x].width, objects[x].height);
				// MultipleAnimatedGameObject
				} else {
					
					sourceX = (objects[x].currentType * objects[x].width * objects[x].numOfTypes) + (objects[x].width * objects[x].currentFrame);
					
					// Name
					canvas.fillStyle    = '#000';
					canvas.textBaseline = 'top';
					canvas.font         = '10px sans-serif';
					canvas.textAlign	= "center";
					canvas.fillText  (objects[x].name, (objects[x].x + objects[x].width/2), objects[x].y-18);
					
					// Image
					canvas.drawImage(objects[x].image, sourceX, 0, objects[x].width, objects[x].height, objects[x].x, objects[x].y, objects[x].width, objects[x].height);
					
					if(objects[x].invisible && alt > blinkTiming/2) {
						canvas.fillStyle = "rgba(54, 138, 0, 0.5)";
						canvas.beginPath();
						canvas.rect(objects[x].x, objects[x].y, objects[x].width, objects[x].height);
						canvas.closePath();
						canvas.fill();
					}
				}
			}
			
			alt = (alt+1) % blinkTiming;
		},
		
		//******************************************************************************
		//	This public function draws the game objects on the UI. The map will still 
		//	remain
		//******************************************************************************
		clear : function () {
			canvas.clearRect(0, 0, MapWidth, MapHeight);
		},
		
		//******************************************************************************
		//	This public function writes a debug message on the UI
		//******************************************************************************
		writeDebugMessage : function (message) {
			// Name
			canvas.fillStyle    = '#000';
			canvas.textBaseline = 'top';
			canvas.font         = '30px sans-serif';
			canvas.textAlign	= "center";
			canvas.fillText  (message, MapWidth/2, MapHeight/2.5);
		},
		
		//******************************************************************************
		//	This public function writes the score board to the UI
		//******************************************************************************
		writeScoreBoard : function (scores) {
			var i,
				text,
				length = scores.length;
				
			scoreBoard.clear();
			
			text = scoreBoard.text(120, 20, "Score Board");
			text.attr({"font-size": 20});
			
			for( i = 0; i < length; i++ ) {
				text = scoreBoard.text(120, 45+i*20, scores[i].name + " : " + scores[i].kills + " kills......." + scores[i].deaths + " deaths");
				text.attr({"font-size": 15});
			}
		},
		
		//******************************************************************************
		//	This public function returns the cell width of the UI
		//******************************************************************************
		getCellWidth : function () {
			return CellWidth;
		}
	};
}());

