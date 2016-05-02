Application.controller("taskDetail", ['$scope', function($scope) {
	$scope.testText = "this is sample text";
	
}])

Application.directive('taskTree', function($compile) {
	return {
		restrict: 'A', //Element
		
	}
})