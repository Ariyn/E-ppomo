const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const files = require("./files.js");
const electron = require('electron');
const async = require("async");
const EventEmitter = require("./api-wrapper.js").EventEmitter();
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const Path = require("path")

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json

var mainWindow = null;
var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
var AUTH_PATH = TOKEN_DIR + 'auth';
var oauth2Client = null;
var calendar = google.calendar("v3")

EventEmitter.whole(["app-ready", "api-ready"], function() {
	const args = arguments[1]
	const url = args["api-ready"][0];

	console.log(url)

	mainWindow = new BrowserWindow({
		width:600, height:660,
		icon:"../Resources/icon256.png"
	});

	mainWindow.on('closed', function() {
		mainWindow = null;
	});

	mainWindow.loadURL(url)
	mainWindow.webContents.on("did-finish-load", function() {
		const url = mainWindow.webContents.getURL()
		console.log("it's here!", url)
		console.log(url.indexOf("approval"))
		if(url.indexOf("approval") != -1) {
			console.log("in here!")
			// return $("#code").val();
			// console.log(test);
			mainWindow.webContents.loadURL("javascript:{const ipc = re	quire(\"electron\").ipcRenderer;const val = document.getElementById(\"code\").value;console.log(val);ipc.send(\"authCode\", val);}")
		}
		// mainwindow.executeJavaScript
	})

	ipc.on("authCode", function(event, value) {
		console.log(value)

		oauth2Client.getToken(value, function(err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token', err);
				return;
			}

			oauth2Client.credentials = token;
			storeToken(token);

			EventEmitter.emit("authDone")
			fs.writeFile(AUTH_PATH, value)
		});
	})
})
EventEmitter.on("noAuth", function() {

})
EventEmitter.on("authDone", function(token) {
	console.log("auth done!!!")
	if(mainWindow !== null) {
		mainWindow.hide();
		mainWindow.destroy();
	}
	// listEvents(oauth2Client);
})


/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
*
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
function authorize(credentials, callback) {
	var clientSecret = credentials.installed.client_secret;
	var clientId = credentials.installed.client_id;
	var redirectUrl = credentials.installed.redirect_uris[0];
	var auth = new googleAuth();
	oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	const token = fs.readFileSync(TOKEN_PATH);
	console.log("readed tolen", token)

	if (token === null || token == "") {
		getNewToken(oauth2Client);
	} else {
		console.log("readed tolen", JSON.parse(token))
		oauth2Client.credentials = JSON.parse(token);
		EventEmitter.emit("authDone", token)
	}
}

/**
* Get and store new token after prompting for user authorization, and then
* execute the given callback with the authorized OAuth2 client.
*
* @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
* @param {getEventsCallback} callback The callback to call with the authorized
*     client.
*/
function getNewToken(oauth2Client) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES
	});
	console.log('Authorize this app by visiting this url: ', authUrl);

	EventEmitter.emit("api-ready", authUrl)
}

/**
* Store token to disk be used in later program executions.
*
* @param {Object} token The token to store to disk.
*/
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_PATH);
}

/**
* Lists the next 10 events on the user's primary calendar.
*
* @param {google.auth.OAuth2} auth An authorized OAuth2 client.
*/
function listEvents(auth) {
	var calendar = google.calendar('v3');
	calendar.events.list({
		auth: auth,
		calendarId: 'primary',
		timeMin: (new Date()).toISOString(),
		maxResults: 10,
		singleEvents: true,
		orderBy: 'startTime'
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
		var events = response.items;
		if (events.length == 0) {
			console.log('No upcoming events found.');
		} else {
			console.log('Upcoming 10 events:');
			for (var i = 0; i < events.length; i++) {
				var event = events[i];
				var start = event.start.dateTime || event.start.date;
				console.log('%s - %s', start, event.summary);
			}
		}
	});
}

function authFlow() {
	async.waterfall([
		function (callback) {
			content = readSecret()
			console.log(content)
			callback(null, content)
		},
		function (content, callback) {
			console.log("second function", JSON.parse(content))
			authorize(JSON.parse(content))
		}
	])
}

function readSecret(callback) {
	const content = fs.readFileSync('client_secret.json');
	return content;
}


if(require.main == module) {
	app.on("ready", function() {
		EventEmitter.emit("app-ready")
	})
	authFlow();
} else {
	module.exports = {
		EventEmitter : EventEmitter,
		authFlow : authFlow,
		calendar : calendar,
		getAuth : function() {
			return oauth2Client
		},
		once : EventEmitter.once,
		on : EventEmitter.on,
		createPORTCalendar:function(object, cb) {
			if(object["type"] == "default") {
				object["summary"] = "port";
			}

			calendar.calendars.insert({
				auth:oauth2Client,
				resource : {
					summary:object["summary"],
					time_zone: 'Asia/Seoul',
				}
			},  function(err, content) {
				if(err)
					console.log(err)
				else
					cb(content)
			})
		}
	}
}
