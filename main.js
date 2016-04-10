'use strict';

const files = require("./NScripts/files.js");
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

var mainWindow = null;
var timerWindow = null;
var selectedTask = null;
var runningTimer = null;

// TODO: change this to dictionary and make index as key.
// assign new index to new tasks which doesn't conflict.
var tasks = [];
var newTaskIndex = 0;

app.on('window-all-closed', function() {
	if(process.platform != 'darwin')
		app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width:600, height:660,
		icon:"./Resources/icon256.png"
	});
	mainWindow.loadURL("file://"+__dirname+"/mainPage.html")

	console.log(mainWindow.getSize());
	// mainWindow.setSize(size)

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
app.on("before-quit", function() {
	saveData();
	// files.saveData("./tasks", tasks);
})

ipc.on("getTasks", function(event) {
	event.returnValue = tasks;
})
ipc.on("getTask", function(event, taskIndex) {
	// const _task = new Task(taskName);
	const retVal = findTask(taskIndex)
	event.returnValue = retVal;
});

function createNewTask(name, icon, parent) {
	const task = new Task(name, icon, newTaskIndex);
	task.parent = parent;

	console.log(parent);
	console.log(task);
	if(parent!= null){
		var _parent= findTask(parent)
		if(_parent.parent != null)
			_parent = findTask(_parent.parent)

		console.log(_parent);
		_parent.children.push(task.index)
		console.log(task);
	}
	tasks.push(task);

	newTaskIndex+=1;

	return task
}
ipc.on("newTask", function(event, name, icon) {

	event.returnValue = createNewTask(name, icon, null);
})
ipc.on("newChildTask", function(event, name, icon, parent) {
	event.returnValue = createNewTask(name, icon, parent);
})

ipc.on("changeName", function(event, index, name) {
	const task = findTask(index)
	task.name = name;
})
ipc.on("changeMemo", function(event, index, memo) {
	const task = findTask(index)
	task.memo = memo;
})

ipc.on("saveDataTest", function(event) {
	saveData()
})

ipc.on("loadDataTest", function(event) {
	loadData();
	event.returnValue = tasks;
})

ipc.on("delete", function(event, index) {
	// ipc.send("delete", index)
	deleteTask(index);
})

ipc.on("moveTask", function(event, targetIndex, newParentIndex) {
	const target = findTask(targetIndex);
	const newParent = findTask(newParentIndex);

	if(target.parent != null) {
		const parent = findTask(target.parent);

		console.log("splicing")
		const childIndex = parent.children.indexOf(targetIndex);
		console.log(childIndex)
		console.log(parent.children)

		parent.children.splice(childIndex, 1)

		console.log(parent, childIndex)
	}
	target.parent = newParent.index;
	newParent.children.push(target.index);

	console.log(newParent)

	event.returnValue = true;
})

ipc.on("openTimer", function (event, _selectedTask) {
	selectedTask = _selectedTask;
	timerWindow = new BrowserWindow({
		width:280, height:290, frame:false,
		resizable:false, transparent:true
	})
	timerWindow.loadURL("file://"+__dirname+"/html/timer.html")

	if(runningTimer) {
		timerWindow.webContents.on("did-finish-load", function(evemt) {
			timerWindow.webContents.send("setTimer", runningTimer);
		})
	}
})
ipc.on("startTimer", function(event, timer) {
	runningTimer = timer;
})
ipc.on("closeTimer", function(event, timer) {
	runningTimer = timer;
	timerWindow.close()
	timerWindow.destroy()
	timerWindow = null;
})
ipc.on("endTimer", function(event, success) {
	runningTimer["success"] = success;
	console.log(runningTimer)
	selectedTask.ppomos.push(runningTimer)
	runningTimer = null;
})

// TODO: change this as recursive
// remove every child which has removed parent
function deleteTask(taskIndex) {
	const _task = findTask(taskIndex);
	console.log(_task)

	if(_task != null) {
		const target = popTask(_task.index, 1)[0]
		console.log(_task)
		console.log(target)

		console.log(target.parent)
		if(target.parent != null) {
			const parent = findTask(target.parent)

			console.log(parent)
			console.log(parent.children)

			const childIndex = parent.children.indexOf(taskIndex)
			console.log(childIndex)
			parent.children.splice(childIndex, 1)
		}

		if(target.children.length != 0) {
			for(const i in target.children) {
				const _childTask = target.children[i];

				popTask(_childTask.index,1);
			}
		}
	}
}

function findTask(taskIndex) {
	var retVal = null;

	for(const i in tasks) {
		const _task = tasks[i];
		if(_task.index == taskIndex) {
			retVal = _task;
			break;
		}
	}

	return retVal;
}
function popTask(taskIndex, size) {
	var retVal = null;

	for(const i in tasks) {
		const _task = tasks[i];
		if(_task.index == taskIndex) {
			retVal = tasks.splice(i, size)
			break;
		}
	}

	return retVal;
}

function loadData() {
	const datas = files.loadData("./tasks")
	const loadedData = datas["tasks"]
	newTaskIndex = datas["newTaskIndex"]

	if(newTaskIndex == null)
		newTaskIndex = 0;

	if(loadedData == []) {
		saveData();
	} else if (tasks.length == 0) {
		// create loadedDAta to task class
		const parseFunction = function(task) {
			const _task = new Task(task.name, task.icon, task.index)
			_task.parent = task.parent;
			_task.memo = task.memo;
			_task.children = task.children;
			// console.log(_task)
			// console.log(task)

			// for(const _index in task.children) {
			// 	console.log(_index)
			// 	console.log(task.children[_index])
			// 	_task.children.push(parseFunction(task.children[_index]))
			// }

			return _task;
		}
		for(const _index in loadedData) {
			tasks.push(parseFunction(loadedData[_index]))
		}
	}
}

function saveData() {
	console.log(newTaskIndex)
	files.saveData("./tasks", tasks, newTaskIndex);
	// localStorage.saveData("tasks", tasks);
	// localStorage.saveData("taskIndex", newTaskIndex);
}
loadData();
console.log(newTaskIndex)
console.log(tasks)

if(tasks.length == 0) {
	const _taskd = createNewTask("뽀모도로", "./Resources/glyphicons/png/glyphicons-1-glass.png", null);
}

function Task(taskName, icon, index) {
	var name = taskName;
	var icon = icon;
	var index = index;
	var memo = null;
	var children = [];
	var parent = null;
	var ppomos = [];

	return {
		name : name,
		icon : icon,
		index : index,
		memo : memo,
		children : children,
		parent : parent,
		ppomos : ppomos
	};
}
