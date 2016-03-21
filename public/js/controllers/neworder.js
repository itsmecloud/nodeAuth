angular.module('orderController', [])

	// inject the Todo service factory into our controller
	.controller('neworderController', ['$scope','$http','Pricebook', function($scope, $http, Pricebook) {
		$scope.pricebook = {};
		$scope.pricebooks = [];
		$scope.showList = false;
		$scope.selected = false;
		Pricebook.get()
		.success(function(data) {
			$scope.pricebooks = data;
		});
		$scope.onPricebookSelect =function(pb){
			$scope.selected = true;
			$scope.pricebook = pb;
		}
	}]);
