Application.controller("menuCtrl", ['$scope', function($scope) {

	$scope.testText = "this is sample text";
	$scope.rawTasks = [];
	$scope.taskLists = ["Home", "sample", "port", "sample2"]

	$scope.selected = "Home"
	$scope.clickHeader = function(task) {
		console.log("cliced!", task)
		$scope.selected = task.taskName
		$scope.clickCallback(task.taskIndex)
	}

	$scope.clickCallback = function(name) {

	}
	$scope.parsing = function() {
		$scope.taskLists = [{taskName:"Home", taskIndex:-1}]
		console.log($scope.rawTasks)
		for(var i in $scope.rawTasks) {
			$scope.taskLists.push($scope.rawTasks[i])
		}
	}
}])