const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Path = require("path")

var mainWindow = null;

console.log("inside here!")
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
// TODO remote connect to main ipc on
