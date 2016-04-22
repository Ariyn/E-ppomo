// const ls = require("./NScript/LocalStorage.js")
const files = require("./NScripts/files.js");
const google = require("./NScripts/google-api.js");
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
const Path = require("path")

console.log("running")
// TODO: change windows to dictionary
var mainWindow = null;
var timerWindow = null;
var visualWindow = null;
var selectedTask = null;
var runningTimer = null;

var ipcOnList = [];

// TODO: 동기부여
// API들 이용해 문가 할 수 있도록
// TODO: change this to dictionary and make index as key.
// assign new index to new tasks which doesn't conflict.
var tasks = [];
var newTaskIndex = 0;

var trayApp = null;

function createNewTask(name, icon, parent) {
	const task = new Task(name, icon, newTaskIndex);
	task.parent = parent;

	// console.log(parent);
	// console.log(task);
	if(parent !== null){
		var _parent= findTask(parent)
		// if(_parent.parent !== null)
		// 	_parent = findTask(_parent.parent)

		// console.log(_parent);
		_parent.children.push(task.index)
		// console.log(task);
	}
	tasks.push(task);

	newTaskIndex+=1;

	return task
}
function openMainWindow() {
	mainWindow = new BrowserWindow({
		width:600, height:660,
		icon:"./Resources/icon256.png"
	});
	mainWindow.loadURL("file://"+__dirname+"/html/mainPage.html")

	mainWindow.on('closed', function() {
		saveData();
		mainWindow = null;
	});
}

function deleteTask(taskIndex) {
	const target = findTask(taskIndex);
	// console.log(target)
	if(target === null) {
		return false;
	}

	while(target.children.length !== 0) {
	// for(const i in target.children) {
		console.log("removing recursive "+target.children)
		deleteTask(target.children[0])
	}

	popTask(target.index)

	// console.log(target.parent)
	if(target.parent !== null) {
		const parent = findTask(target.parent)
		console.log("parent", parent, target.parent)
		popByValue(parent.children, taskIndex);

		// const childIndex = parent.children.indexOf(taskIndex)
		// parent.children.splice(childIndex, 1)
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

function popByValue(list, value) {
	var retVal = [null];

	const childIndex = list.indexOf(value)
	if(childIndex != -1)
		retVal = list.splice(childIndex, 1);

	return retVal[0];
}
function popTask(taskIndex) {
	var retVal = [null];

	for(const i in tasks) {
		if(tasks[i].index == taskIndex) {
			retVal = tasks.splice(i, 1)
			break;
		}
	}

	return retVal[0];
}

function saveData(callback) {
	console.log(newTaskIndex)
	if(tasks !== null && newTaskIndex !== null)
		files.saveData("./tasks", tasks, newTaskIndex, runningTimer, callback);
	// localStorage.saveData("tasks", tasks);
	// localStorage.saveData("taskIndex", newTaskIndex);
}


function loadData() {
	var datas = files.loadData("./tasks")

	if(datas.constructor === Array && datas.length === 0) {
		const _taskd = createNewTask("뽀모도로", "../Resources/glyphicons/png/glyphicons-1-glass.png", null);

		saveData(loadData);
		datas = files.loadData("./tasks")
	}

	const loadedData = datas.tasks

	newTaskIndex = datas.newTaskIndex
	runningTimer = datas.runningtimer

	if(newTaskIndex === null)
		newTaskIndex = 0;

	if (tasks.length === 0) {
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

/*
obj = {
	children:[obj],
	depth:0,
	id:0,
	name:"name",
	x:0,
	x0:0,
	y:0,
	y0:0
}*/
function parseNode() {
	var lists = []

	for(const i in tasks) {
		if(tasks[i].parent === null) {
			lists.push(i)
		}
	}

	var retVal = {
		children:_parseNode(lists),
		name:"root",
		x0:0,
		y0:0
	}

	console.log(retVal)

	return retVal;
}
function _parseNode(target) {
	var lists = []

	console.log("target", target, target.children)
	for(const i in target) {
		// const _target = target.children[i];
		const _target = findTask(target[i]);

		if(_target !== null) {
			lists.push({
				children:_parseNode(_target.children),
				name : _target.name,
				index: _target.index
			})
			console.log(_target)
		}
	}


	console.log("lists", lists, "target", target)

	if(lists.length === 0) {
		return null;
	} else {
		return lists;
	}
}

function Task(taskName, _icon, _index) {
	var name = taskName;
	var icon = _icon;
	var index = _index;
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




// MODULE: start
if(require.main == module) {
console.log("direct")

app.on('ready', function() {
	// ls.init();
	openMainWindow();

	trayApp = new Tray(Path.join(__dirname,"Resources/icon256.png"))
	var contextMenu = Menu.buildFromTemplate([
		{label:"Tasks", click:function() {
			openMainWindow()
		}},
		{label:"Quit", click:function() {
			app.quit();
		}},
	])
	trayApp.setToolTip("Ppomodoro")
	trayApp.setContextMenu(contextMenu)
	google.EventEmitter.emit("app-ready")
});
app.on('window-all-closed', function() {
	// if(process.platform != 'darwin')
		// app.quit();
});
// app.on("before-quit", function() {
// 	saveData();
// 	// files.saveData("./tasks", tasks);
// })

ipc.on("getTasks", function(event, type) {
	var retVal = null;
	console.log("type", type)
	if(type == "d3") {
		retVal = parseNode()
	} else if(type === undefined)
		retVal = tasks;

	event.returnValue = retVal;
})
ipc.on("getTask", function(event, taskIndex) {
	// const _task = new Task(taskName);
	const retVal = findTask(taskIndex)
	event.returnValue = retVal;
});
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

	if(target.parent !== null) {
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
	runningTimer.task = selectedTask;
})
ipc.on("closeTimer", function(event, timer) {
	runningTimer = timer;
	timerWindow.close()
	timerWindow.destroy()
	timerWindow = null;
})
ipc.on("endTimer", function(event, success) {
	runningTimer.success = success;
	console.log(runningTimer)
	runningTimer.task.ppomos.push(runningTimer)
	runningTimer = null;
})
ipc.on("openVisualizer", function(event, task) {
	visualWindow = new BrowserWindow({
		width:600, height:660
	})
	visualWindow.loadURL("file::/"+__dirname+"/html/taskVisualizer.html")
})

ipc.on("sync", function(event, type) {
	console.log(type)
	if(type == "google-calendar") {
		google.EventEmitter.once("authDone", function() {
			const auth = google.getAuth();
			var calendar = google.calendar;

			calendar.calendarList.list({
				auth: auth,
				minAccessRole:"owner"
			}, function(err, response) {
				var hasPORT = false;
				if (err) {
					console.log('The API returned an error: ' + err);
					return;
				}
				var calendars = response.items;
				if (calendars.length === 0) {
					console.log('No upcoming events found.');
				} else {
					for (var i = 0; i < calendars.length; i++) {
						var calendar = calendars[i];
						console.log(calendar["id"], calendar["summary"])
						if("port" == calendar["summary"]) {
							hasPORT = true;
						}
					}

					if(! hasPORT) {
						google.createPORTCalendar({
								type:"default"
							}, function(object) {
							console.log(object["summary"]+" has been made.\n\tid="+object["id"]);
						})
					} else {

					}
				}
			});
		})
		google.authFlow();
	}
})

loadData();
} else {
	// console.log(require.main)
	loadData();
}

// setFlags == means which ipc handlers
module.exports = function(){
	if(setFlags !== undefined) {

	}

	return {
		deleteTask:deleteTask,
		tasks:tasks,
		createNewTask:createNewTask,
		parseNode: parseNode
	}
}
