$("#portLogin").click(function() {
	$('#myModal').modal("show")
	// ipc.send("port-login", "hmu5092", "pw4port")
})
$("#loginButton").click(function() {
	var id = $("#id").val();
	var password = $("#password").val()

	console.log(id, password)

	ipc.send("port-login", id, password)
})