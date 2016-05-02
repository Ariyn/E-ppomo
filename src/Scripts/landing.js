$("#portLogin").click(function() {
	$('#myModal').modal("show")
	$("#id").show(function() {
		this.focus()
	})
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
	var id = $("#id").val();
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