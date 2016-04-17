var ppomos = [];
var currentPpomo = null;
var ppomoIndex = 0;

function ppomodoro(_ppomoIndex, _taskIndex, _start, _state) {
	if(_start === undefined)
		_start = null;
	if(_state === undefined)
		_state = 0;

	var taskIndex = _taskIndex;
	var start = _start;
	var state = _state;
	var index = _ppomoIndex;
	var success = false;

	return {
		taskIndex:taskIndex,
		index : index,
		getState : function() {
			return state;
		},
		setState : function(val) {
			state = val;
		},
		getStart : function() {
			return start;
		},
		setStart : function(val) {
			start = val;
		},
		getSuccess : function() {
			return success;
		},
		setSuccess : function(val) {
			success = val;
		},
		NOT_START:0,
		START:1,
		PAUSE:2,
		END:3,

		getSaveDatas: function() {
			return {
				index:index,
				taskIndex:taskIndex,
				state:state,
				start:start,
				success:success
			}
		},
		setSavedDatas : function(_index, _taskIndex, _state, _start, _success) {
			index = _index;
			taskIndex = _taskIndex;
			state = _state;
			start = _start;
			success = _success;
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
function newPpomodoro(_taskIndex) {
	currentPpomo = new ppomodoro(ppomoIndex, _taskIndex);
	ppomos.push(currentPpomo)
	ppomoIndex += 1

	return currentPpomo;
}

function startPpomodoro(taskIndex) {

}

module.exports = {
	newPpomodoro:newPpomodoro,
	ppomodoro : ppomodoro,
	findPpomodoro:findPpomodoro,
	getPpomos : function() {
		return ppomos;
	},
	createNewPpomo:function(selectedTask) {
		if(currentPpomo === null) {
			newPpomodoro(selectedTask)
		}

		return currentPpomo.getSaveDatas();
	},
	getCurrentPpomo : function() {
		return currentPpomo.getSaveDatas();
	},
	updateCurrentPpomo: function(updatedPpomo) {
		if(currentPpomo !== null) {
			currentPpomo.setStart(updatedPpomo["start"])
			currentPpomo.setState(updatedPpomo["state"])
		}
	},
	endCurrentPpomo: function(success) {
		currentPpomo.setSuccess(success)

		const cp = currentPpomo;

		currentPpomo = null;
		return cp
	},
	getSaveDatas : function() {
		// load these into json at here
		console.log("saving ppomos")

		var newPpomoList = []
		for(const i in ppomos) {
			const _ppomo = ppomos[i];
			// console.log(_ppomo, _ppomo.getSaveDatas())
			newPpomoList.push(_ppomo.getSaveDatas())
		}
		const cp = currentPpomo !== null ? JSON.stringify(currentPpomo.getSaveDatas()):null;

		return {
			currentPpomo : cp,
			ppomoIndex : ppomoIndex,
			ppomos : newPpomoList
			// ppomos : JSON.stringify(newPpomoList)
		}
	},
	setSavedDatas : function(ppomoData) {
		// parse these json into data at here
		// currentPpomo, ppomoIndex, ppomos
		// ppomodoro(_task, _start, _state)
		// loadSaveData : function(_index, _taskIndex, _state, _start, _success)

		currentPpomo = ppomoData["currentPpomo"];
		ppomoIndex = Number(ppomoData["ppomoIndex"]);

		const _NewPpomos = ppomoData["ppomos"];
		// const _NewPpomos = JSON.parse(ppomoData["ppomos"]);
		for(const i in _NewPpomos) {
			const _ppomo = _NewPpomos[i];
			const _NewPpomo = new ppomodoro();
			_NewPpomo.setSavedDatas(_ppomo["index"], _ppomo["taskIndex"], _ppomo["state"], _ppomo["start"], _ppomo["success"])

			ppomos.push(_NewPpomo)
		}
	}
}
