'use strict';

angular.module('blerter.filters',[])

    .filter('dateLabel', function($filter) {

      return function(value,format) {

        if (value === undefined ||
            value === '') {
          return;
        }

        return $filter('date')(value,format);

      };
    })

    .filter('capitalizedFirstCharacterInWord', function() {

      return function(value) {
        return value.replace(/\w\S*/g, function(txt){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      };
    })

    .filter('capitalizedFirstCharacter', function() {

      return function(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      };
    })

    .filter('highlight', function($sce) {
      return function(text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlight">$1</span>')

        return $sce.trustAsHtml(text)
      };
    });
