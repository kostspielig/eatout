
var eob_app = angular.module('eob.app', [
    'ngAnimate',
    'ngRoute',
    'eob.controllers',
    'eob.directives',
    'eob.services'
]);

eob_app.config(
    function($routeProvider) {
	$routeProvider
	    .when('/', {
		templateUrl:'templates/map.html',
		controller: 'eob_MapCtrl'
	    })
	    .otherwise({
		redirectTo: '/'
	    });
    });

eob_app.config(
    function($locationProvider) {
        $locationProvider.html5Mode(true);
    });
