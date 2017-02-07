(function() {
  'use strict';
  App.controller('MainCtrl', ['$scope', 'QueryService', 'Notification',
    function($scope, QueryService, Notification) {

      $scope.userList = {
        data: [],
        page: 1,
        totalRecord: 0
      }

      QueryService.getByOptions('table=users&page=1&page_limit=10').then(function(response) {
        $scope.userList.page = 1;
        $scope.userList.data = response.data
        $scope.userList.totalRecord = '' + response.total_record
      })

      $scope.userListPageChanged = function() {
        QueryService.getByOptions('table=users&page=' + $scope.userList.page + '&page_limit=10').then(function(response) {
          $scope.userList.data = response.data
        })
      }

    }
  ]);
})()