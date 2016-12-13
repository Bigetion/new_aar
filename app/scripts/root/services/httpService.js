(function() {
  'use strict';
  App.service('HttpService', ['$rootScope', '$http', '$q', 'Notification',
    function($rootScope, $http, $q, Notification) {
      return {
        get: function(url, data, actionName) {
          var deferred = $q.defer();
          $http({
            url: url,
            method: "POST",
            data: data,
            headers: {
              "Accept": "application/json"
            }
          }).then(function(response) {
            deferred.resolve(response.data);

            if (response.data.error_message) {
              Notification.error({
                message: response.data.error_message
              })
            }
          }, function(error) {
            deferred.reject(error);
            Notification.error({
              message: "Failed to execute,\n" + (error.status > 0 ? error.status + " " + error.data : ", Cannot Connect To Server")
            })
          });

          return deferred.promise;
        }
      };
    }
  ]);
})();
