(function() {
  'use strict';

  App.service('QueryService', ['$http', 'HttpService', function($http, HttpService) {
    return {
      get: function(query_string) {
        return HttpService.get('http://localhost/tes_api/?' + query_string, {}, "Get Data");
      }
    }
  }]);

})()