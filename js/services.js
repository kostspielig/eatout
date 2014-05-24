var eatoutServices = angular.module('eatoutServices', []);
 
eatoutServices.factory('places', ['$http', '$rootScope',
  function($http, $rootScope){

      $rootScope.place = '';
      service = {
	  getPlaces: function(scope) {
	      $http.get('data/places.json').success(function(data) {
		  scope.places = data;
		  //scope.place = data[12];
              });
	  },
	  
	  getDistricts: function(scope) {
	      $http.get('data/districts.json').success(function(data) {
		  scope.districts = data;
              });
	  },

	  setPlace: function(place) {
	      $rootScope.place = place;
	  },
	  
	  getPlace: function() {
	      return ;
	  }
      };
      return service;
  }]);

eatoutServices.factory('weather', ['$http',
  function($http, $rootScope){
      //var query = 'http://query.yahooapis.com/v1/public/yql?q=select item from weather.forecast where location="GMXX0007"and u="c"&format=json';
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
		  //console.log(scope.weather.query.results.channel);
		  //console.log(scope.temp);
	      });
	  }
      };
      return service;

  }]);
