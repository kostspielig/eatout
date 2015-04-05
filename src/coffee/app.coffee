
eob_app = angular.module 'eob.app', [
    'ngAnimate'
    'ngRoute'
    'eob.controllers'
    'eob.directives'
    'eob.services'
]

eob_app.config ($routeProvider) ->
  $routeProvider
    .when('/', {
      templateUrl:'templates/empty.html',
      controller: 'eob_NoPlaceUrlCtrl'
    })
    .when('/place/:placeSlug', {
      templateUrl:'templates/empty.html',
      controller: 'eob_PlaceUrlCtrl'
    })
    .when('/suggestion', {
      templateUrl: 'templates/empty.html',
      controller: 'eob_SuggestionUrlCtrl'
    })
      .otherwise({
        redirectTo: '/'
	    })

eob_app.config ($locationProvider) ->
  $locationProvider.html5Mode(true)
    

eob_app.run ['$route', angular.noop]


# Filters

eob_app.filter "unsafe", ($sce) ->
  (val) ->
    $sce.trustAsHtml val
