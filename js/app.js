
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
		templateUrl:'templates/empty.html',
		controller: 'eob_NoPlaceCtrl'
	    })
            .when('/place/:placeSlug', {
		templateUrl:'templates/place.html',
		controller: 'eob_PlaceCtrl'
	    })
	    .otherwise({
		redirectTo: '/'
	    });
    });

eob_app.config(
    function($locationProvider) {
        $locationProvider.html5Mode(true);
    });

eob_app.run(['$route', angular.noop]);
