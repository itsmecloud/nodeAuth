angular.module('orderController', [])

	.controller('neworderController', ['$scope','$http','Pricebook','Products','Contracts','OrderItem','Order', function($scope, $http, Pricebook,Products,Contracts,OrderItem,Order) {
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
			$scope.input = {};
		   	$scope.order = {};
			if($scope.selectedPriceBookEntry.length > 0){
				$scope.order.pricebook2Id = $scope.selectedPriceBookEntry[0].pricebook2id;
				$scope.order.contractId = $scope.contractId;
			}
			
			$scope.orderItems =[];
			for(var i=0;i<$scope.selectedPriceBookEntry.length;i++){
				$scope.orderItems.push({
					pricebookentryId : $scope.selectedPriceBookEntry[0].sfid,
					quantity : $scope.selectedPriceBookEntry[0].quantity
				});
			}
			$scope.input.order = $scope.order;
			$scope.input.orderItems = $scope.orderItems;
			OrderItem.post($scope.input);
		}
	}]);
