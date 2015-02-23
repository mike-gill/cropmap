var cropMatchApp = angular.module('cropMatchApp', []);

cropMatchApp.service('CropMatchService', function() {
	this.matchCrop = function(crop, condition) {
		soilMatch = 5;
		sunMatch = 3;
		var match = {};
		match.soilMatch = soilMatch;
		match.sunMatch = sunMatch;
		return match;
	};
});

cropMatchApp.controller('CropListCtrl', function($scope, CropMatchService) {
	$scope.crops = [ {
		'name' : 'Beetroot',
		'soil' : 'Chalky'
	}, {
		'name' : 'Leeks',
		'soil' : 'Peaty'
	}, {
		'name' : 'Chiles',
		'soil' : 'Sandy'
	} ];

	$scope.crop = $scope.crops[0];

	$scope.condition = {
		"soil" : "chalky",
		"sun" : "10"
	};

	$scope.cropMatch = {
		"soilMatch" : "0",
		"sunMatch" : "1"
	};

	$scope.doMatch = function() {
		$scope.cropMatch = CropMatchService.matchCrop($scope.crop,
				$scope.condition);
	};

	$scope.setCondition = function(condition) {
		$scope.condition = condition;
		$scope.doMatch();
	};

	$scope.testobj = {
		"name" : "1"
	};
});