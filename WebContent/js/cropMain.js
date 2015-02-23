function clickHandler() {
	var condition = {
		"soil" : "PEATY",
		"sun" : "HOT"
	};
	var scope = angular.element(document.getElementById('CropList')).scope();
	// scope.setCondition(condition);
	scope.$apply(function() {
		scope.setCondition(condition);
	});
}