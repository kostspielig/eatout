
eob_app = angular.module 'eob.app', [
    'ngAnimate'
    'ngRoute'
    'eob.controllers'
    'eob.directives'
    'eob.services'
]

eob_app.config ['$routeProvider', ($routeProvider) ->
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
        .when('/blog/:pageIndex?', {
            templateUrl: 'templates/empty.html',
            controller: 'eob_BlogUrlCtrl'
        })
        .otherwise({
            redirectTo: '/'
        })
]

eob_app.config ['$locationProvider', ($locationProvider) ->
    $locationProvider.html5Mode(true)
]

eob_app.run ['$route', angular.noop]


# Filters

eob_app.filter 'unsafe', ['$sce', ($sce) ->
    (val) ->
        $sce.trustAsHtml val
]

eob_app.filter 'startFrom', ->
    (input, start) ->
        start = +start  #parse to int
        input.slice start
