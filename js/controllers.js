
'use strict';

var eob_controllers = angular.module('eob.controllers', []);

var DROP_DELAY = 200;

var BERLIN_POS = new google.maps.LatLng(52.5096315, 13.4018519);

var MARKER_ICONS = {
    pizza: 'images/icons/SVG/pizza.svg',
    beer: 'images/icons/SVG/beer.svg',
    viet: 'images/icons/SVG/ramen.svg',
    burger: 'images/icons/SVG/burger.svg',
    japan: 'images/icons/SVG/sushi.svg',
    breakfast: 'images/icons/SVG/coffee.svg',
    //croissant: 'images/icons/croissant.png',
    cheese: 'images/icons/cheese.png',
    icecream: 'images/icons/SVG/icecream.svg',
    german: 'images/icons/SVG/german.svg',
    muffin: 'images/icons/SVG/muffin.svg',
    french: 'images/icons/SVG/french.svg',
    egg: 'images/icons/SVG/spanish.svg',
    sandwich: 'images/icons/SVG/sandwich.svg'
};

var MARKER_ICONS2 = {
    pizza: 'images/icons/pizza.png',
    beer: 'images/icons/beer.png',
    viet: 'images/icons/viet.png',
    burger: 'images/icons/burger.png',
    japan: 'images/icons/japan.png',
    breakfast: 'images/icons/breakfast.png',
    croissant: 'images/icons/croissant.png',
    cheese: 'images/icons/cheese.png',
    icecream: 'images/icons/icecream.png',
    german: 'images/icons/cburst.png',
    muffin: 'images/icons/wmuffin.png',
    french: 'images/icons/poulet.png',
    egg: 'images/icons/egg.png'
};

var MAP_STYLES = [
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
];

eob_controllers.controller(
    'eob_WeatherCtrl', function($scope, eob_weather) {
        eob_weather.getWeather($scope);
    });

eob_controllers.controller(
    'eob_MenuCtrl', function($scope, $location, eob_data) {
        eob_data.districtsPromise.success(function (data) {
            $scope.districts = data;
        })

	$scope.foodTypes= ["all"];
	$scope.foodTypes = $scope.foodTypes.concat(Object.keys(MARKER_ICONS));

        $scope.menuFindMe = function ($event) {
            $location.path("/");
            $scope.findMe();
        }

	$scope.menuSelectFood = function (foodType) {
	    $scope.active = '';
            //$scope.hideMenu();
	    $scope.filterMarkers (foodType);
	}
	
        $scope.menuSelectDistrict = function (district) {
	    $scope.active = '';
            //$scope.hideMenu();
            $scope.centerPosition(district.lat, district.lng, district.zoom);
        }

	$scope.toggleItem = function (item) {
	    $scope.active = ($scope.active == item) ? '': item;
	}
	
	$scope.isActive = function (item) {
	    return $scope.active == item
	}
    });

eob_controllers.controller(
    'eob_MapCtrl',
    function($scope, $http, $location,
             eob_data, eob_geolocation, eob_imgCache)
{
    eob_imgCache.load(MARKER_ICONS);

    $scope.seemenu = true;
    $scope.seepanel = false;
    $scope.place = null;

    $scope.hidePanel = function() { $scope.seepanel = false; }
    $scope.showPanel = function() { $scope.seepanel = true; }
    $scope.hideMenu = function() { $scope.seemenu = false; }
    $scope.showMenu = function() { $scope.seemenu = true; }
    $scope.toggleMenu = function () { $scope.seemenu = !$scope.seemenu; }

    $scope.setPlace = function (place) { $scope.place = place; }

    $scope.centerPosition = function (lat, lng, zoom) {
	var center = new google.maps.LatLng(lat, lng);

        if ($scope.seepanel || $scope.seemenu) {
            // The panel might be changing right now, in which case
            // 'offsetWidth' returns 0, so let's deffer this.
            setTimeout(function () {
                var mapWidth =
                    document.getElementById('map-canvas').offsetWidth;
                var panelWidth = !$scope.seepanel ? 0 :
                    document.getElementById('main-panel').offsetWidth;
                var menuWidth = !$scope.seemenu ? 0 :
                    document.getElementById('main-menu').offsetWidth;
                if (panelWidth >= mapWidth)
                    panelWidth = 0;
                var adjust = panelWidth / 2 - menuWidth / 2;
	        map.panTo(center);
                map.setZoom(zoom);
                map.panBy(adjust, 0);
            }, 0);
        } else {
            map.panTo(center);
            map.setZoom(zoom);
        }
    };

    $scope.findMe = function() {
	eob_geolocation.getCurrentPosition(function(position) {
            eob_imgCache.load(
                _.pick(MARKER_ICONS, 'findme')
            ).then(function () {
	        var pos = new google.maps.LatLng(position.coords.latitude,
					         position.coords.longitude);

                if (findMeMarker != null) {
                    markers.splice(markers.indexOf(findMeMarker), 1);
                    findMeMarker.setMap(null);
                }

	        findMeMarker = new google.maps.Marker({
		    map: map,
                    position: pos,
		    icon: 'images/SVG/iamhere.svg',
		    animation: google.maps.Animation.DROP,
		    zIndex: 99999,
	        });
                markers.push(findMeMarker);

	        var distanceToBerlin = (
                    google.maps.geometry.spherical.computeDistanceBetween(
                        pos, BERLIN_POS) / 1000).toFixed(2);
	        console.log("Distance to Berlin:", distanceToBerlin);
	        fitBounds(markers);
            });
	});
    };

    eob_data.placesPromise.success(function (data) {
        $scope.places = data;
    })

    var map = new google.maps.Map(
        document.getElementById('map-canvas'), {
	    center: BERLIN_POS,
	    zoom: 13,
	    disableDefaultUI: true,
	    mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: MAP_STYLES
	});
    var markers = [];
    var findMeMarker = null;

    function addMarkersFrom(index) {
        if (index == null)
            index = 0;
        if (index >= 0 && index < $scope.places.length) {
            var place = $scope.places[index];
	    eob_imgCache.load(
                _.pick(MARKER_ICONS, place.foodtype)
            ).then(function () {
                var marker = new google.maps.Marker({
	            position: new google.maps.LatLng(place.lat, place.lng),
	            map: map,
	            icon: MARKER_ICONS[place.foodtype],
	            animation: google.maps.Animation.DROP
	        });
	        markers.push(marker);

	        google.maps.event.addListener(marker, 'click', function() {
                    $location.path('/place/' + place.slug);
                    $scope.$apply();
	        });

                setTimeout(_.partial(addMarkersFrom, index + 1), DROP_DELAY);
            });
        }
    }


    $scope.filterMarkers = function(type) {
	_.map(markers, function(element) {
	    if (element.getIcon() == MARKER_ICONS[type] || type == "all")
		element.setVisible(true);
	    else element.setVisible(false);
	    //fitBounds(markers);
	})
    }

    function fitBounds(markers) {
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
	    if (markers[i].getVisible() == true)
		bounds.extend(markers[i].getPosition());
	}

	map.fitBounds(bounds);
    }

    // do something only the first time the map is loaded
    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        eob_data.placesPromise.then(_.partial(addMarkersFrom, 0));
    });
});

eob_controllers.controller(
    'eob_PlaceUrlCtrl', function($scope, $routeParams, eob_data) {
        eob_data.placesPromise.success(function (places) {
            var place = _.findWhere(places, {slug: $routeParams.placeSlug});
            if (place != null) {
                $scope.setPlace(place);
	        $scope.showPanel();
                $scope.centerPosition(place.lat, place.lng, 16);
            } else {
                alert("Place not found: " + $routeParams.placeSlug);
            }
        });
    });

eob_controllers.controller(
    'eob_NoPlaceUrlCtrl', function($scope) {
        $scope.hidePanel();
    });
