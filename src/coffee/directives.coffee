
eob_directives = angular.module 'eob.directives', []

eob_directives
    .directive 'eob-dropdown', ->
        (scope, element, attr) ->
            element.on 'click', (event) ->
                if element.parent().hasClass('open')
                    element.parent().removeClass('open')
                else element.parent().addClass('open')

    .directive 'clickOut', ($window, $parse) ->
        {
            restrict: 'A',
            scope: { method:'&clickOut' }
            link: (scope, element, attrs) ->
                clickOutHandler = $parse(attrs.clickOut)
                angular.element($window).on 'click', (event) ->
                    if element[0].contains(event.target) then return
                    clickOutHandler scope.method()
                    scope.$apply()
        }

    .directive 'resizable', ($window) ->
        ($scope) ->
            $scope.initializeWindowSize = ->
                $scope.windowHeight = $window.innerHeight
                $scope.windowWidth  = $window.innerWidth

            $scope.initializeWindowSize()

            angular.element($window).bind 'resize', _.debounce ->
                    $scope.initializeWindowSize()
                    $scope.$apply()
                , 500
