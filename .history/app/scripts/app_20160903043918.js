'use strict';
// Here we set up an angular module. We'll attach controllers and 
// other components to this module.
angular.module('newAarApp', ['ngRoute'])
  // Angular supports chaining, so here we chain the config function onto
  // the module we're configuring.
  .config(function ($routeProvider) {

    // We use AngularJS dependency injection to fetch the route provider.
    // The route provider is used to setup our app's routes. 

    // The config below simply says when you visit '/' it'll render
    // the views/main.html template controlled by the MainCtrl controller.

    // The otherwise method specifies what the app should do if it doesn't recognise 
    // the route entered by a user. In this case, redirect to home.
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });