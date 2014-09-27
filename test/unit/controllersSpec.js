'use strict';

/* jasmine specs for controllers go here */
describe('EOB controllers', function() {

    beforeEach(function(){
	this.addMatchers({
	    toEqualData: function(expected) {
		return angular.equals(this.actual, expected);
	    }
	});
    });

    describe('eob_MapCtrl', function(){
	var scope, ctrl, $httpBackend;

	beforeEach(module('eob.app'));
	beforeEach(module('eob.services'));

	beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
	    $httpBackend = _$httpBackend_;
	    $httpBackend.expectGET('data/places.json').
		respond([{"name": "Sala Da Mangiare",
			  "url": "http://www.saladamangiare.de/",
			  "address" : "Mainzer Straße 23",
			  "date" : "2014-09-20",
			  "foodtype": "italian",
			  "lat": 52.480655,
			  "lng": 13.427778,
			  "title": "Homemade Pasta in Neukolln",
			  "description": "We liked the wine, and the homemade licorice liqueur was a surprise.",
			  "rating": 4.6,
			  "recommended": true,
			  "images": ["images/places/SalaDaMangiare/cover.JPG"]
			 }]);

	    scope = $rootScope.$new();
	    ctrl = $controller('eob_MapCtrl', {$scope: scope});
	}));

	it('should create "phones" model with sala da mangiare', inject(function($controller) {
	    console.log("hallo");
	    expect(scope.places[0].name).toBe("Sala Da Mangiare");
	}));
    });
});
