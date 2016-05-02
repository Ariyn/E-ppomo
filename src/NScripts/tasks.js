var tasks = [];
var newTaskIndex = 0;

function Task(taskName, _icon, _index, _createdDate) {
	var name = taskName;
	var icon = _icon;
	var index = _index;
	var memo = null;
	var children = [];
	var parent = null;
	var ppomos = [];
	var createdDate = null;
	var deadLine = null;

	if (_createdDate === undefined)
		createdDate = new Date();
	else
		createdDate = _createdDate

	return {
		name : name,
		icon : icon,
		index : index,
		memo : memo,
		children : children,
		parent : parent,
		ppomos : ppomos,
		createdDate : createdDate,
		deadLine : deadLine
	};
}

function createNewTask(name, icon, parent) {
	var task = new Task(name, icon, newTaskIndex);
	task.parent = parent;

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
	// console.log("newTaskIndex ", newTaskIndex)
	// console.log(task)

	return task
}

function deleteTask(taskIndex) {
	var target = findTask(taskIndex);
	// console.log(target)
	if(target === null) {
		return false;
	}

	while(target.children.length !== 0) {
	// for(var i in target.children) {
		// console.log("removing recursive "+target.children)
		deleteTask(target.children[0])
	}

	popTask(target.index)

	// console.log(target.parent)
	if(target.parent !== null) {
		var parent = findTask(target.parent)
		// console.log("parent", parent, target.parent)
		popByValue(parent.children, taskIndex);

		// var childIndex = parent.children.indexOf(taskIndex)
		// parent.children.splice(childIndex, 1)
	}
}
function finishTask(taskIndex) {
	var target = findTask(taskIndex)
	if(target === null) {
		return false;
	}

	lists = []
	while(target.children.length !== 0) {
	// for(var i in target.children) {
		// console.log("removing recursive "+target.children)
		lists.concat(finishTask(target.children[0]))
	}

	popTask(target.index)

	if(target.parent !== null) {
		var parent = findTask(target.parent)
		popByValue(parent.children, taskIndex);
	}

	return lists
}

function findTask(taskIndex) {
	var retVal = null;

	for(var i in tasks) {
		var _task = tasks[i];
		if(_task.index == taskIndex) {
			retVal = _task;
			break;
		}
	}

	return retVal;
}

function popByValue(list, value) {
	var retVal = [null];

	var childIndex = list.indexOf(value)
	if(childIndex != -1)
		retVal = list.splice(childIndex, 1);

	return retVal[0];
}
function popTask(taskIndex) {
	var retVal = [null];

	for(var i in tasks) {
		if(tasks[i].index == taskIndex) {
			retVal = tasks.splice(i, 1)
			break;
		}
	}

	return retVal[0];
}

function moveTask(targetIndex, newParentIndex) {
	var target = findTask(targetIndex);
	var newParent = findTask(newParentIndex);

	// console.log("changing", target, newParent)

	if(target.parent !== null) {
		var parent = findTask(target.parent);
		popByValue(parent.children, target.index)
	}

	target.parent = newParent.index;
	newParent.children.push(target.index);

	// console.log(newParent)

	return true;
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
function _d3ParseNode() {
	var lists = []

	for(var i in tasks) {
		if(tasks[i].parent === null) {
			lists.push(tasks[i].index)
		}
	}

	// console.log(lists)
	// console.log(tasks)

	var retVal = {
		children:_parseNode(lists),
		name:"root",
		x0:0,
		y0:0
	}

	// console.log(retVal)

	return retVal;
}
function _angularParseNode() {
	var lists = [];
	for(var i in tasks) {
		if(tasks[i].parent === null) {
			lists.push(tasks[i].index)
		}
	}
	var _parse = function(target) {
		var lists = []

		// console.log("target", target, target.children)
		for(var i in target) {
			// var _target = target.children[i];
			var _target = findTask(target[i]);
			// console.log(_target, target[i], i)
			if(_target !== null) {
				lists.push({
					children:_parse(_target.children),
					taskName : _target.name,
					taskIndex: _target.index,
					memo:_target.memo,
					icon : _target.icon,
					ppomos : _target.ppomos,
					createdDate : _target.createdDate,
					deadLine : _target.deadLine
				})
				// console.log(_target)
			}
		}


		// console.log("lists", lists, "target", target)

		if(lists.length === 0) {
			return null;
		} else {
			return lists;
		}
	}
	var retVal = _parse(lists)

	return retVal;
}

function _parseNode(target) {
	var lists = []

	// console.log("target", target, target.children)
	for(var i in target) {
		// var _target = target.children[i];
		var _target = findTask(target[i]);
		// console.log(_target, target[i], i)
		if(_target !== null) {
			lists.push({
				children:_parseNode(_target.children),
				name : _target.name,
				index: _target.index
			})

			// console.log(_target)
		}
	}


	// console.log("lists", lists, "target", target)

	if(lists.length === 0) {
		return null;
	} else {
		return lists;
	}
}


module.exports = {
	Task : Task,
	getTask : function() {
		return tasks
	},
	setTask:function(_task) {
		tasks = _task;
	},
	createNewTask : createNewTask,
	getTaskIndex : function() {
		return newTaskIndex;
	},
	setTaskIndex: function(value) {
		newTaskIndex = value;
	},
	clearTask : function() {
		tasks = [];
	},
	deleteTask : deleteTask,
	findTask : findTask,
	parseNode : function(type) {
		if(type == "d3") return _d3ParseNode()
		else if(type == "angularTree") return _angularParseNode()
	},
	moveTask : moveTask
}
