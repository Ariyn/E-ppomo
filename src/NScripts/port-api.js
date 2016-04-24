
const fs = require("fs");
const EventEmitter = require("./api-wrapper.js").EventEmitter();
const http = require('http');
const Client = require('node-rest-client').Client;
var client = new Client();

var SCOPES = ['read', "write"];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'port.json';
var options = {
	hostname: 'ismin.uk',
	path: '/port/api/user.py'
};

function apiGet(parameters, callback) {
	var url = "http://ismin.uk/port/api/user.py"

	var params = null;
	var strs = []
	for(const i in parameters) {
		strs.push(i+"="+parameters[i])
	}

	url += "?"+strs.join("&")

	console.log(url)

	client.get(url, function (data, response) {
		// parsed response body as js object
		data = data.toString();
		console.log(data);
		// raw response
		// console.log(response);
		if(callback) 
			callback(data, response)
	});
}
function apiPost(parameters, callback) {
	var url = "http://ismin.uk/port/api/user.py"

	// for(const i in parameters) {
	// 	parameters[i] = JSON.stringify(parameters[i]);
	// }
	
	var args = {
		parameters: parameters
		// headers: { "Content-Type": "application/json" }
	};
	 
	client.post(url, args, function (data, response) {
		// parsed response body as js object
		console.log(data)
		data = data.toString();
		console.log(data);
		// raw response
		// console.log(response);
		if(callback) 
			callback(data, response)
	});
}



module.exports = {
	apiGet : apiGet,
	apiPost: apiPost
}
