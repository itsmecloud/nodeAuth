angular.module('orderController', [])

	// inject the Todo service factory into our controller
	.controller('neworderController', ['$scope','$http','Pricebook', function($scope, $http, Pricebook) {
		$scope.pricebook = null;
		$scope.pricebooks = [];
		$scope.showList = false;
		Pricebook.get()
		.success(function(data) {
			$scope.pricebooks = data;
		});
		$scope.showPriceBook = function(){
			if($scope.pricebook != '' || $scope.pricebook != ' '){
				$('#lookup-menu').show();
			}else{
				$('#lookup-menu').hide();
			}
			
		}
	}]);
