'use strict';
var Config = angular.module('newAarApp.config', []);
var App = angular
    .module('newAarApp', [
        'ui.router',
        'ui.bootstrap',
        'ngMaterial',
        'smart-table',
        'ui-notification',
        'ngFileUpload',
        'naif.base64',
        'ngResource',
        'ui.select',
        'ngScrollbars',
        'ngLodash',
        'ngStorage',
        'perfect_scrollbar',
        'classy',
        'newAarApp.config',
        'ngCookies',
        'ngSanitize',
        'angular-loading-bar'
    ])
    .config(function(ScrollBarsProvider) {
        ScrollBarsProvider.defaults = {
            scrollButtons: {
                scrollAmount: 'auto', 
                enable: true 
            },
            scrollInertia: 400,
            axis: 'yx', 
            theme: '3d-thick-dark',
            autoHideScrollbar: false
        };

        PDFJS.workerSrc = 'root/factories/pdfjs/build/pdf.worker.js';
    }).run(['$rootScope', '$state', function($rootScope, $state) {
        $rootScope.$on('$stateChangeStart', function(event, toState) {
            $rootScope.currentState = $state.current.name;
        });
        $rootScope.$on('$stateChangeSuccess', function(event, toState) {
            $rootScope.currentState = $state.current.name;
        });

    }])