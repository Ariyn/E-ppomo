'use strict';

const ls = localStorage
const ipc = require("electron").ipcRenderer

console.log(ipc)
ipc.on("saveData", function(event, name, data) {
	console.log("save")

	ls.setItem(name, data)
})

ipc.on("loadData", function(event, name, id) {
	console.log("load here")

	setTimeout(function() {
		console.log("loading")

		const data = ls.getItem(name);
		event.sender.send("loadData-tb", data, id)
	}, 100);
})

console.log("here")
