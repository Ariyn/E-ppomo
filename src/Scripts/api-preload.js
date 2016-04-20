window.$ = window.jQuery = window.jquery = require('./jquery-2.2.2.min');
window.ipc = require('electron').ipcRenderer;

console.log("well anyway i'm here")
$(document).ready(function() {
	ipc.send("ready")
	console.log("done1")
})
