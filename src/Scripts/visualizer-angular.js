var visualizer = angular.module("visualizer", []);
visualizer.controller("tasks", ['$scope', function($scope) {
	$scope.testText = "this is sample text";
	$scope.tasks = [];

	$scope.findTask = function(index) {
		for(var i in $scope.tasks) {
			var _task = $scope.tasks[i];

			if(_task["taskIndex"] == index)
				return _task
		}

		return {
			taskName:"undefined",
			taskIndex:0
		};
	}
}])

visualizer.directive('taskTree', function($compile) {
	return {
		restrict: 'A', //Element
		link: function (scope, element, attrs) {
			console.log(attrs)
			scope.reDrawTree = function() {
				var data = scope[attrs.treeData]
				// console.log("here", data)
				if(data !== undefined) {
					for(var i in data) {

					}
					var treeElement = '<ul><li ng-repeat="node in ' + attrs.treeData + '" task-index=0><span><i class="icon-leaf"></i> {{node.taskName}}</span><div tree-element tree="node"></li></ul>'

					var template = angular.element(treeElement);
					var linkFunction = $compile(template);
					linkFunction(scope)

					element.html(null).append(template)
				}
			}
		}
	}
})

visualizer.directive('treeElement', function($compile) {
	return {
		restrict:'A',
		link:function(scope, element, attrs) {
			console.log("here", attrs.tree)
			scope.tree = scope.node;

			var treeElement = '<ul><li ng-repeat="node in tree.children" task-index={{node.taskIndex}}><span><i class="icon-leaf"></i> {{node.taskName}}</span><div tree-element></li></ul>'

			var template = angular.element(treeElement);
			var linkFunction = $compile(template);
			linkFunction(scope)

			element.replaceWith(template)
		}
	}
})
