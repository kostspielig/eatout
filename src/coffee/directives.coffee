
eob_directives = angular.module 'eob.directives', []

eob_directives.directive 'clickOut', [ '$window', '$parse', ($window, $parse) ->
    restrict: 'A'
    scope: { method:'&clickOut' }
    link: (scope, element, attrs) ->
        clickOutHandler = $parse(attrs.clickOut)
        angular.element($window).on 'click', (event) ->
            if element[0].contains(event.target) then return
            clickOutHandler scope.method()
            scope.$apply()
]

eob_directives.directive 'resizable', ['$window', ($window) ->
    resizable = ($scope) ->
        $scope.initializeWindowSize = ->
            $scope.windowHeight = $window.innerHeight
            $scope.windowWidth  = $window.innerWidth

        $scope.initializeWindowSize()

        angular.element($window).bind 'resize', _.debounce ->
                $scope.initializeWindowSize()
                $scope.$apply()
            , 500
    return resizable
]
