
eob_directives = angular.module 'eob.directives', []

eob_directives
  .directive 'eob-dropdown', ->
    (scope, element, attr) ->
      element.on 'click', (event) ->
    		if element.parent().hasClass('open') 
  		    element.parent().removeClass('open')
    		else element.parent().addClass('open')	
      

  .directive 'eob_markdown', ->
    converter = new Showdown.converter()
    {
      restrict: 'E',
      link: (scope, element, attrs) ->
        htmlText =  converter.makeHtml element.text()
        element.html htmlText
    }
    
