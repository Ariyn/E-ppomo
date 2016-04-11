'use strict';

const fs = require("fs");

function write(path, string) {
	fs.writeFile(path, string, 'utf8', function(err, data) {
	    if(err) {
	        // 파일 쓰기 실패
	        console.log(err);
	    }
	    else {
	        // 파일 쓰기 성공
	        console.log('YES!');
	    }
	});
}

function read(path) {
	var tasks = null;

	try {
		tasks = JSON.parse(fs.readFileSync(path, "utf-8"));
	} catch(e) {
		tasks = []
	}

	return tasks;
}

function saveData(path, tasks, newTaskIndex, runningTimer) {
	const jsonData = JSON.stringify({
		"tasks":tasks,
		"newTaskIndex":newTaskIndex,
		"runningTimer":runningTimer
	});

	console.log(newTaskIndex)
	write(path, jsonData);
}


module.exports = {
	testWrite: function() {
		write('./test.txt', "Hello, World!")
	},
	saveData: saveData,
	loadData: read
}
