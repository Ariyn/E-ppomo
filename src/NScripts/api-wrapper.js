var events = require("events");
var util = require("util");
var EventEmitter = events.EventEmitter;

// http://stackoverflow.com/questions/12150540/javascript-eventemitter-multiple-events-once
EventEmitter.prototype.whole = function(events, handler) {
	if(! events)
		return;

	if(!(events instanceof Array))
		events = [events];

	var _this = this;
	_this.eventWholeList = events;
	_this.eventWholeArguments = {};

	var genCB = function(eventName) {
		var cb = function() {
			console.log(eventName)
			_this.removeListener(eventName, cb);

			_this.eventWholeList.splice(_this.eventWholeList.indexOf(eventName), 1);
			_this.eventWholeArguments[eventName] = Array.prototype.slice.call(arguments, 0);

			console.log(_this.eventWholeArguments)

			if(_this.eventWholeList.length == 0) {
				console.log(_this.eventWholeArguments)
				handler(_this, _this.eventWholeArguments);
			}
		}

		return cb;
	}

	events.forEach(function(e) {
		// console.log("inside here")
		_this.addListener(e, genCB(e));
	});
};


module.exports = {
	EventEmitter:function() {
		return new EventEmitter();
	}
}

if(require.main == module) {
	console.log("running")
	var game = new EventEmitter()
	game.whole(["test", "test2"], function() {
		console.log("running callback!!!")
		console.log(arguments[1])
	})

	game.emit("test2", 2, 2, 3)
	game.emit("test", 1)
}
