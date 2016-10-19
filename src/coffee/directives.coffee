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

eob_directives = angular.module 'eob.directives', []

eob_directives.directive 'eobClickOut', [ '$window', '$parse', ($window, $parse) ->
    restrict: 'A'
    scope: { method:'&clickOut' }
    link: (scope, element, attrs) ->
        clickOutHandler = $parse(attrs.clickOut)
        angular.element($window).on 'click', (event) ->
            if element[0].contains(event.target) then return
            clickOutHandler scope.method()
            scope.$apply()
]

eob_directives.directive 'eobResizable', ['$window', ($window) ->
    ($scope) ->
        $scope.initializeWindowSize = ->
            $scope.windowHeight = $window.innerHeight
            $scope.windowWidth  = $window.innerWidth

        $scope.initializeWindowSize()

        angular.element($window).bind 'resize', _.debounce ->
                $scope.initializeWindowSize()
                $scope.$apply()
            , 500
]

eob_directives.directive 'eobAutofocus', ['$timeout', ($timeout) ->
    restrict: 'A'
    link: ($scope, element, attrs) ->
        focus = (cond) ->
            if cond
                $timeout ->
                    do element[0].focus
                , $scope.$eval(attrs.eobAutofocusDelay) ? 0
        if attrs.eobAutofocus
            $scope.$watch attrs.eobAutofocus, focus
        else
            focus true
]
