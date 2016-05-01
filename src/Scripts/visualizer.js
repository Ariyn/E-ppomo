
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
	// console.log(svg)
	// Compute the flattened node list. TODO use d3.layout.hierarchy.
	// console.log(root)
	var nodes = tree.nodes(root)
	nodes = nodes.splice(1, nodes.length);
	// console.log(nodes)

	var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

	d3.select("svg").transition()
		.duration(duration)
		.attr("height", height);

	d3.select(self.frameElement).transition()
		.duration(duration)
		.style("height", height + "px");

	// Compute the "layout".
	nodes.forEach(function(n, i) {
		n.x = i * (barHeight+barMarginBottom);
	});

	console.log(nodes)

	// Update the nodes…
	var node = svg.selectAll("g.node")
		.data(nodes, function(d) { return d.id || (d.id = ++i); });

	var nodeEnter = node.enter().append("g")
		.attr("class", "node noDrag ppomoNode ppomoListContainer")
		.attr("depth", function(d){
			// console.log(source)
			// console.log(d)
			return d.depth
		})
		.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
		.attr("taskindex", function(d) {
			// console.log(d)
			return d.index;
		})
		.style("opacity", 1e-6)
		.on("mouseover", function(d){
			d3.select(this).select("rect").style("fill", function(d) {
				return color(d, "over")
			})
		})
		.on("mouseout", function(d){
			d3.select(this).select("rect").style("fill", color)
		})

	// Enter any new nodes at the parent's previous position.
	nodeEnter
		.append("rect")
		.attr("y", -barHeight / 2)
		.attr("height", barHeight)
		.attr("width", barWidth)
		.style("fill", color)
		.attr("class", "ppomoListRect")
		// .on("click", function() {
		// 	console.log($(this).parent()[0].__data__)
		// });

	nodeEnter.append("text")
		.attr("dy", 3.5)
		.attr("dx", 5.5)
		.text(function(d) { return d.index +" "+d.name; })
		.attr("transform", "translate(20, 0)")
		.attr("class", "ppomoListText")

	nodeEnter.append("svg:image")
		.attr("dy", 3.5)
		.attr("dx", 2.0)
		.attr("xlink:href", function(d) {
			return d._children ? "../Resources/glyphicons/png/glyphicons-433-plus.png" : d.children ? "../Resources/glyphicons/png/glyphicons-434-minus.png" : "";
		})
		.attr("width","10")
		.attr("height","10")
		.attr("transform","translate(5,-5)")
		.on("click", click)
		.style("cursor","pointer")
		// ../Resources/glyphicons/png/glyphicons-6-car.png
	// Transition nodes to their new position.
	nodeEnter.transition()
		.duration(duration)
		.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
		.style("opacity", 1);

	svg.selectAll("image")
		.attr("xlink:href", function(d) {

			const retVal =  d._children ? "../Resources/glyphicons/png/glyphicons-433-plus.png" : d.children ? "../Resources/glyphicons/png/glyphicons-434-minus.png" : "";

			console.log(retVal)
			return retVal;
		});

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

// TODO:
// change blue color to greenish color

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
	console.log("click", d)
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
	console.log("click", d)
	update(d);
}

function color(d, type) {
	// #FD4481
	// #60B2E5
	// #3182bd
	if(type == "over") {
		return d._children ? "#3ca555" : d.children ? "#3ca555" : "#E34132";
	} else {
		return d._children ? "#3ca555" : d.children ? "#97C1A1" : "#E04951";
	}
}

$(document).ready(function() {
	getTasks();
});
