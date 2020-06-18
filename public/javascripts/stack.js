var app = angular.module('stackApp', ['ngResource','ngRoute','angularUtils.directives.dirPagination','ngSanitize']);



app.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
}]);
 
app.controller('HomeCtrl', function($scope, $http){
    $scope.flag = false;
    $scope.currentPage = 1;
    $scope.pageSize = 10;  
    $scope.pageChangeHandler = function(num) {
        console.log('meals page changed to ' + num);
    };

   $scope.save = function(){
    var req_data = { query: $scope.data.query};   
    console.log($scope.data.query);
    
    $http({
        method: 'GET',
        url: '/api/stack',
        params: { q_string : $scope.data.query}
    }).then(function success(response){
        $scope.flag = true;
        $scope.data = response.data.recordset;
        $scope.data_length = response.data.recordset.length;
        $scope.page = 1;
        $scope.pageSize = 10;
        console.log($scope.data_length);
    }, function error(response){

    });
 }
});

function OtherController($scope) {
    $scope.pageChangeHandler = function(num) {
      console.log('going to page ' + num);
    };
}
  
 
 app.controller('OtherController', OtherController);