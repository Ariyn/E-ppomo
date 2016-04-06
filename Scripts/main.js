document.onmousemove = mouseMove;
document.onmouseup   = mouseUp;
var dragObject  = null;
var mouseOffset = null;

var selectedTask = null;
var testChangeDeadLine = false;

function clickHandler() {
	const index = $(this).attr("taskindex");
	const task = getTask(index)

	console.log(task)
	console.log(index)

	selectedTask = task;

	changeDetail(task);
}

$("img").on("dragstart", function(event) {
	event.preventDefault();
});

$(".ppomoListContainer").click(clickHandler)

$("#newTask").click(function() {
	addNewTask("new Task", "./Resources/glyphicons/png/glyphicons-1-glass.png");
})
$("#newChildTask").click(function() {
	addNewChildTask("new child Task", "./Resources/glyphicons/png/glyphicons-1-glass.png", selectedTask.index);
})

$("#ppomoDetailHeader>h1").click(function() {
	const oldName = selectedTask.name;
	const focusOutFunc = function(event) {
		if(event.type == "keypress" && event.keyCode == 13) {
			console.log(event)
			$(this).focusout()
		} else if(event.type != "keypress"){
			const name = $(this).attr("type","hidden").val();

			$("#ppomoDetailHeader>h1")
				.css("display","inline")
				.css("visibility","visible")
				.html(name);

			selectedTask.name = name;

			ipc.send("changeName", selectedTask.index, name);

			console.log(selectedTask);
			console.log(oldName);

			if(selectedTask.parent == null)
				className = "ppomoListContainer"
			else
				className = "ppomoListContainerChild"
			changeContainerName("."+className+"[taskIndex='"+selectedTask.index+"']", selectedTask)
		}
	}
	$("#taskNameInput")
		.attr("type", "text")
		.val(oldName)
		.focus()
		.focusout(focusOutFunc)
		.keypress(focusOutFunc)

	$(this)
		.css("display","none")
		.css("visibility","hidden")
})

$(document).ready(function() {

	printPpomo();
	$(".ppomoListContainer").first().click();
})

function printPpomo() {
	const tasks = getTasks();
	for(const t in tasks) {
		const _task = tasks[t];
		_printPppomo(_task)
	}
}

function _printPppomo(task) {
	console.log(task)
	addNewTaskHtml(task)
	// for(var i in task.children) {
	// 	_printPppomo(task.children[i])
	// }
}

function addNewChildTask(taskName, iconPath, parent) {
	const newTask = ipc.sendSync("newChildTask", taskName, iconPath, parent)
	addNewTaskHtml(newTask)
}
function addNewTask(taskName, iconNumber) {
	const newTask = ipc.sendSync("newTask", taskName, iconNumber)
	addNewTaskHtml(newTask)
}
function addNewTaskHtml(newTask) {
	console.log(newTask);
	className = "ppomoListContainer"
	if(newTask.parent != null)
		className = "ppomoListContainerChild"

	var string = "<div class=\""+className+" noDrag draggable\" taskIndex=\""+newTask.index+"\">";
	string += "<span class=\"middle ppomoIconContainer\">";
	string += "<img class=\"ppomoIcon\" src=\""+newTask.icon+"\" alt=\"\">";
	string += "</span>";
	string += "<span class=\"ppomoName middle\">"+newTask.name+"</span>";
	string += "</div>";

	$("#ppomoContentList").append(
		$(string).
			click(clickHandler).
			mousedown(function(event) {
				dragObject = this;
				mouseOffset = getMouseOffset(this, event);
				// console.log(mouseOffset)
			})
	);
}

function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function getMouseOffset(target, ev){
	ev = ev || window.event;
	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}
function getPosition(e){
	var left = 0;
	var top  = 0;
	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
	}
	left += e.offsetLeft;
	top  += e.offsetTop;
	return {x:left, y:top};
}
function mouseMove(ev){
	ev           = ev || window.event;
	var mousePos = mouseCoords(ev);

	if(dragObject){
		$(dragObject)
			.css("position","absolute")
			.css("top", mousePos.y - mouseOffset.y)
			.css("left",mousePos.x - mouseOffset.x)
		// dragObject.style.position = 'absolute';
		// dragObject.style.top      = mousePos.y - mouseOffset.y;
		// dragObject.style.left     = mousePos.x - mouseOffset.x;

		console.log(dragObject.style)
		return false;
	}
}
function mouseUp(){
	$(dragObject)
		.css("position","relative")
		.css("top", 0)
		.css("left",0)
	dragObject = null;
}


function changeDetail() {
	const task = selectedTask;
	console.log(task)

	$("#ppomoDetailHeader>h1").html(task.name);
	$("#ppomoIcon").attr("src", task.icon);
	$("#memoTextArea").val(task.memo);

	if(task.deatline) {
		$("#deadLineUnSet")
			.css("display","none")
			.css("visibility","hidden")
		$("#deadLineSet")
			.css("display","inline-block")
			.css("visibility","visible")
	} else {
		$("#deadLineSet")
			.css("display","none")
			.css("visibility","hidden")
		$("#deadLineUnSet")
			.css("display","inline-block")
			.css("visibility","visible")
	}
}

// <div class="ppomoListContainer" taskName="testTask">
// 	<span class="middle ppomoIconContainer"><img class="ppomoIcon" src="./Resources/glyphicons/glyphicons-6-car.png" alt=""></span>
// 	<span class="ppomoName middle">testTask</span>
// </div>
function changeContainerName(target, task) {
	$(target)
		.attr("taskIndex", task.index)
		.find(".ppomoName")
		.html(task.name)
}

function getTask(taskIndex) {
	return ipc.sendSync("getTask", taskIndex);
}
function getTasks() {
	return ipc.sendSync("getTasks");
}

function getIcon(number) {
	return "1-glass";
}


$("#loadData").click(function() {
	console.log("here")
	const data = ipc.sendSync("loadDataTest")
	console.log(data);
})
$("#saveData").click(function() {
	console.log("here")
	ipc.send("saveDataTest")
})
$("#changeDeadline").click(function() {
	testChangeDeadLine = !testChangeDeadLine;
	if(testChangeDeadLine) {
		$("#deadLineUnSet")
			.css("display","none")
			.css("visibility","hidden")
		$("#deadLineSet")
			.css("display","inline-block")
			.css("visibility","visible")
	} else {
		$("#deadLineSet")
			.css("display","none")
			.css("visibility","hidden")
		$("#deadLineUnSet")
			.css("display","inline-block")
			.css("visibility","visible")
	}
})
$("#memoTextArea").focusout(function(event) {
		const memo = $(this).val();

		selectedTask.memo = memo;

		ipc.send("changeMemo", selectedTask.index, memo);
}).change(function(event) {
		const memo = $(this).val();

		selectedTask.memo = memo;
		console.log(memo)

		ipc.send("changeMemo", selectedTask.index, memo);
}).keyup(function(event) {
		const memo = $(this).val();

		selectedTask.memo = memo;
		console.log(memo)

		ipc.send("changeMemo", selectedTask.index, memo);
})
