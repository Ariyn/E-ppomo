'use strict';

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;


var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

var saveWindow = null;
var wc = null;

var loadQueue = {};

// preload:"file://"+__dirname+"/Scripts/ls.js"

function init() {
	saveWindow = new BrowserWindow({
		width:100, height:100,
		// show:false
	})
	saveWindow.loadURL("file://"+__dirname+"/../html/ls.html")
	wc = saveWindow.webContents;
	wc.openDevTools();
}

function saveData(name, data) {
	wc.send("saveData", name, JSON.stringify(data))
}
function loadData(name, callback) {
	const _id = (function() {
		var text = "";
		for( var i=0; i < 5; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	})()
	wc.send("loadData", name, _id)

	loadQueue[_id] = {
		"callback":callback
	}
}


function onLoad(callback) {
	wc.on("did-finish-load", callback);
}

ipc.on("loadData-tb", function(event, data, id) {
	console.log("tb", id, data)

	loadQueue[id]["callback"](JSON.parse(data))
})
//mainWindow.loadURL("file://"+__dirname+"/html/ls.html")

module.exports = {
	init: init,
	saveData : saveData,
	loadData : loadData,
	onLoad:onLoad
}
