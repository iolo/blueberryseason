'use strict';

angular.module('app', ['app.filters', 'app.services', 'app.directives', 'app.controllers'])
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/posts', {templateUrl: 'partials/posts/list.html', controller: 'postListCtrl'});
    $routeProvider.when('/posts/new', {templateUrl: 'partials/posts/form.html', controller: 'postNewCtrl'});
    $routeProvider.when('/posts/:postId', {templateUrl: 'partials/posts/show.html', controller: 'postShowCtrl'});
    $routeProvider.when('/posts/:postId/edit', {templateUrl: 'partials/posts/form.html', controller: 'postEditCtrl'});

    $routeProvider.otherwise({redirectTo: '/posts'});

  }])
  .run(['$rootScope', '$location', '$http', '$window', 'api', function ($rootScope, $location, $http, $window, api) {
    // ...
    api.init();
  }]);
