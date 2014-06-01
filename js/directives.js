
var eatoutDirectives = angular.module('eatoutDirectives', []);

eatoutDirectives.directive('dropdown', function($document) {
    return function(scope, element, attr){
	element.on('click', function(event) {
	    if ( element.parent().hasClass('open') )
		element.parent().removeClass('open');
	    else element.parent().addClass('open');
	});
    };
});
