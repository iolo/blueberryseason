'use strict';

angular.module('app.controllers', [])
  .controller('postListCtrl', [ '$scope', '$location', 'api' , function ($scope, $location, api) {
    api.posts.list(function (err, data) {
      if (err) {
        return console.error(err);
      }
      $scope.posts = data;
    });
  }])
  .controller('postShowCtrl', ['$scope', '$routeParams', '$location', 'api', function ($scope, $routeParams, $location, api) {
    var postId = $routeParams.postId;

    api.posts.get(postId, function (err, data) {
      if (err) {
        return console.error(err);
      }
      $scope.post = data;
    });

    $scope.deletePost = function () {
      api.posts.destroy(postId, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $location.path('/posts');
      });
    };

    api.comments.list(postId, function (err, data) {
      if (err) {
        return console.error(err);
      }
      $scope.comments = data;
    });

    $scope.selectComment = function(index) {
      $scope.commentIndex = index;
    }

    $scope.deleteComment = function () {
      var commentId = $scope.comments[$scope.commentIndex].id;
      api.comments.destroy(postId, commentId, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $scope.comments.splice($scope.commentIndex, 1);
      });
    };

    $scope.comment = {
      content: '',
      author: '',
      postId: postId
    };
    $scope.submitComment = function () {
      api.comments.create($scope.comment, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $scope.comments.push(data);
        $scope.comment = {
          content: '',
          author: '',
          postId: postId
        };
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
    $scope.submitPost = function () {
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
    $scope.submitPost = function () {
      api.posts.update($scope.post, function (err, data) {
        if (err) {
          return console.error(err);
        }
        $location.path('/posts');
      });
    };
  }]);
