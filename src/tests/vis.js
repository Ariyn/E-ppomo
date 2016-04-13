const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Path = require("path")
const main = require("../main.js")(setFlags=["getTasks"])

var mainWindow = null;

app.on('window-all-closed', function() {
	// if(process.platform != 'darwin')
	app.quit();
});

app.on('ready', function() {
	// ls.init();
	openMainWindow();
})

function openMainWindow() {
	mainWindow = new BrowserWindow({
		width:600, height:660,
		icon:"./Resources/icon256.png"
	});
	mainWindow.loadURL("file://"+__dirname+"/../html/taskVisualizer.html")

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
}

ipc.on("getTasks", function(event, type) {
	var retVal = null;
	console.log("type", type)
	if(type == "d3") {
		retVal = main.parseNode(main.tasks)
	} else if(type === undefined)
		retVal = main.tasks;

	console.log(main.tasks)
	console.log(retVal)
	event.returnValue = retVal;
})
// TODO remote connect to main ipc on

// ipc.on("getTasks", )
