/*
 * eatout - yummy places in the hood
 * Copyright (C) 2014-2016 Maria Carrasco Rodriguez
 *
 * This file is part of eatout.
 *
 * eatout is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * eatout is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with eatout.  If not, see <http://www.gnu.org/licenses/>.
 */

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
}

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
                if (promise == null) {
                    promise = cache[key] = loadImg(images[key]);
		}
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
    var service = {};

    service.placesPromise = $http.get('data/places.json')
        .success(function(data) {
	    // Order the array by descending vertical position on the map
	    data.sort(function (a, b) {
		return (b.lat - a.lat);
	    });
            // Compute slug information
            data.forEach(function (place) {
                place.slug = toSlug(place.name);
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

eob_services.factory('eob_weather', ['$http',
  function($http){
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
