var selectedTask = null;
var testChangeDeadLine = false;

var isMovingTask = false;

function clickHandler() {
	const index = $(this).attr("taskindex");
	const task = getTask(index);

	if(isMovingTask == false) {
		if(selectedTask != null) {
			$(".ppomoListContainer[taskindex="+selectedTask.index+"]")
				.attr("selected", false)
		}
		$(this).attr("selected", true);

		console.log(task)
		console.log(index)

		selectedTask = task;

		changeDetail(task);
	} else {

	}
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
			var name = $(this).attr("type","hidden").val();

			if(name == "") {
				name = $("#ppomoDetailHeader>h1").html();
			}

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
	clearPppomo();
	printPpomo();
	$(".ppomoListContainer").first().click();
})

function clearPppomo() {
	$("#ppomoContentList").empty();
}

function printPpomo() {
	const tasks = getTasks();
	for(const t in tasks) {
		const _task = tasks[t];
		console.log(t)
		console.log(tasks[t])

		if(_task.parent == null)
			_printPppomo(_task)
	}
}

function _printPppomo(task) {
	console.log(task)
	addNewTaskHtml(task)

	for(var i in task.children) {
		const index = task.children[i];
		console.log(task.children)

		const _cTask = ipc.sendSync("getTask", index);
		console.log(index)
		_printPppomo(_cTask)
	}
}

function addNewChildTask(taskName, iconPath, parent) {
	const newTask = ipc.sendSync("newChildTask", taskName, iconPath, parent)
	console.log(newTask)
	clearPppomo();
	printPpomo();

	$(".ppomoListContainer[taskIndex="+newTask.index+"]").click()
	// addNewTaskHtml(newTask)
}
function addNewTask(taskName, iconNumber) {
	const newTask = ipc.sendSync("newTask", taskName, iconNumber)
	clearPppomo();
	printPpomo();

	$(".ppomoListContainer[taskIndex="+newTask.index+"]").click()
	// addNewTaskHtml(newTask)
}
function addNewTaskHtml(newTask) {
	console.log(newTask);
	className = "ppomoListContainer"

	if(newTask.parent != null)
		className += " ppomoListContainerChild"

	var string = "<div class=\""+className+" noDrag draggable\" taskIndex=\""+newTask.index+"\" draggable=\"true\">";
	string += "<span class=\"middle ppomoIconContainer\">";
	string += "<img class=\"ppomoIcon\" src=\""+newTask.icon+"\" alt=\"\">";
	string += "</span>";
	string += "<span class=\"ppomoName middle\">"+newTask.name+"</span>";
	string += "</div>";

	$("#ppomoContentList").append(
		$(string)
			.click(clickHandler)
			.mouseover(function() {

			})
			// .draggable()
	);
}

function changeDetail() {
	const task = selectedTask;
	console.log(task)

	$("#ppomoDetailHeader>h1").html(task.name);
	$("#ppomoIcon").attr("src", task.icon);
	$("#memoTextArea").val(task.memo);

	document.getElementById("ppomoDetailContent").scrollTop = 0;

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

$("#completeButton").click(function() {
	console.log("done!")
})

$("#removeButton").click(function() {
	const index = selectedTask.index

	if(selectedTask.parent != null) {
		// const parent = ipc.send("getTask", parentIndex);
		$(".ppomoListContainer[taskIndex='"+selectedTask.index+"']", selectedTask.parent).click();
	}
	console.log(selectedTask)
	ipc.send("delete", index)

	clearPppomo()
	printPpomo()
})

$("#moveButton").click(function() {
	$(".ppomoListContainer[selected!=selected]")
		.css("background-color","#5C6C70")
		.css("z-index",5)
		.mouseover(function() {
			$(this).css("background-color","#A7C5CC")
		})
		.mouseout(function() {
			$(this).css("background-color","#5C6C70")
		})
		.click(function() {
			// delete all this things
			// and change selected task to this's child
			// and parent can't click own child
			const index = $(this).attr("taskindex")
			ipc.sendSync("moveTask", selectedTask.index, index)

			isMovingTask = false;
			clearPppomo()
			printPpomo()

			$("#blinder")
				.css("display","none")
				.css("visibility","hidden")
				.css("z-index",-1)

			$("#ppomoListOuter")
				.css("background-color","white")
		})

	$(".ppomoListContainer[selected=selected]")
		.css("background-color", "#A7C5CC")

	$("#blinder")
		.css("display","block")
		.css("visibility","visible")
		.css("z-index",2)

	$("#ppomoListOuter")
		.css("background-color","rgba(0,0,0,0.4)")

	isMovingTask = true;
})

$("#timerButton").click(function() {
	ipc.send("openTimer", selectedTask)
})
