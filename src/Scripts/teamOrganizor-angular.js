Application.controller("teamViewerCtrl",['$scope', function($scope) {
	$scope.sampleText = "this is sample"

	$scope.count = 0;
	$scope.searchingText = "";
	$scope.addedUsers= []
	$scope.users = [];

	$scope.update = function() {
		if($scope.searchingText === "") {
			$scope.selectedUser = null;
		}
		for(var i in $scope.users) {
			var user = $scope.users[i];

			if(user.email == $scope.searchingText) {
				$scope.selectedUser = user;
				break;
			}
		}
	}

	$scope.addUser = function() {
		if($scope.selectedUser) {
			if($scope.addedUsers.indexOf($scope.selectedUser) === 0) {
				$scope.duplicatedUser = $scope.selectedUser;
				setTimeout(function() {
					console.log("here")
					$scope.$apply(function() {
						$scope.duplicatedUser = null;
					})
				}, 2000)
			} else {
				$scope.addedUsers.push($scope.selectedUser)
				$scope.selectedUser = null;

				$scope.searchingText = "";
			}
		}
	}

	$scope.mouseenter = function(target) {
		var index = $scope.addedUsers.indexOf(target)
		$scope.addedUsers[index]["hover"] = true;
	}

	$scope.mouseleave = function(target) {
		var index = $scope.addedUsers.indexOf(target)
		$scope.addedUsers[index]["hover"] = false;
	}

	$scope.removeUser = function(target) {
		var index = $scope.addedUsers.indexOf(target)
		target["hover"] = false;
		$scope.addedUsers.splice(index, 1)
	}

	$scope.click = function($event, user) {
		var position = $($event.currentTarget).offset()
		// position["top"],
		// position["left"]
		$scope.contextMenuData = position
		console.log(position)
	}
	$scope.abort = function() {
		
	}
}])

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