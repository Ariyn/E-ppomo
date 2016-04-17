'use strict';

const fs = require("fs");
var path = "./tasks";

function write(path, string, callback) {
	fs.writeFileSync(path, string, 'utf8', function(err, data) {
	    if(err) {
	        // 파일 쓰기 실패
	        console.log(err);
	    }
	    else {
	        // 파일 쓰기 성공
	        console.log('YES!');
	    }

		if(callback != null)
			callback()
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


function saveData(options, callback) {
	const jsonData = JSON.stringify(options);

	write(path, jsonData, callback);
}


module.exports = {
	testWrite: function() {
		write('./test.txt', "Hello, World!")
	},
	setDataPath:function(_path) {
		path = _path;
	},
	saveData: saveData,
	loadData: read
}
