
var timer = {
	"minute":0,
	"second":0,
	"start":null,
	"state":0
}
var continous = false;
var nextTimeout = null;

var width = 280,
    height = 280,
    radius = Math.min(width, height) / 1.9,
    spacing = .2;

var formatSecond = d3.time.format("%-S seconds"),
    formatMinute = d3.time.format("%-M minutes"),
    formatHour = d3.time.format("%-H hours"),
    formatDay = d3.time.format("%A"),
    formatDate = function(d) { d = d.getDate(); switch (10 <= d && d <= 19 ? 10 : d % 10) { case 1: d += "st"; break; case 2: d += "nd"; break; case 3: d += "rd"; break; default: d += "th"; break; } return d; },
    formatMonth = d3.time.format("%B");

var color = d3.scale.linear()
    .range(["hsl(-180,60%,50%)", "hsl(180,60%,50%)"])
    .interpolate(function(a, b) { var i = d3.interpolateString(a, b); return function(t) { return d3.hsl(i(t)); }; });

var arcBody = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return d.index * radius; })
    .outerRadius(function(d) { return (d.index + spacing) * radius; })
    .cornerRadius(6);

var arcCenter = d3.svg.arc()
    .startAngle(0)
    .endAngle(function(d) { return d.value * 2 * Math.PI; })
    .innerRadius(function(d) { return (d.index + spacing / 2) * radius; })
    .outerRadius(function(d) { return (d.index + spacing / 2) * radius; });

// var circle = d3.svg.arc()
// 	.startAngle(0)
// 	.endAngle(360)
// 	.innerRadius()

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var field = svg.selectAll("g")
    .data(fields)
  .enter().append("g");

field.append("path")
    .attr("class", "arc-body");

field.append("path")
    .attr("id", function(d, i) { return "arc-center-" + i; })
    .attr("class", "arc-center");

// field.append("circle")
//     .attr("id", "circle-center")
//     .attr("class", "ppomo-circle-center")
// 	.attr("cy",0)
// 	.attr("cx",0)
// 	.attr("r",30)
// 	.style("fill","#33cc8c")

field.append("text")
    .attr("dy", ".35em")
    .attr("dx", ".75em")
    .style("text-anchor", "start")
  .append("textPath")
    .attr("startOffset", "50%")
    .attr("class", "arc-text")
    .attr("xlink:href", function(d, i) { return "#arc-center-" + i; });



d3.select(self.frameElement).style("height", height + "px");

function tick() {
  if (!document.hidden) field
      .each(function(d) { this._value = d.value; })
    //   .data(fields)
	  .data(fieldsTest)
      .each(function(d) { d.previousValue = this._value; })
    .transition()
      .ease("elastic")
      .duration(500)
      .each(fieldTransition);

	if(continous)
  		nextTimeout = setTimeout(tick, 1000);
		//  - Date.now() % 1000
}

function fieldTransition() {
  var field = d3.select(this).transition();

  field.select(".arc-body")
      .attrTween("d", arcTween(arcBody))
      .style("fill", function(d) { return color(d.value); });

  field.select(".arc-center")
      .attrTween("d", arcTween(arcCenter));

  field.select(".arc-text")
      .text(function(d) { return d.text; });
}

function arcTween(arc) {
  return function(d) {
    var i = d3.interpolateNumber(d.previousValue, d.value);
    return function(t) {
      d.value = i(t);
      return arc(d);
    };
  };
}

function fields() {
  var now = new Date;
  return [
    {index: .6, text: formatSecond(now), value: now.getSeconds() / 60},
    {index: .3, text: formatMinute(now), value: now.getMinutes() / 60}
  ];
}

function fieldsTest() {
	console.log("fieldTest")
	timer["second"] = (timer["second"]+1)%60;
	if(timer["second"] == 0) {
		timer["minute"] += 1
	}

	if(timer["maxMinute"] <= timer["minute"]) {
		stopTimer();
	}

	timer["secRadius"] = timer["second"]/60;
	timer["minRadius"] = timer["minute"]/timer["maxMinute"];

	console.log(timer)
  return [
    {index: .6, text: timer["second"]+" senconds", value: timer["secRadius"]},
    {index: .3, text: timer["minute"]+" minutes", value: timer["minRadius"]}
  ];
}
//
// {index: .5, text: formatHour(now),   value: now.getHours() / 24},
// {index: .3, text: formatDay(now),    value: now.getDay() / 7},
// {index: .2, text: formatDate(now),   value: (now.getDate() - 1) / (32 - new Date(now.getYear(), now.getMonth(), 32).getDate())},
// {index: .1, text: formatMonth(now),  value: now.getMonth() / 12}


// field.append("circle")
//     .attr("id", "circle-center")
//     .attr("class", "ppomo-circle-center")
// 	.attr("cy",0)
// 	.attr("cx",0)
// 	.attr("r",30)
// 	.style("fill","#33cc8c")
//135 204 51
$("body")
.append(
	$("<button id='circle-center' class='ppomo-circle-center'>start</button>")
		.css("left",140-25+$("svg").offset().left)
		.css("top",140-25+$("svg").offset().top)
		.click(function() {
			if(timer["start"] === null)
				timer["start"] = new Date();

			continous = !continous;
			if(continous) {
				startTimer();
			} else {
				// DEBUG CODE START
				timer["minute"] = timer["maxMinute"]-1;
				timer["second"] = 57
				// DEBUG CODE END

				pauseTimer();
			}
		})
)
.keyup(function(event) {
	if(event.keyCode == 27) {
		ipc.send("closeTimer", timer);
	}
})

function startTimer() {
	$("#circle-center")
		.html("pause")
		.addClass("ppomo-circle-center-pause")

	ipc.send("startTimer", timer)
	tick();
	timer["state"] = 1;
}
function pauseTimer() {
	$("#circle-center")
		.html("start")
		.removeClass("ppomo-circle-center-pause")

	clearTimeout(nextTimeout)
	continous = false;

	timer["state"] = 2;

	ipc.send("pauseTimer", timer)
}
function stopTimer() {
	$("#circle-center")
		.html("start")
		.removeClass("ppomo-circle-center-pause")

	clearTimeout(nextTimeout)
	continous = false;

	timer["second"] = 0;
	timer["minute"] = 25;
	timer["state"] = 3;

	ipc.send("endTimer", timer, true)
}

ipc.on("setTimer", function(event, _timer) {
	const now = new Date();
	var diffSeconds = 0;
	var diffMinutes = 0;

	if(_timer["start"] !== null) {
		_timer["start"] = new Date(_timer["start"])

		const diff = (now.getTime() - _timer["start"].getTime())/1000;

		diffSeconds = Math.floor(Math.abs(diff))%60;
		diffMinutes = Math.floor(Math.abs(diff)/60);
	}

	_timer["second"] = diffSeconds;
	_timer["minute"] = diffMinutes;

	timer = _timer

	$("#circle-center").click();
})
