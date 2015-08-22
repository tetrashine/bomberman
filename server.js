// includes
require(__dirname + '/server/serverEngine.js');
require(__dirname + '/bomberman/data/coordinates.js');
require(__dirname + '/bomberman/data/bombermanInterface.js');

console.log(__dirname);
var   http = require('http'), 
		url = require('url'),
		 fs = require('fs'),
		 io = require('socket.io'),
		sys = require('sys');

// variables
var idList = new Array();

server = http.createServer(function(req, res){
	var path = url.parse(req.url).pathname;
	var folders = path.split("/");
	var check = (folders.length > 2) ? folders[1] : path;
	getType(path);
	switch (check){
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<h1>Welcome. Try the <a href="/client.html">bomberman</a> example.</h1>');
			res.end();
			break;
		case 'audio':
			/*fs.readFile(__dirname + path, function (err, data){
				if (err) {
					return send404(res);
				}
				res.writeHead(200, {'Content-Length': data.length, 'Content-Type': 'audio/mpeg', 'Accept-Ranges':'bytes'})
				res.write(data, 'binary');
				res.end();
			});*/
			
			/*fs.stat(__dirname + path, function (err, stats) {
				if (err) {
					return send404(res);
				}
				res.writeHead(200, {'Content-Length':stats.size, 
									'Content-Type':'audio/mpeg', 
									'Last-Modified':stats.mtime,
									'Accept-Ranges':'bytes',
									'Date':(new Date())})
			});
			
			var stream = fs.createReadStream(__dirname + path, {'flags':'r', 
																'encoding':'binary', 
																'mode':0666, 
																'bufferSize':1024});
			
			stream.on('data', function (buffer) {
				res.write(buffer, 'binary');
			});

			stream.on('end', function () {
				res.end();
			});*/
			break;
		case 'base':
		case 'data':
		case 'server':
		case 'images':
		case 'library':
		case 'namespace':
		case 'bomberman':
		case 'application':
		case '/client.html':
			fs.readFile(__dirname + path, function (err, data){
				if (err) {
					return send404(res);
				}
				res.writeHead(200, {'Content-Type': getType(path)})
				res.write(data, 'utf8');
				res.end();
			});
			break;
		
		default: send404(res);
	}
});

server.listen(8080);

	var socket = io.listen(server);
	//var socket = new io(8080);
	var buffer = [];
	
socket.on('connection', function (client) {
	
	if (Server.ServerEngine.numOfPlayers < Server.ServerEngine.MaxNumberOfPlayers) {
		
		// If there is a list of disconnected ppl, we get from the list.
		// If not we just increment the numOfPlayers and use that
		var i, 
			playerId,
			bomberman,
			playersArray = [];
		
		if( idList.length === 0 ) {
			playerId = Server.ServerEngine.numOfPlayers++;
		} else {
			playerId = idList.pop();
			Server.ServerEngine.numOfPlayers++;
		}
		
		// send the initial state of other players
		client.emit('message', {id: playerId, code: Server.ServerEngine.Initial, players: JSON.stringify(Server.ServerEngine.players)});
		
		bomberman = new Bomberman.Data.BombermanInterface();
		bomberman.playerId = playerId;
		
		Server.ServerEngine.players.push(bomberman);
		Server.ServerEngine.clients.push(client);
	}
	
	client.on('message', function (msg) {
		if(Server.ServerEngine.numOfPlayers == 0) { return; }
	
		// Tell everyone else about the message
		client.broadcast.emit('message', msg);
		
		if( msg.code === Server.ServerEngine.UpdatePlayer ) {
			var position = getPlayerThruId(msg.id),
				bombermanInterface = JSON.parse(msg.bomberman);
				
			Server.ServerEngine.players[position].update(bombermanInterface);
		} else if( msg.code === Server.ServerEngine.UpdatePosition ) {	
			var position = getPlayerThruId(msg.id),
				coordinates = JSON.parse(msg.cd);

			Server.ServerEngine.players[position].updateCoordinates(coordinates);	
		} else if( msg.code === Server.ServerEngine.Died ) {
			
			var victimPosition = getPlayerThruId(msg.id);
			var killerPosition = getPlayerThruId(msg.killerId);
				
			Server.ServerEngine.players[victimPosition].deaths ++;
			Server.ServerEngine.players[killerPosition].kills ++;
		}
	});

	client.on('disconnect', function () {
		// remove the element
		var position = getPlayerThruSocket (client),
			playerId = Server.ServerEngine.players[position].playerId;
		
		idList.push(playerId);
		
		Server.ServerEngine.players.splice(position, 1);
		Server.ServerEngine.clients.splice(position, 1);
		
		//Server.ServerEngine.numOfPlayers--;

		if (--Server.ServerEngine.numOfPlayers > 0) {
			client.broadcast.emit('message', { code: Server.ServerEngine.Disconnect, id: playerId });
		}
	});

	client.on('chat', function(msg) {
		client.broadcast.emit('chat', msg);
	});
});

//******************************************************************************
//	This function runs through the entire list of the 
//	socket.io client and return the playerId of the player.
//******************************************************************************
getPlayerThruSocket = function (client) {
	var position = -1,
		length = Server.ServerEngine.clients.length;
		
	for( position = 0; position < length; position++ ) {
		if(Server.ServerEngine.clients[position] === client)	{
			return position;
		}
	}
}

//******************************************************************************
//	This function runs through the entire list of the 
//	players and return the position of the player.
//******************************************************************************
getPlayerThruId = function (playerId) {
	var position = -1,
		length = Server.ServerEngine.numOfPlayers;
	
	for( position = 0; position < length; position++ ) {
		if(Server.ServerEngine.players[position].playerId === playerId)	{
			return position;
		}
	}
}

//******************************************************************************
//	This function gets the type of the data to be sent across.
//******************************************************************************
getType = function (path) {
	var index = path.lastIndexOf("."),
		ret = "";
	switch(path.substr(index+1, path.length-index)) {
		case "js":
			ret = 'text/javascript';
			break;
		case "mp3":
			ret = 'audio/mpeg';
			break;
		default:
			ret = 'text/html';
			break;
	}
	
	return ret;
};

//******************************************************************************
//	This function writes 404 error to the client
//******************************************************************************
send404 = function (res) {
	res.writeHead(404);
	res.write('404');
	res.end();
};