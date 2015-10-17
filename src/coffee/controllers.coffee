
eob_controllers = angular.module 'eob.controllers', []

BERLIN_POS = new google.maps.LatLng 52.5170423, 13.4018519
MOBILE_BP = 760
MENU_BP = 600
ASCII_ART = "Made with ❤ by\n\n"+

"\t\t\t      ___       \n"+
"\t\t\t     /\\  \\        ___    \n"+
"\t\t\t    |::\\  \\      /\\__\\   \n"+
"\t\t\t    |:|:\\  \\    /:/__/   \n"+
"\t\t\t  __|:|\\:\\  \\  /::\\  \\   \n"+
"\t\t\t /::::|_\\:\\__\\ \\/\\:\\  \\  \n"+
"\t\t\t \\:\\~~\\  \\/__/  ~~\\:\\  \\ \n"+
"\t\t\t  \\:\\  \\           \\:\\__\\ \n"+
"\t\t\t   \\:\\  \\     &    /:/  / \n"+
"\t\t\t    \\:\\__\\        /:/  / \n"+
"\t\t\t     \\/__/        \\/__/  \n"


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
    german: url: 'images/icons/SVG/german.svg', color: 'black'
    icecream: url: 'images/icons/SVG/icecream.svg', color: 'dark-blue'
    japanese: url: 'images/icons/SVG/sushi.svg', color: 'red'
    mexican: url: 'images/icons/SVG/mexican.svg', color: 'brown'
    italian: url: 'images/icons/SVG/pizza.svg', color: 'green'
    portuguese: url: 'images/icons/SVG/sardine.svg', color: 'green'
    spanish: url: 'images/icons/SVG/spanish.svg', color: 'yellow'
    sandwich: url: 'images/icons/SVG/sandwich.svg', color: 'purple'
    viet: url: 'images/icons/SVG/ramen.svg', color: 'red'
    foodtruck: url: 'images/icons/SVG/food-truck.svg', color: 'green'


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
            $timeout (-> $scope.remove msg), MESSAGE_TIMEOUT
    return
]

eob_controllers.controller 'eob_MenuCtrl', [ '$scope', '$location', 'eob_data', ($scope, $location, eob_data) ->
    eob_data.districtsPromise.success (data) ->
        $scope.districts = data

        $scope.foodTypes = Object.keys MARKER_ICONS
        $scope.allChecked = true
        $scope.foodTypeChecked = {}

    hideIfPanel = ->
        if $scope.isMobileOrFs()
            $scope.hidePanel()

    $scope.menuFindMe = ->
        hideIfPanel()
        $location.path "/"
        $scope.findMe true

    $scope.openSuggestion = ->
        $location.path '/suggestion'

    $scope.menuSelectAll = ->
        hideIfPanel()
        $scope.allChecked = true
        $scope.foodTypeChecked = {}
        $scope.filterMarkers $scope.foodTypes

    $scope.menuSelectFoodType = (food) ->
        hideIfPanel()
        $scope.allChecked = false
        $scope.foodTypeChecked[food] = !$scope.foodTypeChecked[food]
        checkedTypes = _.filter $scope.foodTypes, (foodtype) ->
            $scope.foodTypeChecked[foodtype]

        if _.isEmpty checkedTypes then $scope.menuSelectAll()
        else $scope.filterMarkers checkedTypes

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

eob_controllers.controller 'eob_MapCtrl', [ '$scope', '$http', '$location', '$timeout', 'eob_data', 'eob_geolocation', 'eob_imgCache', ($scope, $http, $location, $timeout, eob_data, eob_geolocation, eob_imgCache) ->

    eob_imgCache.load MARKER_ICONS

    # display my name one time on the console!
    console.log ASCII_ART
    $scope.seemenu = true
    $scope.seepanel = false
    $scope.expandpanel = 50
    $scope.place = null
    $scope.panel = true
    $scope.suggestions = true
    findMeMarker = null

    $scope.isMobile = ->
        return window.innerWidth < MOBILE_BP

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
    $scope.setSuggestions = (place) -> $scope.suggestions = place
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
            $timeout (->
                mapWidth = document.getElementById("map-canvas").offsetWidth
                panelWidth = if not $scope.seepanel \
                             then 0
                             else document.getElementById("main-panel").offsetWidth
                menuWidth  = if not $scope.seemenu \
                             then 0
                             else document.getElementById("main-menu").offsetWidth
                panelWidth = $scope.seepanel * mapWidth * (
                             if $scope.isMobile() then 1 else $scope.expandpanel / 100.0)
                adjust = panelWidth / 2 - menuWidth / 2
                map.panTo center
                map.setZoom zoom  if zoom
                map.panBy adjust, 0
              ), 0
        else
            map.panTo center
            if zoom then map.setZoom zoom

    $scope.getLocation = ->
        eob_geolocation.getCurrentPosition (position) ->
            eob_imgCache.load(_.pick MARKER_ICONS, 'findme').then ->
                pos = new google.maps.LatLng position.coords.latitude,
                                             position.coords.longitude

    $scope.findMe = (center) ->
        eob_geolocation.getCurrentPosition (position) ->
            eob_imgCache.load( _.pick MARKER_ICONS, 'findme').then ->
                pos = new google.maps.LatLng position.coords.latitude, position.coords.longitude
                if findMeMarker isnt null
                    markers.splice markers.indexOf(findMeMarker), 1
                    findMeMarker.setMap null

                findMeMarker = new google.maps.Marker
                    map: map
                    position: pos
                    icon: "images/SVG/iamhere.svg"
                    animation: google.maps.Animation.DROP
                    zIndex: 9999999

                $scope.centerPosition position.coords.latitude, position.coords.longitude if center

                getSuggestedPlaces pos, $scope.places

    eob_data.placesPromise.success (data) ->
        $scope.places = data

    mapData =
        center: BERLIN_POS
        zoom: 13
        disableDefaultUI: true
        mapTypeId: google.maps.MapTypeId.ROADMAP
        styles: MAP_STYLES

    mcOptions =
        gridSize: 50
        maxZoom: 15
        styles:
            for i in [1..6]
                url: "images/cluster/c#{i}.svg"
                height: 52
                width: 52
                textSize: 17

    map = new google.maps.Map(document.getElementById('map-canvas'), mapData)

    mc = null
    markers = []

    addMarkersToMap = () ->
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
                markers.push marker
                google.maps.event.addListener marker, "click", ->
                    $scope.openPlace place.slug
                    do $scope.$apply

            $scope.findMe false
            mc = new MarkerClusterer(map, markers, mcOptions)
            mc.setCalculator (markers, styles) ->
                text: "<span class='cluster-txt'>#{markers.length}</span>"
                index: Math.min markers.length-1, styles

    $scope.filterMarkers = (types) ->
        mm = []
        _.map markers, (marker) ->
            visible = undefined != _.find types, (type) ->
                marker.getIcon().url is MARKER_ICONS[type].url
            marker.setVisible visible
            mm.push marker unless not visible
        mc.clearMarkers()
        mc.addMarkers(mm)

    getSuggestedPlaces = (pos, places) ->
        suggestions = {}
        i = 0
        min = 999

        for place, i in places
            placePos = new google.maps.LatLng(place.lat, place.lng)
            distance = (google.maps.geometry.spherical.computeDistanceBetween(pos, placePos) / 1000).toFixed(2)
            place.distance = distance
            if min > distance then min = distance

        if min >= 999 then suggestions = null
        # Get the closest places
        newPlaces = places.slice 0
        newPlaces.sort compareDistances
        suggestions = newPlaces.slice 0,5
        return suggestions

    compareDistances = (a,b) ->
        if a.distance < b.distance then return -1
        if a.distance > b.distanc then return 1
        return 0

    $scope.fitBounds = (markersToFit) ->
        markersToFit ?= markers
        bounds = new google.maps.LatLngBounds()
        for marker, i in markersToFit
            if marker.getVisible() is true
                bounds.extend marker.getPosition()
        if findMeMarker and findMeMarker.getVisible() is true
            bounds.extend findMeMarker.getPosition()
        map.fitBounds bounds

    # do something only the first time the map is loaded
    google.maps.event.addListenerOnce map, 'tilesloaded', ->
        eob_data.placesPromise.then addMarkersToMap

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

eob_controllers.controller 'eob_SuggestionUrlCtrl', [ '$scope', 'eob_data', ($scope, eob_data) ->
    eob_data.placesPromise.success (places) ->
        $scope.setPanel 'suggestion'
        $scope.setSuggestions places
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
