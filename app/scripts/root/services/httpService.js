(function () {
  'use strict';
  App.service('HttpService', ['$rootScope', '$http','$q',
    function ($rootScope, $http, $q) {
      return {
        get: function (url, data, actionName) {
          var deferred = $q.defer();
          $http({
            url: url,
            method: "POST",
            data: data,
            headers: {
              "Accept": "application/json"
            }
          }).then(function (response) {
            deferred.resolve(response.data);
          }, function (error) {
            deferred.reject(error);
          });

          return deferred.promise;
        }
      };
    }
  ]);
})();
