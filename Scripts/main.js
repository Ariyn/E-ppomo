
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
			changeContainerName(".ppomoListContainer[taskIndex='"+selectedTask.index+"']", selectedTask)
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

	console.log(interact)
	interact('.dropzone').dropzone({
		// only accept elements matching this CSS selector
		accept: '.draggable',
		// Require a 75% element overlap for a drop to be possible
		overlap: 0.75,

		// listen for drop related events:

		ondropactivate: function (event) {
		// add active dropzone feedback
		event.target.classList.add('drop-active');
		},
		ondragenter: function (event) {
		var draggableElement = event.relatedTarget,
		dropzoneElement = event.target;

		// feedback the possibility of a drop
		dropzoneElement.classList.add('drop-target');
		draggableElement.classList.add('can-drop');
		draggableElement.textContent = 'Dragged in';
		},
		ondragleave: function (event) {
		// remove the drop feedback style
		event.target.classList.remove('drop-target');
		event.relatedTarget.classList.remove('can-drop');
		event.relatedTarget.textContent = 'Dragged out';
		},
		ondrop: function (event) {
		event.relatedTarget.textContent = 'Dropped';
		},
		ondropdeactivate: function (event) {
		// remove active dropzone feedback
		event.target.classList.remove('drop-active');
		event.target.classList.remove('drop-target');
		}
	});
})

function printPpomo() {
	const tasks = getTasks();
	for(const t in tasks) {
		const _task = tasks[t];
		addNewTaskHtml(_task)
	}
}

function addNewTask(taskName, iconNumber) {
	const newTask = ipc.sendSync("newTask", taskName, iconNumber)
	addNewTaskHtml(newTask)
}
function addNewTaskHtml(newTask) {
	console.log(newTask);
	var string = "<div class=\"ppomoListContainer noDrag draggable drag-drop\" taskIndex=\""+newTask.index+"\">";
	string += "<span class=\"middle ppomoIconContainer\">";
	string += "<img class=\"ppomoIcon\" src=\""+newTask.icon+"\" alt=\"\">";
	string += "</span>";
	string += "<span class=\"ppomoName middle\">"+newTask.name+"</span>";
	string += "</div>";

	$("#ppomoContentList").append($(string).click(clickHandler));
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
