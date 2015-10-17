
eob_directives = angular.module 'eob.directives', []

eob_directives.directive 'resizable', ['$window', ($window) ->
    [ '$scope', ($scope) ->
        $scope.initializeWindowSize = ->
            $scope.windowHeight = $window.innerHeight
            $scope.windowWidth  = $window.innerWidth

        $scope.initializeWindowSize()

        angular.element($window).bind 'resize', _.debounce ->
                $scope.initializeWindowSize()
                $scope.$apply()
            , 500
    ]
]
