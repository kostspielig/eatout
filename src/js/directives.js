
var eob_directives = angular.module('eob.directives', []);

eob_directives
    
    .directive('eob-dropdown', function() {
	return function(scope, element, attr){
	    element.on('click', function(event) {
		if ( element.parent().hasClass('open') ) {
		    element.parent().removeClass('open');
		} else { element.parent().addClass('open'); }
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
	};
    });
