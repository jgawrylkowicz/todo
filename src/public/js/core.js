var app = angular.module('todo', ['ui.router' , 'mainCtrl', 'listCtrl', 'loginCtrl' , 'listService', 'userService']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $locationProvider.hashPrefix(''); // by default '!'
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/lists"); // route to /lists by default
  $httpProvider.defaults.timeout = 5000;

  // Nested states for handling a single page application

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: '/views/login.html',
    controller: 'loginCtrl',
    params: {
      err: null,
      info: null
    }
  }).state('lists', {
    url: '/lists',
    views: {
      "": {
        templateUrl: '/views/home.html',
        controller: 'mainCtrl',
        params: {
          sessionType: 'offline'
        }
      },
      'list@lists': {
        templateUrl: '/views/list.html',
        controller: 'listCtrl',
        params: {
          listID: null
        }
      }
    }
  });

}]);
