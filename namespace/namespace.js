
Namespace = (function () {
	var that = {};
	
	that.register = function (namespace, object) {
		var cutAt = namespace.indexOf("."),
			remainingNamespace = namespace.substring(cutAt+1, namespace.length),
			checkNamespace = (cutAt < 0) ? namespace : namespace.substring(0, cutAt);
		
		if(!object) {
			object = window;
		}
		
		if(!object[checkNamespace]) {
			object[checkNamespace] = {};
		}
		
		if(cutAt > 0) {
			that.register(remainingNamespace, object[checkNamespace]);
		}
	}
	
	return that;
}());