(function() {
  'use strict';
  App.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('main', {
        url: "/",
        views: {
          "content": {
            controller: 'MainCtrl',
            templateUrl: "scripts/root/views/main.html"
          }
        }
      })
      .state('about', {
        url: "/about",
        views: {
          "content": {
            controller: 'AboutCtrl',
            templateUrl: "scripts/root/views/about.html"
          }
        }
      })
      .state('contact', {
        url: "/contact",
        views: {
          "content": {
            controller: 'ContactCtrl',
            templateUrl: "scripts/root/views/contact.html"
          }
        }
      })
  }]);
})();