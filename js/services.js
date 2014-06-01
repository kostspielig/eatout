var eatoutServices = angular.module('eatoutServices', []);

eatoutServices.factory('geolocation', function () {
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

eatoutServices.factory('backendData', function($http, $q) {
    var service = {}

    service.placesPromise = $http.get('data/places.json')
        .success(function(data) {
	    // Order the array by descending vertical position on the map
	    data.sort(function (a, b){
		return (b.lat - a.lat)
	    });
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

eatoutServices.factory('weather', ['$http',
  function($http, $rootScope){
      var weather = '';
      var FORECAST_ENDPOINT = "http://query.yahooapis.com/v1/public/yql?q=";
      var FORECAST_YQL_OPEN 	= "select * from weather.forecast where location='";
      var FORECAST_YQL_CLOSE 	= "'and u='c'&format=json";
      var YQL_BERLIN = "GMXX0007";

      service ={
	  getWeather: function(scope) {
	      var url = FORECAST_ENDPOINT + FORECAST_YQL_OPEN + YQL_BERLIN + FORECAST_YQL_CLOSE;
	      $http.get(url).success(function(data) {
		  scope.weather = data;
		  scope.temp = data.query.results.channel.item.condition.temp;
		  scope.wcode = data.query.results.channel.item.condition.code;
	      });
	  }
      };
      return service;

  }]);
