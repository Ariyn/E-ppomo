'use strict';

const ls = require("./NScripts/LocalStorage.js")
const electron = require("electron");
const app = electron.app;

app.on("ready", function() {
	ls.init();

	ls.onLoad(function(event) {
		ls.saveData("sample", "1234567")
		ls.saveData("sample1", 1234567)
		ls.saveData("sample2", {
			"aaa":1,
			"bbb":1
		})
		ls.loadData("sample", function(data) {
			console.log(data)
		})
		const sample1 = ls.loadData("sample1", function(data) {
			console.log(data)
		})
		const sample2 = ls.loadData("sample2", function(data) {
			console.log(data)
		})

		// console.log(sample1)
		// console.log(sample2)
	})
	// app.quit()
})

// 동기부여
// API들 이용해 문가 할 수 있도록
