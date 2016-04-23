
const fs = require("fs");
const EventEmitter = require("./api-wrapper.js").EventEmitter();
var SCOPES = ['read', "write"];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'port.json';

function loginCheck() {
	const loginData = fs.readFileSync("./login.json", "utf-8")
	
}




module.exports = {
	loginCheck : loginCheck
}
