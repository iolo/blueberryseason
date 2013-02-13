'use strict';

angular.module('app.controllers', [])
  .controller('postListCtrl', [ '$scope', '$location', 'api' , function ($scope, $location, api) {
    api.posts.list(function (err, data) {
      if (err) {
        return console.error(err);
      }
      $scope.posts = data;
    });
    $scope.show = function (postId) {
      $location.path('/posts/' + postId);
    };
  }])
  .controller('postShowCtrl', ['$scope', '$routeParams', '$location', 'api', function ($scope, $routeParams, $location, api) {
    var postId = $routeParams.postId;
    api.posts.get(postId, function (err, data) {
      if (err) {
        return console.error(err);
      }
      $scope.post = data;
    });
    $scope.postDelete = function () {
      api.posts.destroy(postId, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $location.path('/posts');
      });
    };
  }])
  .controller('postNewCtrl', ['$scope', '$routeParams', '$location', 'api', function ($scope, $routeParams, $location, api) {
    $scope.post = {
      title: '',
      content: '',
      author: ''
    };
    $scope.editOrNew = 'New';
    $scope.submit = function () {
      api.posts.create($scope.post, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $location.path('/posts');
      });
    };
  }])
  .controller('postEditCtrl', ['$scope', '$routeParams', '$location', 'api', function ($scope, $routeParams, $location, api) {
    var postId = $routeParams.postId;
    api.posts.get(postId, function (err, data) {
      if (err) {
        return console.error(err);
      }
      $scope.post = data;
    });
    $scope.editOrNew = 'Edit';
    $scope.submit = function () {
      api.posts.update($scope.post, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $location.path('/posts');
      });
    };
  }]);
