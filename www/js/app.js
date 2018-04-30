// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var kurento_room = angular.module('kurento_room',
    ['ionic', 'appCtrlLogin', 'appCtrlCall', 'appCtrlSrvPart', 'appCtrlSrvRoom']);

    kurento_room.run(function ($ionicPlatform, $state) {
      $ionicPlatform.ready(function () {

        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
  });
  
  kurento_room.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  
      $stateProvider
          .state('root', {
              url: '/',
              templateUrl: 'angular/login/login.html',
              controller: 'loginController'
          })
          .state('login', {
              url: '/login',
              templateUrl: 'angular/login/login.html',
              controller: 'loginController'
          })
          .state('call', {
              url: '/call',
              templateUrl: 'angular/call/call.html',
              controller: 'callController'
          });
  
          $urlRouterProvider.otherwise('/');
          $ionicConfigProvider.navBar.alignTitle('center');
  });
  
