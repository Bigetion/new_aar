(function() {
  'use strict';
  App.controller('ContactCtrl', ['$scope', 'QueryService',
    function($scope, QueryService) {
      QueryService.get('query=select * from users').then(function(response){
        $scope.data = response.data
      })
    }
  ]);
})()