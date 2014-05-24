
'use strict';


var eatoutControllers = angular.module('eatoutControllers', []);

eatoutControllers.controller(
    'mapCtrl', function($scope, $http, places, weather) {
	$scope.berlin = new google.maps.LatLng(52.5096315, 13.4018519);

	$scope.seemenu = false;
	$scope.seeplace = false;

	$scope.showMenu = function () { 
	    $scope.seemenu = ($scope.seemenu == true)? false: true;
	}

	$scope.showPlace = function(place) {
	    $scope.seeplace = true;
	    $scope.place = place;
	    $scope.$apply();
	}
	
	$scope.hidePlace = function() {
	    $scope.seeplace = false;
	}

	$scope.districts = {};

	$scope.marker_icons = {
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

	$scope.marker_icons2 = {
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

	$scope.centerPosition = function(lat,lng, zoom) {
	    var center = new google.maps.LatLng (lat, lng);
	    console.log(center);
	    $scope.map.panTo(center);
	    $scope.map.setZoom(parseInt(zoom));
	    $scope.seemenu = false;
	};

	// Loading the places and districts
	places.getPlaces($scope);
	places.getDistricts($scope);

	// Loading weather
	weather.getWeather($scope);


	var markers = [];
	var infowindows = [];
	var iterator = 0;

	function getContent(place) {
	    return "<div class='info-content'><h1>"+place.name+"</h1><div class='rating'><div class='rating-value' style=width:"+place.rating*120/5+"px></div></div><div class='description'>"+place.description+"</div></div>";
	}

	function drop() {
	    for (var i = 0; i < $scope.places.length; i++) {
		setTimeout(function(place) {
		    addMarker();
		}, i * 200);
	    }
	}

	function addMarker() {
	    var place = $scope.places[iterator];
	    var pos = new google.maps.LatLng(place.lat, place.lng);
	    /*var infowindow = new google.maps.InfoWindow({
	      content: getContent(place),
	      maxWidth: 600
	      }); */
	    
	    var marker = new google.maps.Marker({
		position: pos,
		map: $scope.map,
		icon: $scope.marker_icons[place.foodtype],
		animation: google.maps.Animation.DROP
	    });
	    markers.push(marker);
	    //infowindows.push(infowindow);
	    google.maps.event.addListener(marker, 'click', function() {
		$scope.showPlace(place);
		$scope.map.panTo(pos);
		if ($scope.map.getZoom() < 16)
		    $scope.map.setZoom(16);
		$scope.map.panBy(150,0);
		//_.map(infowindows, function(i){i.close();})
		//infowindow.open($scope.map,marker);
	    });
	    iterator++;
	}

	function fitBounds (markers) {
	    var bounds = new google.maps.LatLngBounds();
	    for(var i=0;i<markers.length;i++) {
		bounds.extend(markers[i].getPosition());
	    }

	    $scope.map.fitBounds(bounds);
	}


	$scope.geoLocate = function() {
	    // Try HTML5 geolocation
	    if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		    var pos = new google.maps.LatLng(position.coords.latitude,
						     position.coords.longitude);
		    
		    var marker = new google.maps.Marker({
			position: pos,
			map: $scope.map,
			icon: 'images/SVG/iamhere.svg',
			animation: google.maps.Animation.DROP
		    });
		    markers.push(marker);
		    /* var infowindow = new google.maps.InfoWindow({
		       map: $scope.map,
		       position: pos,
		       content: 'You are here'
		       });*/

		    var distanceToBerlin = (google.maps.geometry.spherical.computeDistanceBetween(pos, $scope.berlin)/1000).toFixed(2);
		    console.log(distanceToBerlin);
		    //$scope.map.panTo(pos);
		    //$scope.map.setZoom(5);
		    fitBounds(markers);
		}, function() {
		    handleNoGeolocation(true);
		});
	    } else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	    }

	    $scope.seemenu = false;
	    //$scope.hidePlace();
	}


	function handleNoGeolocation(errorFlag) {
	    if (errorFlag) {
		var content = 'Error: The Geolocation service failed.';
	    } else {
		var content = 'Error: Your browser doesn\'t support geolocation.';
	    }
	}
	
	$scope.initialize = function() {

	    var mapOptions = {
		center: $scope.berlin,
		zoom: 13,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
					     mapOptions);
	    var styles = [
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

	    $scope.map.setOptions({styles: styles});

	    // do something only the first time the map is loaded
	    google.maps.event.addListenerOnce($scope.map, 'tilesloaded', function(){
		drop();
	    });
	    $scope.place = places.getPlace();
	};
	
    });



eatoutControllers.controller(
    'placeCtrl', function($scope, $http) { 

	


    });
