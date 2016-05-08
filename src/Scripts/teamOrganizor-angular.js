Application.factory("teamData", function() {
	var $scope = {};

	$scope.sampleText = "this is sample"

	$scope.count = 0;
	$scope.searchingText = "";
	$scope.addedUsers= {}
	$scope.users = [];

	return $scope;
})

Application.directive('teamOrganizor', function() {
	return {
		restrict: 'A',
		replace:true,
		templateUrl:"../Componenets/teamOrganizor.html"
	}
})

Application.directive("teammatesViewer", function() {
	return {
		restrict:"A",
		// require:"teamViewerCtrl",
		scope:{
			"addedUsers":"="
		},
		link:function(scope, element, attrs) {
			element.bind("click", function() {
				console.log(scope)
			})
		}
	}
})

Application.controller("TeamController", function($scope, teamData) {
	$scope.data = teamData;
	console.log(teamData)
	$scope.update = function() {
		if($scope.data.searchingText === "") {
			$scope.data.selectedUser = null;
		}
		for(var i in $scope.data.users) {
			var user = $scope.data.users[i];

			if(user.email == $scope.data.searchingText) {
				$scope.data.selectedUser = user;
				break;
			}
		}
	}

	$scope.addUser = function() {
		if($scope.data.selectedUser) {
			console.log($scope.data.addedUsers)
			if(!$scope.data.addedUsers[$scope.data.selectedTask]) {
				$scope.data.addedUsers[$scope.data.selectedTask] = []
				console.log($scope.data.addedUsers)
			}

			if($scope.data.addedUsers[$scope.data.selectedTask].indexOf($scope.data.selectedUser) != -1) {
				$scope.data.duplicatedUser = $scope.data.selectedUser;
				setTimeout(function() {
					console.log("here")
					$scope.$apply(function() {
						$scope.data.duplicatedUser = null;
					})
				}, 2000)
			} else {
				$scope.data.addedUsers[$scope.data.selectedTask].push($scope.data.selectedUser)
				$scope.data.selectedUser = null;

				$scope.data.searchingText = "";
			}
		}
	}

	$scope.mouseenter = function(target) {
		var index = $scope.data.addedUsers[$scope.data.selectedTask].indexOf(target)
		$scope.data.addedUsers[$scope.data.selectedTask][index]["hover"] = true;
	}

	$scope.mouseleave = function(target) {
		var index = $scope.data.addedUsers[$scope.data.selectedTask].indexOf(target)
		$scope.data.addedUsers[$scope.data.selectedTask][index]["hover"] = false;
	}

	$scope.removeUser = function(target) {
		var index = $scope.data.addedUsers[$scope.data.selectedTask].indexOf(target)
		target["hover"] = false;
		$scope.data.addedUsers[$scope.data.selectedTask].splice(index, 1)
	}

	$scope.click = function($event, user) {
		var position = $($event.currentTarget).offset()

		$scope.data.contextMenuData = position
		console.log(position)
	}
	$scope.abort = function() {
		
	}
	$scope.showCheck = function() {
		
	}
})

Application.controller("TeamController2", function($scope, teamData) {
	$scope.data = teamData;
})