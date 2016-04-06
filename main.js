'use strict';

const files = require("./NScripts/files.js");
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
	mainWindow = new BrowserWindow({width:600, height:660});
	mainWindow.loadURL("file://"+__dirname+"/mainPage.html")

	console.log(mainWindow.getSize());
	// mainWindow.setSize(size)

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
app.on("before-quit", function() {
	files.saveData("./tasks", tasks);
})

ipc.on("getTasks", function(event) {
	event.returnValue = tasks;
})
ipc.on("getTask", function(event, taskIndex) {
	// const _task = new Task(taskName);
	if(taskIndex <= tasks.length)
		event.returnValue = tasks[taskIndex];
	else
		event.returnValue = null;
});

ipc.on("newTask", function(event, name, icon) {
	const task = new Task(name, icon, tasks.length);
	tasks.push(task);
	event.returnValue = task;
})

ipc.on("changeName", function(event, index, name) {
	tasks[index].name = name;
})
ipc.on("changeMemo", function(event, index, memo) {
	tasks[index].memo = memo;
})

ipc.on("saveDataTest", function(event) {
	saveData()
})

ipc.on("loadDataTest", function(event) {
	loadData();
	event.returnValue = tasks;
})

function loadData() {
	const loadedData = files.loadData("./tasks")

	if(loadedData == []) {
		saveData();
	} else {
		tasks = loadedData;
	}
}
function saveData() {
	files.saveData("./tasks", tasks);
}

loadData();

if(tasks.length == 0)
	tasks.push(new Task("뽀모도로", "./Resources/glyphicons/png/glyphicons-1-glass.png", tasks.length))
console.log(tasks.length)

function Task(taskName, icon, index) {
	var name = taskName;
	var icon = icon;
	var index = index;
	var memo = null;

	return {
		name : name,
		icon : icon,
		index : index,
		memo : memo
	};
}
