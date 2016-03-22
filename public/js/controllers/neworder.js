angular.module('orderController', [])

	.controller('neworderController', ['$scope','$http','Pricebook','Products','Contracts','OrderItem', function($scope, $http, Pricebook,Products,Contracts,OrderItem) {
		$scope.pricebook = {};
		$scope.pricebooks = [];
		$scope.showList = false;
		$scope.selected = false;
		$scope.productSelected = false;
		$scope.selectedPriceBookEntry = [];
		$scope.contractId = undefined;
		Pricebook.get()
		.success(function(data) {
			$scope.pricebooks = data;
		});
		Contracts.get()
		.success(function(data) {
			$scope.contractId = data.sfid;
		});
		$scope.products = [];
		$scope.onPricebookSelect =function(pb){
			$scope.selected = true;
			$scope.pricebook = pb;
			$scope.products = [];
			Products.get(pb.sfid)
			.success(function(data) {
				for(var i=0;i< data.length;i++){
					data[i].selected = false;
				}
				$scope.products = data;
				
			});		
		}
		$scope.onProductSelected =function(pb){
		   $scope.productSelected = true;
		   $scope.selectedPriceBookEntry = [];
		   for(var i=0;i < $scope.products.length;i++){
		   	if($scope.products[i].selected){
		   		$scope.products[i].quantity = 0;
		   		$scope.selectedPriceBookEntry.push($scope.products[i]);
		   	}
		   }
			
		}
		$scope.onCreateOrder =function(){
		   	
		}
	}]);
