###
eatout - yummy places in the hood
Copyright (C) 2014-2016 Maria Carrasco Rodriguez

This file is part of eatout.

eatout is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

eatout is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with eatout.  If not, see <http://www.gnu.org/licenses/>.
###

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
        .when('/search', {
            templateUrl: 'templates/empty.html',
            controller: 'eob_SearchUrlCtrl'
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
