$("#portLogin").click(function() {
	$('#myModal')
		.on('shown.bs.modal', function () {
			$("#idInput").focus()
			console.log("shown!")
		})
		.modal("show")
	// ipc.send("port-login", "hmu5092", "pw4port")
})
$("#loginButton").click(function() {
	login()
})
$("input").keypress(function(e) {
	if(e.which == 13) {
		login()
	}
})

function login() {
	var id = $("#idInput").val();
	var password = $("#password").val()

	// console.log(id, password)

	ipc.send("port-login", id, password)
}

ipc.on("port-login", function(event, success) {
	console.log(success)
	if(success == false) {
		console.log("no!")
		$( "#myModal" ).effect("shake", {}, 500);
	}
})