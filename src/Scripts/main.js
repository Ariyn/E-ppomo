var margin = {top: 30, right: 20, bottom: 80, left: -20},
	width = 200,
	// $(document).width() - margin.left - margin.right,
	barHeight = 80,
	barWidth = width * .8,
	barMarginBottom = 10;

const bubble = {
	width:250, height : 170
}
const bubblePointer = {
	width:38, height:28
}

var i = 0,
	duration = 20,
	root;

var tree = d3.layout.tree()
	.nodeSize([0, 20]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });
var svg = null;

var selectedTask = null;
var selectedPpomo = null;
var testChangeDeadLine = false;

var isMovingTask = false;

function clickHandler() {
	const index = $(this).attr("taskindex");
	const task = getTask(index);

	console.log("clicked", index)
	if(isMovingTask == false) {
		if(selectedTask != null) {
			$(".ppomoListContainer[taskindex="+selectedTask.index+"]")
				.attr("selected", false)
		}
		$(this).attr("selected", true);

		// console.log($(this))

		console.log(task)
		// console.log(index)

		selectedTask = task;

		refresh()
	} else {

	}
}

$("img").on("dragstart", function(event) {
	event.preventDefault();
});

$(".ppomoListContainer").click(clickHandler)

$("#newTask").click(function() {
	addNewTask("new Task", "../Resources/glyphicons/png/glyphicons-1-glass.png");
})
$("#newChildTask").click(function() {
	addNewChildTask("new child Task", "../Resources/glyphicons/png/glyphicons-1-glass.png", selectedTask.index);
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
			// changeContainerName("."+className+"[taskIndex='"+selectedTask.index+"']", selectedTask)

			refresh();
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
	svg = d3.select("#ppomoContentList").append("svg")
		.attr("width", width + margin.left + margin.right+40)
		.append("g")
		.attr("class", "mainG")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	refresh();

	$(".ppomoListContainer").first().click();
	console.log("wokrs here")
	refresh();
})

function refresh() {
	clearPpomo()
	printPpomo()

	clearDetail()
	closePpomoInfoPanel();

	if(selectedTask !== null) {
		changeDetail();
	}
	// 	$(".ppomoListContainer[taskIndex="+selectedTask.index+"]").click();
	// }
}

function clearPpomo() {
	$("#ppomoContentList>svg>.mainG").empty();
}

function printPpomo() {
	const d3StyleData = ipc.sendSync("getTasks", "d3")
	console.log(d3StyleData)
	update(root = d3StyleData);


	$(".ppomoListContainer")
		.click(clickHandler)
		.mouseover(function() {
			console.log("over")
		});
}

function printPpomo2() {
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
	refresh()

	$(".ppomoListContainer[taskIndex="+newTask.index+"]").click()
	// addNewTaskHtml(newTask)
}
function addNewTask(taskName, iconPath) {
	const newTask = ipc.sendSync("newTask", taskName, iconPath)
	console.log(iconPath)
	refresh()

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

function clearDetail() {
	$("#ppomoDetailHeader>h1").html("");
	$("#ppomoIcon").attr("src", "");
	$("#memoTextArea").val("");

	$("#deadLineUnSet")
		.css("display","none")
		.css("visibility","hidden")
		$("#deadLineSet")
			.css("display","none")
			.css("visibility","hidden")

	$("#ppomoSuccessCountContainer").empty();
	console.log("here")
}

function changeDetail() {
	const task = selectedTask;
	// console.log(task)

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

	// $("#ppomoSuccessCountSpan").html(task.ppomos.length)
	console.log(task.ppomos)
	for(const i in task.ppomos) {
		const _ppomo = ipc.sendSync("getPpomo", task.ppomos[i]);
		var iconUrl = "";

		if(_ppomo.success)
			iconUrl = '../Resources/icon256.png'
		else
			iconUrl = '../Resources/glyphicons/png/glyphicons-93-tint.png'

		$("#ppomoSuccessCountContainer")
			.append('<img src="'+iconUrl+'" class="ppomoIcon-small ppomoSuccessIcon" ppomoIndex="'+_ppomo.index+'">')
	}
	$(".ppomoSuccessIcon")
		.click(openPpomoInfoPanel)
}

function openPpomoInfoPanel(event) {
	if(selectedPpomo !== null) {
		$("#selectedPpomoInfo")
			.remove();
	}

	selectedPpomo = $(this).attr("ppomoIndex")

	const offset = $(this).offset();
	const position = $(this).position();
	const size = {
		width:$(this).outerWidth(),
		height:$(this).outerHeight()
	}

	$("#ppomoSuccessCountContainer")
		.append('<div id="selectedPpomoInfo" class="bubble"></div>')

	console.log(offset.left - bubble["width"])

	const left = position.left-bubble["width"]/2-1+size.width/2;
	const top = position.top+bubblePointer["height"]+size.height;

	// const left = 0
	// const top = 0

	$("#selectedPpomoInfo")
		.css("display","none")
		.css("left",left)
		.css("top",top)
		.blur(function() {
			console.log("focus out")
		})
		.focusout(function() {
			console.log("focus out")
		})

	$("#selectedPpomoInfo")
		.append('<div id="closeButton"><img src="../Resources/glyphicons/png/glyphicons-208-remove.png"/></div>')


	$("#closeButton")
		.attr("class", "pull-right")
		.click(function() {
			closePpomoInfoPanel()
		})
		.css("cursor","pointer")
		.css("margin-right","2px")


	$( "#selectedPpomoInfo" )
		.show()
		// .show( "clip", {}, 500);
}

function closePpomoInfoPanel() {
	console.log("close ppomo info panel")
	selectedPpomoInfo = null;
	$("#selectedPpomoInfo")
		.remove();
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
	const tasks = ipc.sendSync("getTask", taskIndex);
	console.log(tasks)
	return tasks;
}
function getTasks() {
	const tasks = ipc.sendSync("getTasks");
	console.log(tasks)
	return tasks;
}

function getIcon(number) {
	return "1-glass";
}


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

	refresh();
})

$("#moveButton").click(function() {
	$("svg")
		.css("z-index", 4)
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
			refresh()

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
	ipc.send("openTimer", selectedTask.index)
})
$("#visualizer").click(function() {
	ipc.send("openVisualizer", selectedTask)
})

ipc.on("refresh", function(event) {
	console.log("refresh", selectedTask)
	selectedTask = getTask(selectedTask.index)
	refresh();
})
