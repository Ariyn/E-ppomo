Application.controller("calendarCtrl", ['$scope', function($scope) {

	$scope.testText = "this is sample text";
	$scope.monthRange = [1,2,3,4,5,6,7,8,9,10,11,12]
	$scope.yearRange = [2015, 2016, 2017, 2018, 2019, 2020]

	$scope.today = new Date();
	$scope.selectedMonth = $scope.today.getMonth()+1
	$scope.selectedYear = $scope.today.getFullYear()

	$scope.pickedDate = $scope.today.getDate()
	$scope.pickedMonth = $scope.today.getMonth()+1
	$scope.pickedYear = $scope.today.getFullYear()

	$scope.originalSetDate = null;
	$scope.originalSetMonth = null;
	$scope.originalSetYear = null;

	$scope.showCalendar = false;
	
	$scope.calendar = [];
	
	$scope.change = function(type) {
		$scope.calendar = calculateMonth($scope.selectedYear, $scope.selectedMonth)
	}
	$scope.classRewriter = function(date){
		var classes = [];

		if(date == $scope.today.getDate() &&
		$scope.selectedMonth == $scope.today.getMonth()+1 &&
		$scope.selectedYear == $scope.today.getFullYear())
			classes.push("is-today")

		if(date == $scope.pickedDate &&
			$scope.pickedMonth == $scope.selectedMonth &&
			$scope.pickedYear == $scope.selectedYear) {
			classes.push("is-selected")
		}

		if(date == $scope.originalSetDate &&
			$scope.selectedMonth == $scope.originalSetMonth &&
			$scope.selectedYear == $scope.originalSetYear) {
			classes.push("is-pre-selected")
		}
		return classes.join(" ")
	}

	$scope.move = function(index) {
		$scope.selectedMonth += index;
		if($scope.selectedMonth <= 0) {
			$scope.selectedMonth = 12
			$scope.selectedYear -= 1;
		} else if(12 < $scope.selectedMonth) {
			$scope.selectedMonth = 1
			$scope.selectedYear += 1;
		}

		$scope.change()
	}

	$scope.datePick = function(date) {
		console.log(date)
		if(date != -1) {
			$scope.pickedDate = date;
			$scope.pickedMonth = $scope.selectedMonth;
			$scope.pickedYear = $scope.selectedYear;

			console.log($scope.pickedMonth, $scope.pickedYear)
		}
	}
	$scope.init = function(deadline) {
		$scope.today = new Date();
		$scope.selectedMonth = $scope.today.getMonth()+1
		$scope.selectedYear = $scope.today.getFullYear()

		$scope.pickedDate = $scope.today.getDate()
		$scope.pickedMonth = $scope.today.getMonth()+1
		$scope.pickedYear = $scope.today.getFullYear()


		if(deadline !== undefined && deadline !== null) {
			var _oriDate = new Date(deadline)
			$scope.originalSetDate = _oriDate.getDate()-1;
			$scope.originalSetMonth = _oriDate.getMonth()+1;
			$scope.originalSetYear = _oriDate.getFullYear();

			console.log($scope)
		} else {
			$scope.originalSetDate = null;
			$scope.originalSetMonth = null;
			$scope.originalSetYear = null;
		}
		$scope.calendar = [];
	}

	$scope.abort = function() {
		
	}
	$scope.save = function() {

		//save algorithm

		$scope.abort()
	}

	$scope.change()
}])

Application.directive('calendar', function() {
	return {
		restrict: 'A',
		replace:true,
		templateUrl:"../Componenets/deadline.html"
	}
})

function calculateMonth(year, month) {
	var firstDay = new Date(year, month - 1, 1);
	var lastDay = new Date(year, month, 0);

	var firstWeekDay = firstDay.getDay();
	var list = [[]]

	for(var i=0;i<firstWeekDay;i++) {
		list[0].push(-1)
	}

	for(var i=firstWeekDay; i<=firstWeekDay+lastDay.getDate()-firstDay.getDate(); i++) {
		var week = Math.floor(i/7);
		// console.log(week, list, list.length)
		if(list.length <= week)
			list.push([])

		list[week].push(i-firstWeekDay+1);
	}

	for(var i=firstWeekDay+lastDay.getDate()-firstDay.getDate()+1;i<7*list.length;i++) {
		var week = Math.floor(i/7);
		list[week].push(-1)
	}


	return list
}

console.log("dead angular loaded", Application)