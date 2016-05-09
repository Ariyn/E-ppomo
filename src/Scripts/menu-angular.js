Application.controller("menuCtrl", ['$scope', function($scope) {

	$scope.testText = "this is sample text";
	$scope.taskLists = ["Home", "sample", "port", "sample2"]

	$scope.selected = "Home"
	$scope.clickHeader = function(name) {
		console.log("cliced!", name)
		$scope.selected = name
	}
}])