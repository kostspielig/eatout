
var eatoutApp = angular.module('eatoutApp', [
    'ngAnimate',
    'ngRoute',
    'eatoutControllers',
    'eatoutDirectives',
    'eatoutServices'
]);

eatoutApp.config(
    function($routeProvider) {
	$routeProvider
	    .when('/', {
		templateUrl:'templates/map.html',
		controller: 'mapCtrl'
	    })
	    .otherwise({
		redirectTo: '/'
	    });
    });
