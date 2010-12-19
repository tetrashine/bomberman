/*******************************************************
 *	This is a wrapper to the socket class. The observer
 *	must register to the message event and disconnect
 *	event. Currently, there is no registration.
 *******************************************************/
Socket = function (inObserver, portNo) {
	var socket = new io.Socket(null, {port: portNo}),
		dcSubscribers = [],
		msgSubscribers = [],
		observer = inObserver;
	
	//******************************************************************************
	//	On connection to the server
	//******************************************************************************
	socket.on('connect', function(server) {
	});
	
	//******************************************************************************
	//	On receiving message from the server
	//******************************************************************************
	socket.on('message', function(msg) {
		for (var i in msgSubscribers) {
			msgSubscribers[i](msg);
		}
	});
	
	//******************************************************************************
	//	On disconnecting from the server
	//******************************************************************************
	socket.on('disconnect', function() {
		for (var i in dcSubscribers) {
			dcSubscribers[i]();
		}
	});
	
	return {
		//******************************************************************************
		//	Connect to the server
		//******************************************************************************
		connect : function(){
			socket.connect();
		},
		
		//******************************************************************************
		//	Send message to the server to be broadcasted
		//******************************************************************************
		send : function (msg) {
			socket.send(msg);
		},
		
		subscribeEvent : function (event, callback) {
			switch(event) {
				case "message":
					msgSubscribers.push(callback);
					break;
				case "disconnect":
					dcSubscribers.push(callback);
					break;
			}
		}
	};
}