'use strict';
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
    'ngStorage'
  ])
  .config(function (ScrollBarsProvider) {
    // the following settings are defined for all scrollbars unless the
    // scrollbar has local scope configuration
    ScrollBarsProvider.defaults = {
        scrollButtons: {
            scrollAmount: 'auto', // scroll amount when button pressed
            enable: true // enable scrolling buttons by default
        },
        scrollInertia: 400, // adjust however you want
        axis: 'yx', // enable 2 axis scrollbars by default,
        theme: 'minimal-dark',
        autoHideScrollbar: false
    };
    
    PDFJS.workerSrc = 'root/factories/pdfjs/build/pdf.worker.js';
});