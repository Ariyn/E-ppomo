var ppomos = [];
var presentPpomo = null;

function ppomodoro(_task, _start, _state) {
	if(_start === undefined)
		_start = null;
	if(_state === undefined)
		_state = 0;

	var task = _task;
	var taskIndex = task.index
	var start = _start;
	var state = _state;

	return {
		task : task,
		taskIndex:taskIndex,
		state : state,
		start : start,
		NOT_START:0,
		START:1,
		PAUSE:2,
		END:3,

		getSaveData: function() {
			return {
				task:task,
				state:state,
				start:start,
				taskIndex:taskIndex
			}
		}
	}
}

function findPpomodoro(index) {
	var retVal = null;

	for(const i in ppomos) {
		const ppomodoro = ppomos[i];
		if(ppomodoro.index == index) {
			retVal = ppomodoro;
			break;
		}
	}

	return retVal;
}
function newPpomodoro(task) {
	presentPpomo = new ppomodoro(task);
}

function startPpomodoro(taskIndex) {

}

function getPresentTimer(taskIndex) {
	var data = runningTimer;
	console.log("runningTimer", runningTimer)
	if(runningTimer["task"] === null && runningTimer["state"] === null) {
		runningTimer["task"] = findTask(_selectedTaskIndex);
	}

	if(runningTimer["task"].index == _selectedTaskIndex) {
		data["wrongTask"] = false;
	} else {
		// clicked other task while task's timer is running
		data["wrongTask"] = true;
	}
}

module.exports = {
	newPpomodoro:newPpomodoro,
	ppomodoro : ppomodoro,
	findPpomodoro:findPpomodoro,
	getPppomos : functon() {
		return ppomos;
	},
	getPresentPpomo: function() {
		return presentPpomo;
	}
}
