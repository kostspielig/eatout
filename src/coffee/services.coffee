###
eatout - yummy places in the hood
Copyright (C) 2014-2016 Maria Carrasco Rodriguez

This file is part of eatout.

eatout is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

eatout is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with eatout.  If not, see <http://www.gnu.org/licenses/>.
###
eob_services = angular.module 'eob.services', []

eob_services.factory 'eob_imgCache', [ '$q', ($q) ->
    loadImg = (url) ->
        promise = $q.defer()
        img = new Image()
        img.src = url.url
        img.onload  = -> promise.resolve(img)
        img.onerror = -> promise.reject(img)
        promise


    cache = {}

    load: (images) ->
        promises = {}
        for key of images
            promise = cache[key]
            if promise == null
                promise = cache[key] = loadImg(images[key])
            promises[key] = promise

        $q.all promises
]

eob_services.factory 'eob_msg', [ '$q', '$timeout', ($q, $timeout) ->
    logger = (x) -> console.log "MESSAGE: ", x
    callbacks: [ logger ]
    put: (msg) ->
        $timeout (=>
            this.callbacks.forEach (fn) -> fn text: msg
        ), 0
]

eob_services.factory 'eob_geolocation', ['eob_msg', (eob_msg) ->
    getCurrentPosition: (success) ->
        # Try HTML5 geolocation
        if navigator.geolocation
            navigator.geolocation.getCurrentPosition success, ->
                eob_msg.put "Geolocation failed!"
        else
            eob_msg.put "Geolocation not supported by your browser!"
]

eob_services.factory 'eob_data', [ '$http', '$q', ($http, $q) ->
    service = {}
    service.placesPromise = $http.get 'api/places.json'
        .success (data) ->
            # Order the array by descending vertical position on the map
            data.sort (a, b) -> b.lat - a.lat
            service.places = data
    service.districtsPromise = $http.get 'data/districts.json'
        .success (data) ->
            service.districts = data
    service.promise = $q.all [service.placesPromise, service.districtsPromise]
    return service
]

eob_services.factory 'eob_weather', ['$http', ($http) ->
    FORECAST_ENDPOINT = "https://query.yahooapis.com/v1/public/yql?q="
    FORECAST_YQL_OPEN 	= "select item from weather.forecast where woeid in (select woeid from geo.places where text='"
    FORECAST_YQL_CLOSE 	= "') and u='c'&format=json"
    YQL_BERLIN = "Berlin, Germany"

    {
        getWeather: (scope) ->
            url = FORECAST_ENDPOINT + FORECAST_YQL_OPEN + YQL_BERLIN + FORECAST_YQL_CLOSE
            $http.get(url).success( (data) ->
                scope.weather = data
                scope.temp = data.query.results.channel[0].item.condition.temp
                scope.wcode = data.query.results.channel[0].item.condition.code
            )
    }
]
