angular.module('orderService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Order', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/order');
			},
			post : function(data) {
				var input = $.param({
            					json: JSON.stringify(data)
				});
				return $http.post('/api/order',input);
			}
		}
	}])..factory('OrderItem', ['$http',function($http) {
		return {
			post : function(data) {
				var input = $.param({
            					json: JSON.stringify(data)
				});
				return $http.post('/api/orderitem',input);
			}
		}
	}]).factory('Contracts', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/contracts');
			}
		}
	}])
	.factory('Pricebook', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/pricebook');
			}
		}
	}]).factory('Products', ['$http',function($http) {
		return {
			get : function(pbId) {
				return $http.get('/api/products/'+pbId);
			}
		}
	}]);
