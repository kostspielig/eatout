
var eob_app = angular.module('eob.app', [
    'ngAnimate',
    'ngRoute',
    'eob.controllers',
    'eob.directives',
    'eob.services'
]);

eob_app.config(
    function($routeProvider) {
	$routeProvider
	    .when('/', {
		templateUrl:'templates/empty.html',
		controller: 'eob_NoPlaceUrlCtrl'
	    })
            .when('/place/:placeSlug', {
		templateUrl:'templates/empty.html',
		controller: 'eob_PlaceUrlCtrl'
	    })
	    .otherwise({
		redirectTo: '/'
	    });
    });

eob_app.config(
    function($locationProvider) {
        $locationProvider.html5Mode(true);
    });

eob_app.run(['$route', angular.noop]);


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
    //cheese: 'images/icons/cheese.png',
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

	$scope.foodTypes = Object.keys(MARKER_ICONS);

	$scope.allChecked = true;
	$scope.foodTypeChecked = {};

        $scope.menuFindMe = function ($event) {
            $location.path("/");
            $scope.findMe();
        }

	$scope.menuSelectAll =  function() { 
	    $scope.allChecked = true;
	    $scope.foodTypeChecked = {};
	    $scope.filterMarkers($scope.foodTypes);
	}

	$scope.menuSelectFoodType = function (food) {
	    $scope.allChecked = false;
	    $scope.foodTypeChecked[food] = !$scope.foodTypeChecked[food];
	    $scope.filterMarkers(_.filter($scope.foodTypes, function (foodtype) {
		return $scope.foodTypeChecked[foodtype];
	    }));
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

	$scope.filterMarkers = function(types) {
	    _.map(markers, function(marker) {
		var visible = null != _.find(types, function (type) { 
		    return marker.getIcon() == MARKER_ICONS[type]
		});
		marker.setVisible(visible);
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
    'eob_PlaceCtrl', function($scope, $location, $window) {
        var shareMsg = function (place) {
            return 'I found delicious ' + place.foodtype
                + ' at '+ place.name + ' via #EatOutBerlin';
        }

        var twitterShareUrl = function () {
            var place = $scope.place;
            if (place) {
                var msg = shareMsg(place);
                return 'http://twitter.com/share?'
                     + 'text=' + $window.encodeURIComponent(msg)
                     + '&url=' + $location.absUrl();
            }
            return '';
        }

        function externalize(url) {
            return $location.protocol()
                + '://' + $location.host()
                + '/' + url;
        }

        $scope.twitterShare = function () {
            $window.open(
                twitterShareUrl(),
                'height=450, width=550'
                    + ', top='  + ($window.innerHeight/2 - 225)
                    + ', left=' + ($window.innerWidth/2 - 275)
                    + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        }

        $scope.facebookShare = function () {
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
            };

        }
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


var eob_directives = angular.module('eob.directives', []);

eob_directives
    
    .directive('eob-dropdown', function($document) {
    return function(scope, element, attr){
	element.on('click', function(event) {
	    if ( element.parent().hasClass('open') )
		element.parent().removeClass('open');
	    else element.parent().addClass('open');
	});
    };
})

    .directive('eob_markdown', function() {
	var converter = new Showdown.converter();
	return {
	    restrict: 'E',
	    link: function(scope, element, attrs) {
		var htmlText =  converter.makeHtml(element.text());
		element.html(htmlText);
	    }
	}
    });

var eob_services = angular.module('eob.services', []);

// https://gist.github.com/bentruyman/1211400
function toSlug (value) {
  // 1) convert to lowercase
  // 2) remove dashes and pluses
  // 3) replace spaces with dashes
  // 4) remove everything but alphanumeric characters and dashes
  return value
        .toLowerCase()
        .replace(/-+/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
};

eob_services.factory('eob_imgCache', function ($q) {
    function loadImg(url) {
        var promise = $q.defer();
        var img = new Image();
        img.src = url;
        img.onload  = function() { promise.resolve(img); };
        img.onerror = function() { promise.reject(img); };
        return promise;
    }

    var cache = {};
    return {
        load: function (images) {
            var promises = {};
            for (var key in images) {
                var promise = cache[key];
                if (promise == null)
                    promise = cache[key] = loadImg(images[key]);
                promises[key] = promise;
            }
            return $q.all(promises);
        }
    };
});

eob_services.factory('eob_geolocation', function () {
    var service = {
        getCurrentPosition: function (success) {
	    // Try HTML5 geolocation
	    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
                    success,
                    function () { alert("Geolocation failed!"); }
                );
            } else {
                alert("Geolocation not supported by your browser!");
            }
        }
    };
    return service;
});

eob_services.factory('eob_data', function($http, $q) {
    var service = {}

    service.placesPromise = $http.get('data/places.json')
        .success(function(data) {
	    // Order the array by descending vertical position on the map
	    data.sort(function (a, b) {
		return (b.lat - a.lat)
	    });
            // Compute slug information
            data.forEach(function (place) {
                place.slug = toSlug(place.name);
            })
	    service.places = data;
        });

    service.districtsPromise = $http.get('data/districts.json')
        .success(function(data) {
	    service.districts = data;
        });

    service.promise = $q.all([service.placesPromise,
                              service.districtsPromise]);
    return service;
});

eob_services.factory('eob_weather', ['$http',
  function($http, $rootScope){
      var weather = '';
      var FORECAST_ENDPOINT = "http://query.yahooapis.com/v1/public/yql?q=";
      var FORECAST_YQL_OPEN 	= "select * from weather.forecast where location='";
      var FORECAST_YQL_CLOSE 	= "'and u='c'&format=json";
      var YQL_BERLIN = "GMXX0007";

      return {
	  getWeather: function(scope) {
	      var url = FORECAST_ENDPOINT + FORECAST_YQL_OPEN + YQL_BERLIN + FORECAST_YQL_CLOSE;
	      $http.get(url).success(function(data) {
		  scope.weather = data;
		  scope.temp = data.query.results.channel.item.condition.temp;
		  scope.wcode = data.query.results.channel.item.condition.code;
	      });
	  }
      };
  }]);
