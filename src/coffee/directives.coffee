
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
