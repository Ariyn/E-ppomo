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
	return fs.readFileSync(path, "utf-8")
}

function saveData(path, data) {
	const jsonData = JSON.stringify(data);

	write(path, jsonData);
}


module.exports = {
	testWrite: function() {
		write('./test.txt', "Hello, World!")
	},
	saveData: saveData,
	loadData: read
}
