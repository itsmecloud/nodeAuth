angular.module('orderController', [])

	.controller('neworderController', ['$scope','$http','Pricebook','Products', function($scope, $http, Pricebook,Products) {
		$scope.pricebook = {};
		$scope.pricebooks = [];
		$scope.showList = false;
		$scope.selected = false;
		Pricebook.get()
		.success(function(data) {
			$scope.pricebooks = data;
		});
		$scope.products = [];
		$scope.onPricebookSelect =function(pb){
			$scope.selected = true;
			$scope.pricebook = pb;
			Products.get(pb.sfid)
			.success(function(data) {
				$scope.products = data;
			});		
		}
		
	}]);
