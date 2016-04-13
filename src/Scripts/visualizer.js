var margin = {top: 30, right: 20, bottom: 30, left: 20},
	width = 120,
	// $(document).width() - margin.left - margin.right,
	barHeight = 40,
	barWidth = width * .8;

var i = 0,
	duration = 20,
	root;

var tree = d3.layout.tree()
	.nodeSize([0, 20]);

var diagonal = d3.svg.diagonal()
	.projection(function(d) { return [d.y, d.x]; });

var svg = d3.select("body").append("svg")
	.attr("width", width + margin.left + margin.right+40)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// obj = {
// 	children:[obj],
// 	depth:0,
// 	id:0,
// 	name:"name",
// 	x:0,
// 	x0:0,
// 	y:0,
// 	y0:0
// }


function getTasks() {
	// d3.json("../Resources/flare.json", function(error, flare) {
	// 	if (error) throw error;
	//
	// 	flare.x0 = 0;
	// 	flare.y0 = 0;
	// 	console.log(flare)
	// 	// update(root = flare);
	// });

	const d3StyleData = ipc.sendSync("getTasks", "d3")
	console.log(d3StyleData)
	update(root = d3StyleData);
}

function update(source) {

	// Compute the flattened node list. TODO use d3.layout.hierarchy.
	var nodes = tree.nodes(root)
	nodes = nodes.splice(1, nodes.length);
	console.log(nodes)

	var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

	d3.select("svg").transition()
		.duration(duration)
		.attr("height", height);

	d3.select(self.frameElement).transition()
		.duration(duration)
		.style("height", height + "px");

	// Compute the "layout".
	nodes.forEach(function(n, i) {
		n.x = i * barHeight;
	});

	// Update the nodes…
	var node = svg.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	var nodeEnter = node.enter().append("g")
		.attr("class", "node noDrag")
		.attr("depth", function(d){
			// console.log(source)
			// console.log(d)
			return d.depth
		})
		.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		.style("opacity", 1e-6);

	// Enter any new nodes at the parent's previous position.
	nodeEnter.append("rect")
		.attr("y", -barHeight / 2)
		.attr("height", barHeight)
		.attr("width", barWidth)
		.style("fill", color)
		// .on("click", click);
		.on("click", function() {
			console.log($(this).parent()[0].__data__)
		});

	nodeEnter.append("text")
		.attr("dy", 3.5)
		.attr("dx", 5.5)
		.text(function(d) { return d.name; });

	// Transition nodes to their new position.
	nodeEnter.transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		.style("opacity", 1);

	node.transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		.style("opacity", 1)
		.select("rect")
		.style("fill", color);

	// Transition exiting nodes to the parent's new position.
	node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
		.style("opacity", 1e-6)
		.remove();

	// Update the links…
	// var link = svg.selectAll("path.link")
	//     .data(tree.links(nodes), function(d) { return d.target.id; });
	//
	// // Enter any new links at the parent's previous position.
	// link.enter().insert("path", "g")
	//     .attr("class", "link")
	//     .attr("d", function(d) {
	//       var o = {x: source.x0, y: source.y0};
	//       return diagonal({source: o, target: o});
	//     })
	//   .transition()
	//     .duration(duration)
	//     .attr("d", diagonal);
	//
	// // Transition links to their new position.
	// link.transition()
	//     .duration(duration)
	//     .attr("d", diagonal);
	//
	// // Transition exiting nodes to the parent's new position.
	// link.exit().transition()
	//     .duration(duration)
	//     .attr("d", function(d) {
	//       var o = {x: source.x, y: source.y};
	//       return diagonal({source: o, target: o});
	//     })
	//     .remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
		});
	}

// Toggle children on click.
function click(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
	update(d);
}

function color(d) {
	return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}

$(document).ready(function() {
	getTasks();
});
