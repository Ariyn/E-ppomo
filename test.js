const main = require("main.js")

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

// main.createNewTask("parent1","testste", null)
// main.createNewTask("parent2","testste", null)
// main.createNewTask("child1","testste", 0)
// main.createNewTask("child2","testste", 0)
// main.createNewTask("child3","testste", 1)
//
// console.log("test", main.tasks)
//
// main.deleteTask(0)
// console.log("test", main.tasks)
