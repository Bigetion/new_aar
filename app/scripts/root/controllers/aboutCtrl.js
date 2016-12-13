(function() {
  'use strict';
  App.controller('AboutCtrl', ['$scope', function($scope) {
    
    $scope.img = "";
    $scope.onChange = function (myFile) {
      $scope.img = "data:" + myFile.filetype + ";base64," + myFile.base64;
    };
    
    $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
      
    };
  
    var uploadedCount = 0;
  
    $scope.files = [];

  }]);
})()