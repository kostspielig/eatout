
'use strict';

var eob_controllers = angular.module('eob.controllers', []);

var BERLIN_POS = new google.maps.LatLng(52.5096315, 13.4018519);

var MARKER_ICONS = {
    pizza: 'images/icons/SVG/pizza.svg',
    beer: 'images/icons/SVG/beer.svg',
    viet: 'images/icons/SVG/ramen.svg',
    burger: 'images/icons/SVG/burger.svg',
    japan: 'images/icons/SVG/sushi.svg',
    breakfast: 'images/icons/SVG/coffee.svg',
    croissant: 'images/icons/croissant.png',
    cheese: 'images/icons/cheese.png',
    icecream: 'images/icons/SVG/icecream.svg',
    german: 'images/icons/SVG/german.svg',
    muffin: 'images/icons/SVG/muffin.svg',
    french: 'images/icons/SVG/french.svg',
    egg: 'images/icons/SVG/spanish.svg',
    sandwitch: 'images/icons/SVG/sandwitch.svg'
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
	    { weight: 0.5 }
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

        $scope.menuFindMe = function () {
            $scope.hideMenu();
            $location.path("/");
            $scope.findMe();
        }

        $scope.menuSelectDistrict = function (district) {
            $scope.hideMenu();
            $scope.centerPosition(district.lat, district.lng, district.zoom);
        }
    });

eob_controllers.controller(
    'eob_MapCtrl',
    function($scope, $http, $location, eob_data, eob_geolocation)
{
    $scope.seemenu = false;
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
	    var pos = new google.maps.LatLng(position.coords.latitude,
					     position.coords.longitude);

            if (findMeMarker != null) {
                markers.splice(markers.indexOf(findMeMarker), 1);
                markers.pop(findMeMarker);
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
	})
    }

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

    function drop() {
	for (var i = 0; i < $scope.places.length; i++) {
	    setTimeout(function(index) {
                return function(place) {
		    addMarker(index);
		}
            } (i),
            i * 200);
	}
    }

    function addMarker(index) {
	var place = $scope.places[index];
	var pos = new google.maps.LatLng(place.lat, place.lng);
	var marker = new google.maps.Marker({
	    position: pos,
	    map: map,
	    icon: MARKER_ICONS[place.foodtype],
	    animation: google.maps.Animation.DROP
	});
	markers.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
            $location.path('/place/' + place.slug);
            $scope.$apply();
	});
    }

    function fitBounds(markers) {
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < markers.length; i++) {
	    bounds.extend(markers[i].getPosition());
	}

	map.fitBounds(bounds);
    }

    // do something only the first time the map is loaded
    google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
        eob_data.promise.then(drop);
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
