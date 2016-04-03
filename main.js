'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

var mainWindow = null;

var tasks = [];

app.on('window-all-closed', function() {
	if(process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width:800, height:600});
	mainWindow.loadURL("file://"+__dirname+"/mainPage.html")

	console.log(mainWindow.getSize());
	// mainWindow.setSize(size)

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});


ipc.on("getTask", function(event, taskName) {
	const _task = new Task(taskName);
	event.returnValue = _task;
	console.log(_task);
});

function Task(taskName) {
	var name = taskName;

	
	return {
		name : name
	};
}
