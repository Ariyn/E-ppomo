// const ls = require("./NScript/LocalStorage.js")
const files = require("./NScripts/files.js");
const google = require("./NScripts/google-api.js");
const portAPI = require("./NScripts/port-api.js");
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;
const Path = require("path")
const TaskManager = require("./NScripts/tasks");
const PpomoManager = require("./NScripts/ppomodoro.js")

console.log("running")
// TODO: change windows to dictionary
var mainWindow = null;
var timerWindow = null;
var visualWindow = null;

var teamMate = [];
var user = {};
var ipcOnList = [];

// TODO: 동기부여
// API들 이용해 문가 할 수 있도록

var trayApp = null;

function openMainWindow() {

	if(mainWindow != null) {
		mainWindow.hide()
		mainWindow.destroy()
	}
	mainWindow = new BrowserWindow({
		width:600, height:860,
		icon:"./Resources/icon256.png"
	});
	//
	mainWindow.loadURL("file://"+__dirname+"/html/mainPage.html")

	mainWindow.webContents.on("did-finish-load", function() {
		mainWindow.webContents.send("setUserData", user)
	})
	mainWindow.on('closed', function() {
		saveData();
		// saveDataPort();

		mainWindow = null;
	});
}
function openLandingPage() {
	if(mainWindow != null) {
		mainWindow.hide()
		mainWindow.destroy()
	}

	mainWindow = new BrowserWindow({
		width:530, height:660,
		icon:"./Resources/icon256.png",
		// resizable:false
	});
	// mainPage.html
	mainWindow.loadURL("file://"+__dirname+"/html/landing.html")

	// mainWindow.loadURL("file://"+__dirname+"/html/deadline.html")


	mainWindow.on('closed', function() {
		mainWindow = null;
	});
}

function saveData(callback) {
	// console.log(TaskManager.newTaskIndex)
	// if(TaskManager.getTask !== null && TaskManager.getTaskIndex() !== null)
	files.setDataPath("./tasks")
	files.saveData({
		tasks:TaskManager.getTask(),
		newTaskIndex:TaskManager.getTaskIndex(),
		ppomos:PpomoManager.getSaveDatas()
	}, callback);
}
function saveDataPort() {
	portAPI.apiPost({
		type:"saveData",
		user:user["pid"],
		tasks:JSON.stringify(tasks),
		taskIndex:newTaskIndex,
		timer:runningTimer
	})
}
function parseFunction(task) {
	const _task = new TaskManager.Task(task.name, task.icon, task.index, new Date(task.createdDate))
	_task.parent = task.parent;
	_task.memo = task.memo;

	// console.log("task children", task, task.children)
	if(task.children !== null && task.children !== undefined)
		_task.children = task.children;
	if(task.ppomos !== null && task.ppomos !== undefined)
		_task.ppomos = task.ppomos;


	if(task.deadline) {
		_task.deadLine = task.deadline;
		console.log(_task.deadLine, typeof _task.deadLine, _task.name)
	}

	return _task;
}

function loadData() {
	var datas = files.loadData("./tasks")

	if(datas.constructor === Array && datas.length === 0) {
		const _taskd = TaskManager.createNewTask("뽀모도로", "../Resources/glyphicons/png/glyphicons-1-glass.png", null);

		saveData(loadData);
		// datas = files.loadData("./tasks")
		return 0;
	}

	if(datas.ppomos !== null && datas.ppomos !== undefined) {
		PpomoManager.setSavedDatas(datas.ppomos);
	}

	const loadedData = datas.tasks
	TaskManager.setTaskIndex(datas.newTaskIndex)
	if(TaskManager.getTaskIndex() === null)
		TaskManager.setTaskIndex(0);

	if (TaskManager.getTask().length === 0) {
		// create loadedDAta to task class

		for(const _index in loadedData) {
			TaskManager.getTask().push(parseFunction(loadedData[_index]))
		}
	}

	// console.log(TaskManager)
}

// E34132 cherry tomato
// E04951 cayenne
// 97C1A1 hemlock
// 9cf5a6 hemlock 2
// 3ca555 comfrey
// ff5e33 celosia orange
// a6c2ba paloma
// 87d4fa placod blue
// 8f9cff violet tulip
// ccba85 sand
// ffdb00 freesia
// https://atelierbram.github.io/c-tiles16/colorscheming/pantone-spring-2014-colortable.html

// 00A37F
// http://color2u.cocolog-nifty.com/color4u/2014/02/pantone-tpx.html

// MODULE: start
if(require.main == module) {
console.log("direct")

app.on('ready', function() {
	// ls.init();
	// openMainWindow();
	openLandingPage();

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
	// console.log("type", type)
	if(type === undefined)
		retVal = TaskManager.getTask();
	else
		retVal = TaskManager.parseNode(type)

	event.returnValue = retVal;
});
ipc.on("getTask", function(event, taskIndex) {
	// const _task = new Task(taskName);
	const retVal = TaskManager.findTask(taskIndex)
	event.returnValue = retVal;
});
ipc.on("newTask", function(event, name, icon) {
	var d = TaskManager.createNewTask(name, icon, null);

	portAPI.apiPost({
		type:"newTask",
		user:user["pid"],
		task:JSON.stringify(d)
	})
	event.returnValue = d;
})
ipc.on("newChildTask", function(event, name, icon, parent) {
	event.returnValue = TaskManager.createNewTask(name, icon, parent);
})

ipc.on("changeName", function(event, index, name) {
	const task = TaskManager.findTask(index)
	task.name = name;
	portAPI.apiPost({
		type:"changeName",
		user:user["pid"],
		index:index,
		name:name
	})
})
ipc.on("changeMemo", function(event, index, memo) {
	const task = TaskManager.findTask(index)
	task.memo = memo;

	portAPI.apiPost({
		type:"changeMemo",
		user:user["pid"],
		index:index,
		memo:memo
	})
})

ipc.on("saveDataTest", function(event) {
	saveData()
})

ipc.on("loadDataTest", function(event) {
	loadData();
	event.returnValue = TaskManager.getTask();
})

ipc.on("delete", function(event, index) {
	// ipc.send("delete", index)

	portAPI.apiPost({
		type:"deleteTask",
		user:user["pid"],
		index:index
	}, function(data, response) {
		console.log(data)
	})

	TaskManager.deleteTask(index);
})

ipc.on("moveTask", function(event, targetIndex, newParentIndex) {
	const retVal = TaskManager.moveTask(targetIndex, newParentIndex)
	portAPI.apiPost({
		type:"moveTask",
		user:user["pid"],
		targetIndex:targetIndex,
		parentIndex:newParentIndex
	})
	event.returnValue = retVal;
})

ipc.on("doneTask", function(event, targetIndex) {
	
	doneLists = TaskManager.finishTask(index);
	// console.log(doneLists)
	// portAPI.apiPost({
	// 	type:"finishTask",
	// 	user:user["pid"],
	// 	indexes:doneLists
	// })
})

ipc.on("openTimer", function (event, _selectedTaskIndex) {
	timerWindow = new BrowserWindow({
		width:280, height:290, frame:false,
		resizable:false, transparent:true
	})
	timerWindow.loadURL("file://"+__dirname+"/html/timer.html")

	const data = PpomoManager.createNewPpomo(_selectedTaskIndex)

	// console.log("data", data)
	// console.log(_selectedTaskIndex)
	timerWindow.webContents.on("did-finish-load", function(evemt) {
		// console.log("data", data)
		timerWindow.webContents.send("setTimer", data);
	})
})
ipc.on("startTimer", function(event, timer) {

})
ipc.on("closeTimer", function(event, timer) {
	PpomoManager.updateCurrentPpomo(timer)
	timerWindow.close()
	timerWindow.destroy()

	timerWindow = null;
})
ipc.on("endTimer", function(event, timer, success) {
	// const runningTimer = findPpomodoro(timer.index)
	const _task = TaskManager.findTask(PpomoManager.getCurrentPpomo()["taskIndex"]);
	// TaskManager.findTask(runningTimer.index)
	// console.log(_task)

	PpomoManager.updateCurrentPpomo(timer)
	const currentPpomo = PpomoManager.endCurrentPpomo(success)

	// console.log(_task)
	_task.ppomos.push(currentPpomo.index)

	// console.log(_task)
	mainWindow.webContents.send("refresh")
})
ipc.on("openVisualizer", function(event, task) {
	visualWindow = new BrowserWindow({
		width:600, height:660
	})
	visualWindow.loadURL("file::/"+__dirname+"/html/taskVisualizer.html")
})


ipc.on("sync", function(event, type) {
	// console.log(type)
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
					// console.log('The API returned an error: ' + err);
					return;
				}
				var calendars = response.items;
				if (calendars.length === 0) {
					// console.log('No upcoming events found.');
				} else {
					for (var i = 0; i < calendars.length; i++) {
						var calendar = calendars[i];
						// console.log(calendar["id"], calendar["summary"])
						if("port" == calendar["summary"]) {
							hasPORT = true;
						}
					}

					if(! hasPORT) {
						google.createPORTCalendar({
								type:"default"
							}, function(object) {
							// console.log(object["summary"]+" has been made.\n\tid="+object["id"]);
						})
					} else {

					}
				}
			});
		})
		google.authFlow();
	}
})

// ipc.send("addUsers", $scope.data.addedUsers)
ipc.on("addUsers", function(event, users) {
	if(teamMate != users) {
		teamMate = users;
	}

	console.log(teamMate)
})

ipc.on("setDeadLine", function(event, index, deadLine) {
	console.log("setting deadline", new Date(deadLine))
	portAPI.apiPost({
		type:"setDeadLine",
		user:user["pid"],
		taskIndex:index,
		deadLine:Math.floor((new Date(deadLine)).getTime()/1000)
	}, function(data, response) {
		console.log(data)
	})

	TaskManager.findTask(index).deadLine = deadLine;
})
// ipc.send("setDeadline", deadLine)
// elif _type == "setDeadline":
// sql = "UPDATE tasks SET deadline=FROM_UNIXTIME('%s') WHERE localIndex='%s' AND user='%s';" %(form["deadline"].value, form["index"].value, user)
ipc.on("port-login", function(event, userName, password) {
	// console.log("logging in!")
	portAPI.apiGet({
		type:"login",
		user:userName,
		password:password
	}, function(data, response) {
		// console.log("str ='"+data+"'")
		try{
			data = JSON.parse(data)
		} catch(err) {
			console.log(err)
			data = {
				success:false,
				msg:"Server Error"
			}
		}

		// console.log(data)
		if(data["success"] === "true") {
			// console.log("success")
			user["pid"] = data["pid"];
			var _tasks = data["tasks"]
			var maxTaskIndex = 0;

// const _task = new Task(task.name, task.icon, task.index)
// _task.parent = task.parent;
// _task.memo = task.memo;
// _task.children = task.children;

			for(const index in _tasks) {
				var _task = _tasks[index];
				_task["children"] = [];
				// _task["index"] = Number(_task["pid"]);
				_task["index"] = Number(_task["localIndex"]);
				if(maxTaskIndex <= _task["index"]) {
					maxTaskIndex = _task["index"]
				}
				if(_task["parent"] !== null)
					_task["parent"] = Number(_task["parent"])

				TaskManager.getTask().push(parseFunction(_task))
			}
			for(const index in _tasks) {
				var _task = _tasks[index];
				if(_task["parent"] !== null) {
					TaskManager.moveTask(_task["index"], _task["parent"])
					const parent = TaskManager.findTask(_task["parent"])

					// parent["children"].push(_task["index"])
					// console.log(parent)
				}
			}
			TaskManager.setTaskIndex(maxTaskIndex + 1);
			// console.log("when done task looks like", tasks)
			// TaskManager.setTask(tasks)

			saveData();
			loadData()
			openMainWindow();

		} else {
			// console.log("no!")
			mainWindow.webContents.send("port-login", false, data["msg"])
		}
	})
})
ipc.on("port-logout", function(event, pid) {
	// console.log("logging in!")
	portAPI.apiGet({
		type:"logout",
		pid:pid
	}, function(data, response) {
		// console.log("str ='"+data+"'")
		TaskManager.clearTask()
		openLandingPage()
		// data = JSON.parse(data)

		// if(data["success"] === "true") {
		// 	openLandingPage()
		// } else {
		// 	console.log("no!")
		// }
	})
})
// loadData();
} else {
	// console.log(require.main)
	// loadData();
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

// {"name":"뽀모도로","icon":"../Resources/glyphicons/png/glyphicons-1-glass.png","index":0,"memo":null,"children":[],"parent":null,"ppomos":[],"createdDate":"2016-04-17T18:05:13.969Z","deadLine":null}
// "newTaskIndex":19,"ppomos":{"currentPpomo":null,"ppomoIndex":1,"ppomos":[{"index":0,"taskIndex":1,"state":1,"start":"2016-04-17T18:05:20.505Z","success":true}]

ipc.on("getCurrentPpomo", function(event) {
	event.returnValue = PpomoManager.getCurrentPpomo().getSaveDatas();
})
ipc.on("getPpomo", function(event, ppomoIndex) {
	event.returnValue = PpomoManager.findPpomodoro(ppomoIndex).getSaveDatas();
})
// loadData();
