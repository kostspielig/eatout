
eob_controllers = angular.module 'eob.controllers', []

BERLIN_POS = new google.maps.LatLng 52.5170423, 13.4018519
MOBILE_BP = 760
MENU_BP = 600
ASCII_ART = """
Made with ❤ by

\t\t\t      ___
\t\t\t     /\\  \\        ___
\t\t\t    |::\\  \\      /\\__\\
\t\t\t    |:|:\\  \\    /:/__/
\t\t\t  __|:|\\:\\  \\  /::\\  \\
\t\t\t /::::|_\\:\\__\\ \\/\\:\\  \\
\t\t\t \\:\\~~\\  \\/__/  ~~\\:\\  \\
\t\t\t  \\:\\  \\           \\:\\__\\
\t\t\t   \\:\\  \\     &    /:/  /
\t\t\t    \\:\\__\\        /:/  /
\t\t\t     \\/__/        \\/__/
"""

MARKER_ICONS =
    #bakery: 'images/icons/SVG/muffin.svg'
    #beer: 'images/icons/SVG/beer.svg'
    breakfast: url: 'images/icons/SVG/coffee.svg', color: 'blue'
    brunch: url: 'images/icons/SVG/brunch.svg', color: 'purple'
    hotdog: url: 'images/icons/SVG/hotdog.svg', color: 'light-blue'
    burger: url: 'images/icons/SVG/burger.svg', color: 'purple'
    cocktails: url: 'images/icons/SVG/cocktails.svg', color: 'black'
    #croissant: 'images/icons/croissant.png', color: ''
    #cheese: 'images/icons/cheese.png'
    french: url: 'images/icons/SVG/french.svg', color: 'light-blue'
    foodmarket: url: 'images/icons/SVG/foodmarket.svg', color: 'orange'
    foodtruck: url: 'images/icons/SVG/food-truck.svg', color: 'green'
    german: url: 'images/icons/SVG/german.svg', color: 'black'
    icecream: url: 'images/icons/SVG/icecream.svg', color: 'dark-blue'
    international: url: 'images/icons/SVG/international.svg', color: 'yellow'
    italian: url: 'images/icons/SVG/pizza.svg', color: 'green'
    japanese: url: 'images/icons/SVG/sushi.svg', color: 'red'
    mexican: url: 'images/icons/SVG/mexican.svg', color: 'brown'
    michelin: url: 'images/icons/SVG/michelin.svg', color: 'dark-red'
    portuguese: url: 'images/icons/SVG/sardine.svg', color: 'green'
    spanish: url: 'images/icons/SVG/spanish.svg', color: 'yellow'
    sandwich: url: 'images/icons/SVG/sandwich.svg', color: 'purple'
    viet: url: 'images/icons/SVG/ramen.svg', color: 'red'


MAP_STYLES = [
  {
      stylers: [
        { hue: "#5ebf64" },
        { saturation: -20 }
      ]
  },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
  },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "on" }
      ]
  },{
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
  },{
      featureType: "administrative.locality",
      elementType: "all",
      stylers: [
        { color: "#ff1526" },
        { weight: 0.4 }
      ]
  },{
      featureType: "water",
      elementType: "geometry",
      stylers: [
        { color: "#05C7F2" }
      ]
  },{
      featureType: "landscape",
      stylers: [
        { hue: "#FFB20E" },
        { saturation: 20 }
      ]
  },{
      featureType: "transit.line",
      stylers:  [
        { visibility: "off" }
      ]
  },{
      featureType: "poi",
      elementType: "labels",
      stylers:  [
        { visibility: "off" }
      ]
  },{
      featureType: "poi.school",
      elementType: "all",
      stylers:  [
        { visibility: "off" }
      ]
  },{
      featureType: "poi.business",
      elementType: "label",
      stylers:  [
        { visibility: "off" }
      ]
  },{
      featureType: "poi.sports_complex",
      elementType: "all",
      stylers:  [
        { visibility: "off" }
      ]
  },{
      featureType: "poi.medical",
      elementType: "all",
      stylers:  [
        { visibility: "off" }
      ]
  },{
      featureType: "landscape",
      elementType: "geometry",
      stylers:  [
        { visibility: "off" }
      ]
  }
]

MAP_OPTIONS =
    center: BERLIN_POS
    zoom: 13
    disableDefaultUI: true
    mapTypeId: google.maps.MapTypeId.ROADMAP
    styles: MAP_STYLES

MAP_CLUSTERER_OPTIONS =
    gridSize: 50
    maxZoom: 15
    styles:
        for i in [1..6]
            url: "images/cluster/c#{i}.svg"
            height: 52
            width: 52
            textSize: 17


eob_controllers.controller 'eob_WeatherCtrl', [ '$scope', 'eob_weather', ($scope, eob_weather) ->
    eob_weather.getWeather $scope
    return
]

eob_controllers.controller 'eob_MessagesCtrl', [ '$scope', '$timeout', 'eob_weather', 'eob_msg', ($scope, $timeout, eob_weather, eob_msg) ->
    MESSAGE_TIMEOUT = 10 * 1000

    $scope.messages = []

    $scope.remove = (msg) ->
        $scope.messages = $scope.messages.filter (m) -> m != msg

    eob_msg.callbacks.push (msg) ->
        $scope.$apply ->
            $scope.messages.push msg
            $timeout ->
                $scope.remove msg
            , MESSAGE_TIMEOUT
    return
]

eob_controllers.controller 'eob_MenuCtrl', [ '$scope', '$location', 'eob_data', ($scope, $location, eob_data) ->
    eob_data.districtsPromise.success (data) ->
        $scope.districts = data

    $scope.foodTypes = Object.keys MARKER_ICONS

    hideIfPanel = ->
        if $scope.isMobileOrFs()
            $scope.hidePanel()

    $scope.anyChecked = ->
        do $scope.hasFoodTypeFilter

    $scope.menuFindMe = ->
        hideIfPanel()
        $location.path "/"
        $scope.findMe true

    $scope.menuSelectAll = ->
        hideIfPanel()
        $scope.setFoodTypeFilters []

    $scope.menuSelectFoodType = (food) ->
        hideIfPanel()
        $scope.toggleFoodTypeFilter food
        do $scope.fitBounds

    $scope.menuSelectDistrict = (district) ->
        hideIfPanel()
        $scope.active = ''
        $scope.centerPosition district.lat, district.lng, district.zoom

    $scope.closeSubmenus = () ->
        $scope.active = ''

    $scope.toggleItem = (item) ->
        $scope.active = (if $scope.active is item then '' else item)

    $scope.isActive = (item) ->
        $scope.active is item

    $scope.getColor = (type) ->
        MARKER_ICONS[type].color

    $scope.menuPosition = (type) ->
        if window.innerHeight < MENU_BP
            0
        else if type is 'foodItem'
            116
        else
            214
    return
]

eob_controllers.controller 'eob_MapCtrl', [ '$scope', '$http', '$location', '$timeout', '$filter', 'eob_data', 'eob_geolocation', 'eob_imgCache', ($scope, $http, $location, $timeout, $filter, eob_data, eob_geolocation, eob_imgCache) ->

    console.log ASCII_ART
    eob_imgCache.load MARKER_ICONS

    $scope.isMobile = ->
        return window.innerWidth < MOBILE_BP

    $scope.seemenu = not do $scope.isMobile
    $scope.seepanel = false
    $scope.expandpanel = 50

    $scope.places = []
    $scope.place = null
    $scope.panel = ''

    $scope.filterSearch = ''
    $scope.filterFoodTypes = []
    $scope.filteredPlaces = []

    eob_data.placesPromise.success (data) ->
        $scope.places = data

    $scope.setSearchFilter = (query) ->
        $scope.filterSearch = query
        do updateFilters

    $scope.setFoodTypeFilters = (filters) ->
        $scope.filterFoodTypes = filters
        do updateFilters

    $scope.toggleFoodTypeFilter = (type) ->
        $scope.setFoodTypeFilters if $scope.hasFoodTypeFilter type \
            then _.without $scope.filterFoodTypes, type \
            else $scope.filterFoodTypes.concat [type]

    $scope.hasFoodTypeFilter = (type) ->
        _.contains $scope.filterFoodTypes, type

    $scope.isMobileOrFs = ->
        return $scope.isMobile() or $scope.expandpanel is 100

    $scope.hidePanel = ->
        $scope.seepanel = false
        $scope.expandpanel = 50

    $scope.showPanel = ->
        $scope.seepanel = true
        if $scope.isMobile()
            do $scope.hideMenu

    $scope.panelToTop = ->
        panelElem = document.getElementById('main-panel')
        if panelElem then panelElem.scrollTop = 0

    $scope.hideMenu = ->
        $scope.seemenu = false

    $scope.showMenu = ->
        $scope.seemenu = true

    $scope.expandPanel = ->
        $scope.expandpanel = $scope.expandpanel = 100

    $scope.togglePanel = ->
        do $scope.hideMenu
        $scope.expandpanel = if $scope.expandpanel is 100 then 50 else 100

    $scope.toggleMenu = ->
        $scope.seemenu = !$scope.seemenu
        $scope.active = ''

    $scope.setPlace = (place) -> $scope.place = place
    $scope.setPanel = (panel) ->
        $scope.panel = panel
        $scope.panelToTop()

    $scope.setBlogEntries = (places) ->
        $scope.blogEntries = _.sortBy(places, 'date').reverse()

    $scope.setBlogPagination = (pageSize, currentPage) ->
        $scope.currentPage = currentPage
        $scope.pageSize = pageSize
        $scope.newerPageIndex = $scope.currentPage - 1
        $scope.olderPageIndex = $scope.currentPage + 1

    $scope.openPlaceFromBlog = (place) ->
        if $scope.isMobile()
            do $scope.hidePanel
            $scope.centerPosition place.lat, place.lng, 16
        else
            do $scope.togglePanel
            $scope.openPlace place.slug

    $scope.openPlace = (placeSlug) ->
        $location.path '/place/' + placeSlug

    $scope.centerPosition = (lat, lng, zoom) ->
        center = new google.maps.LatLng(lat, lng)
        # The panel might be changing right now, in which case
        # 'offsetWidth' returns 0, so let's deffer this
        if $scope.seepanel or $scope.seemenu
            $timeout ->
                mapWidth = document.getElementById("map-canvas").offsetWidth
                panelWidth = if not $scope.seepanel \
                             then 0
                             else document.getElementById("main-panel").offsetWidth
                menuWidth  = if not $scope.seemenu \
                             then 0
                             else document.getElementById("main-menu").offsetWidth
                usePanel   = not $scope.isMobile() and $scope.seepanel
                panelWidth = usePanel * mapWidth * $scope.expandpanel / 100.0
                adjust = panelWidth / 2 - menuWidth / 2
                map.panTo center
                map.setZoom zoom  if zoom
                map.panBy adjust, 0
            , 0
        else
            map.panTo center
            if zoom then map.setZoom zoom

    $scope.getLocation = ->
        eob_geolocation.getCurrentPosition (position) ->
            eob_imgCache.load(_.pick MARKER_ICONS, 'findme').then ->
                pos = new google.maps.LatLng position.coords.latitude,
                                             position.coords.longitude

    map = new google.maps.Map(document.getElementById('map-canvas'), MAP_OPTIONS)
    clusterer = new MarkerClusterer(map, [], MAP_CLUSTERER_OPTIONS)
    placeMarkers = {}
    findMeMarker = null

    clusterer.setCalculator (markers, styles) ->
        text: "<span class='cluster-txt'>#{markers.length}</span>"
        index: Math.min markers.length-1, styles

    $scope.findMe = (center) ->
        eob_geolocation.getCurrentPosition (position) ->
            eob_imgCache.load( _.pick MARKER_ICONS, 'findme').then ->
                pos = new google.maps.LatLng position.coords.latitude, position.coords.longitude
                findMeMarker.setMap null unless findMeMarker is null
                findMeMarker = new google.maps.Marker
                    map: map
                    position: pos
                    icon: "images/SVG/iamhere.svg"
                    animation: google.maps.Animation.DROP
                    zIndex: 9999999
                $scope.centerPosition position.coords.latitude, position.coords.longitude if center

                # Calcule distance to places
                $scope.places.forEach (place, index) =>
                    placePos = new google.maps.LatLng(place.lat, place.lng)
                    distance = (google.maps.geometry.spherical.computeDistanceBetween(pos, placePos) / 1000).toFixed(2)
                    place.distance = distance


    $scope.fitBounds = (markersToFit) ->
        if not markersToFit?
            markersToFit = _.values placeMarkers
            markersToFit.push findMeMarker
            markersToFit = _.filter markersToFit, (m) -> m?.getVisible()
        if markersToFit.length > 1
            bounds = markersToFit.reduce (b, m) ->
                b.extend m.getPosition()
            , new google.maps.LatLngBounds()
            map.fitBounds bounds

    searcher = $filter 'filter'

    updateFilters = ->
        filterFoodType = (places) ->
            if _.isEmpty $scope.filterFoodTypes \
            then places \
            else places.filter (place) ->
                _.contains $scope.filterFoodTypes, place.foodtype

        filterSearch = (places) ->
            if _.isEmpty $scope.filterSearch \
            then places \
            else searcher places, $scope.filterSearch

        filtered = filterSearch filterFoodType $scope.places

        if not _.isEqual filtered, $scope.filteredPlaces
            $scope.filteredPlaces = filtered
            visibleMarkers = []
            _.mapObject placeMarkers, (marker, slug) ->
                visible = (_.find filtered, (place) -> place.slug == slug)?
                marker.setVisible visible
                visibleMarkers.push marker unless not visible
            do clusterer.clearMarkers
            clusterer.addMarkers visibleMarkers

    document.onkeydown = (evt) ->
        if evt.keyCode is 27
            $scope.$apply -> $location.path '/'

    # Once the map and all the needed is loaded, we actually add the
    # markers to the map
    google.maps.event.addListenerOnce map, 'tilesloaded', ->
        eob_data.placesPromise.then ->
            eob_imgCache.load(MARKER_ICONS).then ->
                $scope.places.forEach (place, index) ->
                    image =
                        url: MARKER_ICONS[place.foodtype].url
                        size: new google.maps.Size(70, 85)
                        scaledSize: new google.maps.Size(70, 85)
                    marker = new google.maps.Marker
                        position: new google.maps.LatLng place.lat, place.lng
                        map: map
                        title: place.name
                        icon: image
                        animation: google.maps.Animation.DROP
                    placeMarkers[place.slug] = marker

                    google.maps.event.addListener marker, "click", ->
                        $scope.openPlace place.slug
                        do $scope.$apply
                $scope.findMe false
                do updateFilters

    return
]

eob_controllers.controller 'eob_PlaceCtrl', [ '$scope', '$location', '$window', ($scope, $location, $window) ->
    shareMsg = (place) ->
        'I found delicious ' + place.foodtype + ' at '+ place.name + ' via #EatOutBerlin'

    twitterShareUrl = ->
        event = event or window.event
        if event.stopPropagation then event.stopPropagation()
        else (event.cancelBubble = true)

        place = $scope.place
        if place
            msg = shareMsg place
            return 'http://twitter.com/share?' +
                'text=' + $window.encodeURIComponent(msg) +
                '&url=' + $location.absUrl()

        return ''

    externalize = (url) ->
        $location.protocol() +
            '://' + $location.host() +
            '/' + url

    $scope.twitterShare = ->
        $window.open(
            twitterShareUrl(),
            'height=450, width=550' +
                ', top='    + ($window.innerHeight/2 - 225) +
                ', left=' + ($window.innerWidth/2 - 275) +
                ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0')

    $scope.facebookShare = ->
        event = event || window.event
        if event.stopPropagation then event.stopPropagation()
        else (event.cancelBubble = true)
        place = $scope.place
        if place
            msg = shareMsg(place)
            FB.ui({
                method: 'feed'
                link: $location.absUrl()
                picture: externalize(place.images[0])
                name: "Eat Out Berlin: " + place.name
                description: place.description
            }, -> )

    return
]

eob_controllers.controller 'eob_SearchCtrl', [ '$scope', ($scope) ->
    $scope.query = ''
    $scope.queryChanged = ->
        $scope.setSearchFilter $scope.query
        do $scope.fitBounds
]

eob_controllers.controller 'eob_PlaceUrlCtrl', [ '$scope', '$routeParams', 'eob_data', 'eob_msg', ($scope, $routeParams, eob_data, eob_msg) ->
    eob_data.placesPromise.success (places) ->
        place = _.findWhere(places,
            slug: $routeParams.placeSlug
        )
        if place isnt undefined
            $scope.setPanel "place"
            $scope.setPlace place
            $scope.showPanel()
            $scope.centerPosition place.lat, place.lng, 16
        else
            eob_msg.put "Place not found: #{$routeParams.placeSlug}"
    return
]

eob_controllers.controller 'eob_SearchUrlCtrl', [ '$scope', 'eob_data', ($scope, eob_data) ->
    eob_data.placesPromise.success (places) ->
        $scope.setPanel 'search'
        $scope.showPanel()
        return
]

eob_controllers.controller 'eob_BlogUrlCtrl', [ '$scope', '$routeParams', 'eob_data', ($scope, $routeParams, eob_data) ->
    eob_data.placesPromise.success (places) ->
        idx = parseInt $routeParams.pageIndex, 10
        $scope.setBlogPagination 5, Math.max ((if isNaN idx then 0 else idx) - 1), 0
        $scope.setPanel 'blog'
        $scope.setBlogEntries places
        $scope.showPanel()
        $scope.expandPanel()
        $scope.panelToTop()
]

eob_controllers.controller 'eob_BlogCtrl', [ '$scope', 'eob_data', ($scope, eob_data) ->
    $scope.hideNewerLink = ->
        $scope.currentPage <= 0
    $scope.hideOlderLink = ->
        $scope.currentPage >= $scope.blogEntries.length / $scope.pageSize - 1
    $scope.numberOfPages = ->
        Math.ceil $scope.blogEntries.length / $scope.pageSize
]

eob_controllers.controller 'eob_NoPlaceUrlCtrl', [ '$scope', ($scope) ->
    do $scope.hidePanel
    return
]
