
var eatoutApp = angular.module('eatoutApp', [
    'ngAnimate',
    'ngRoute',
    'eatoutControllers',
    'eatoutDirectives',
    'eatoutServices'
]);

/*
eatoutApp.config(
    function($routeProvider) {
	$routeProvider
	    .when('/', {
		templateUrl:'templates/index.html',
		controller: 'mapCtrl'
	    })
	    .when('/@:eatPlace',{
		templateUrl:'templates/eat-entry.html',
		controller: 'placeCtrl'
	    })
	    .otherwise({
		redirectTo: '/'
	    });
    });
*/

