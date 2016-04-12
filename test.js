
const main = require("./main.js")

main.createNewTask("parent1","testste", null)
main.createNewTask("parent2","testste", null)
main.createNewTask("child1","testste", 0)
main.createNewTask("child2","testste", 0)
main.createNewTask("child3","testste", 1)

console.log("test", main.tasks)

main.deleteTask(0)
console.log("test", main.tasks)

/*

{"tasks":[{"name":"뽀모도로","icon":"./Resources/glyphicons/png/glyphicons-1-glass.png","index":0,"memo":null,"children":[1,2],"parent":null,"ppomos":[]},{"name":"new Task","icon":"./Resources/glyphicons/png/glyphicons-1-glass.png","index":1,"memo":null,"children":[],"parent":0,"ppomos":[]},{"name":"new Task","icon":"./Resources/glyphicons/png/glyphicons-1-glass.png","index":2,"memo":null,"children":[],"parent":0,"ppomos":[]}],"newTaskIndex":6}

*/
