
var eob_controllers = angular.module('eob.controllers', []);

var DROP_DELAY = 200;

var BERLIN_POS = new google.maps.LatLng(52.5170423, 13.4018519);

var ASCII_ART = 
"Made with ❤ by\n"+
"\t\t\t   /\\/\\   __ _ _ __(_) __ _ \n"+
"\t\t\t  /    \\ / _` | '__| |/ _` |\n"+
"\t\t\t / /\\/\\ \\ (_| | |  | | (_| |\n"+
"\t\t\t \\/    \\/\\__,_|_|  |_|\\__,_|";

var MARKER_ICONS = {
    //bakery: 'images/icons/SVG/muffin.svg',
    //beer: 'images/icons/SVG/beer.svg',
    breakfast: 'images/icons/SVG/coffee.svg',
    brunch: 'images/icons/SVG/brunch.svg',
    burger: 'images/icons/SVG/burger.svg',
    cocktails: 'images/icons/SVG/cocktails.svg',
    //croissant: 'images/icons/croissant.png',
    //cheese: 'images/icons/cheese.png',
    french: 'images/icons/SVG/french.svg',
    german: 'images/icons/SVG/german.svg',
    icecream: 'images/icons/SVG/icecream.svg',
    japanese: 'images/icons/SVG/sushi.svg',
    mexican: 'images/icons/SVG/mexican.svg',
    italian: 'images/icons/SVG/pizza.svg',
    portuguese: 'images/icons/SVG/sardine.svg',
    spanish: 'images/icons/SVG/spanish.svg',
    sandwich: 'images/icons/SVG/sandwich.svg',
    viet: 'images/icons/SVG/ramen.svg'
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
];

eob_controllers.controller(
    'eob_WeatherCtrl', function($scope, eob_weather) {
        eob_weather.getWeather($scope);
    });

eob_controllers.controller(
    'eob_MenuCtrl', function($scope, $location, eob_data) {
        eob_data.districtsPromise.success(function (data) {
            $scope.districts = data;
        });

	$scope.foodTypes = Object.keys(MARKER_ICONS);

	$scope.allChecked = true;
	$scope.foodTypeChecked = {};

        $scope.menuFindMe = function () {
            $location.path("/");
            $scope.findMe(true);
        };

	$scope.openSuggestion = function() {
	    $location.path('/suggestion');
	};

	$scope.menuSelectAll =  function() { 
	    $scope.allChecked = true;
	    $scope.foodTypeChecked = {};
	    $scope.filterMarkers($scope.foodTypes);
	};

	$scope.menuSelectFoodType = function (food) {
	    $scope.allChecked = false;
	    $scope.foodTypeChecked[food] = !$scope.foodTypeChecked[food];
	    var checkedTypes = _.filter($scope.foodTypes, function (foodtype) {
		return $scope.foodTypeChecked[foodtype]; });
	    if (_.isEmpty(checkedTypes)) {
		$scope.menuSelectAll();
	    } else {
		$scope.filterMarkers(checkedTypes);
	    }
	};
	
        $scope.menuSelectDistrict = function (district) {
	    $scope.active = '';
            //$scope.hideMenu();
            $scope.centerPosition(district.lat, district.lng, district.zoom);
        };

	$scope.toggleItem = function (item) {
	    $scope.active = ($scope.active === item) ? '': item;
	};

	$scope.isActive = function (item) {
	    return $scope.active === item;
	};
    });

eob_controllers.controller(
    'eob_MapCtrl',
    function($scope, $http, $location,
             eob_data, eob_geolocation, eob_imgCache)
    {
	eob_imgCache.load(MARKER_ICONS);

	console.log(ASCII_ART);
	$scope.seemenu = true;
	$scope.seepanel = false;
	$scope.place = null;
	$scope.panel = true;
	$scope.suggestions = true;
	$scope.menustate = "close";

	$scope.hidePanel = function() { $scope.seepanel = false; };
	$scope.showPanel = function() { 
	    $scope.seepanel = true; 
	    if (window.innerWidth < 760) {
		$scope.hideMenu();
	    }
	};
	$scope.hideMenu = function() { 
	    $scope.seemenu = false; 
	    $scope.menustate = "open"; 
	};
	$scope.showMenu = function() { 
	    $scope.seemenu = true; 
	    $scope.menustate = "close"; 
	};


	$scope.toggleMenu = function () { 
	    $scope.seemenu = !$scope.seemenu; 
	    $scope.menustate = $scope.menustate === "open" ? "close" : "open"; 
	};

	$scope.setPlace = function (place) { $scope.place = place; };
	$scope.setSuggestions = function (place) { $scope.suggestions = place; };
	$scope.setPanel = function (panel) { $scope.panel = panel; };

	$scope.openPlace  = function(placeSlug) {
	    $location.path('/place/' + placeSlug);
	    $scope.$apply();
	};

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
                    if (panelWidth >= mapWidth) { panelWidth = 0; }
                    var adjust = panelWidth / 2 - menuWidth / 2;
	            map.panTo(center);
		    if (zoom) { map.setZoom(zoom); }  
                    map.panBy(adjust, 0);
		}, 0);
            } else {
		map.panTo(center);
		if (zoom) { map.setZoom(zoom); }
            }
	};

	$scope.getLocation = function() {
	    eob_geolocation.getCurrentPosition(function(position) {
		eob_imgCache.load(
                    _.pick(MARKER_ICONS, 'findme')
		).then(function () {
	            var pos = new google.maps.LatLng(position.coords.latitude,
					             position.coords.longitude);
		    return pos;
		});
	    });
	};

	$scope.findMe = function(center) {
	    eob_geolocation.getCurrentPosition(function(position) {
		eob_imgCache.load(
                    _.pick(MARKER_ICONS, 'findme')
		).then(function () {
	            var pos = new google.maps.LatLng(position.coords.latitude,
					             position.coords.longitude);

                    if (findMeMarker !== null) {
			markers.splice(markers.indexOf(findMeMarker), 1);
			findMeMarker.setMap(null);
                    }
	            findMeMarker = new google.maps.Marker({
			map: map,
			position: pos,
			icon: 'images/SVG/iamhere.svg',
			animation: google.maps.Animation.DROP,
			zIndex: 9999999,
	            });
                    markers.push(findMeMarker);

		    if (center) {
			$scope.centerPosition(position.coords.latitude, position.coords.longitude);
		    }
		    
		    getSuggestedPlaces(pos, $scope.places);
		});
	    });
	};

	eob_data.placesPromise.success(function (data) {
            $scope.places = data;
	    //$scope.findMe(false);
	});

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
            if (index === null) { index = 0; }

            if (index >= 0 && index < $scope.places.length) {
		var place = $scope.places[index];
		eob_imgCache.load(
                    _.pick(MARKER_ICONS, place.foodtype)
		).then(function () {
		    var image = {
			url: MARKER_ICONS[place.foodtype],
			size: new google.maps.Size(70, 85),
			scaledSize: new google.maps.Size(70, 85)
		    };
                    var marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.lat, place.lng),
			map: map,
			title: place.name,
			icon: image,
			animation: google.maps.Animation.DROP
	            });
	            markers.push(marker);

	            google.maps.event.addListener(marker, 'click', function(){
			$scope.openPlace(place.slug);
		    });

                    setTimeout(_.partial(addMarkersFrom, index + 1), DROP_DELAY);
		});
            }
	    else if (index === $scope.places.length) { $scope.findMe(false); }
	}

	$scope.filterMarkers = function(types) {
	    _.map(markers, function(marker) {
		var visible = undefined != _.find(types, function (type) {
		    return marker.getIcon().url == MARKER_ICONS[type];
		});
		marker.setVisible(visible);
	    });
	    
	};

	function getSuggestedPlaces(pos, places) {
	    var suggestions = {},
	        i = 0,
	        min = 999;
	    
	    for (i; i < places.length; i++) {
		var placePos = new google.maps.LatLng(places[i].lat,places[i].lng);
		var distance = (google.maps.geometry.spherical.computeDistanceBetween(
                    pos, placePos ) / 1000).toFixed(2);
		places[i].distance = distance;
		if (min > distance) {
		    min = distance;
		}
	    }

	    if (min >= 999) { suggestions = null; }
	   
	    // Get the closest places
	    var newPlaces = places.slice(0);
	    newPlaces.sort(compareDistances);
	    suggestions = newPlaces.slice(0,5);
	    return suggestions;
	}

	function compareDistances(a,b) {
	    if (a.distance < b.distance) { return -1; }
	    if (a.distance > b.distance) { return 1;  }
	    return 0;
	}
	
	function fitBounds(markers) {
	    var bounds = new google.maps.LatLngBounds();
	    for (var i = 0; i < markers.length; i++) {
		if (markers[i].getVisible() === true) {
		    bounds.extend(markers[i].getPosition());
		}
	    }

	    map.fitBounds(bounds);
	}

	// do something only the first time the map is loaded
	google.maps.event.addListenerOnce(map, 'tilesloaded', function () {
            eob_data.placesPromise.then(_.partial(addMarkersFrom, 0));
	});
    });


eob_controllers.controller(
    'eob_PlaceCtrl', function($scope, $location, $window) {
        var shareMsg = function (place) {
            return 'I found delicious ' + place.foodtype +
                ' at '+ place.name + ' via #EatOutBerlin';
        };

        var twitterShareUrl = function () {
	    event = event || window.event;
	    event.stoppPropagation ? event.stopPropagation() : (event.cancelBubble=true);

            var place = $scope.place;
            if (place) {
                var msg = shareMsg(place);
                return 'http://twitter.com/share?' +
                    'text=' + $window.encodeURIComponent(msg) +
                    '&url=' + $location.absUrl();
            }
            return '';
        };

        function externalize(url) {
            return $location.protocol() +
                '://' + $location.host() +
                '/' + url;
        }

        $scope.twitterShare = function () {
            $window.open(
                twitterShareUrl(),
                'height=450, width=550' +
                    ', top='  + ($window.innerHeight/2 - 225) +
                    ', left=' + ($window.innerWidth/2 - 275) +
                    ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        };

        $scope.facebookShare = function () {
	    event = event || window.event; 
	    event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);
            var place = $scope.place;
            if (place) {
                var msg = shareMsg(place);
                FB.ui({
                    method: 'feed',
                    link: $location.absUrl(),
                    picture: externalize(place.images[0]),
                    name: "Eat Out Berlin: " + place.name,
                    description: place.description
                }, function () {});
            }
        };
    });


eob_controllers.controller(
    'eob_PlaceUrlCtrl', function($scope, $routeParams, eob_data) {
        eob_data.placesPromise.success(function (places) {
            var place = _.findWhere(places, {slug: $routeParams.placeSlug});
            if (place !== null) {
		$scope.setPanel('place');
                $scope.setPlace(place);
	        $scope.showPanel();
                $scope.centerPosition(place.lat, place.lng, 16);
            } else {
                alert("Place not found: " + $routeParams.placeSlug);
            }
        });
    });


eob_controllers.controller(
    'eob_SuggestionUrlCtrl', function($scope, eob_data) {
	eob_data.placesPromise.success(function (places) { 
	    $scope.setPanel('suggestion');
            $scope.setSuggestions(places);
	    $scope.showPanel();
	});

    });


eob_controllers.controller(
    'eob_NoPlaceUrlCtrl', function($scope) {
        $scope.hidePanel();
    });
