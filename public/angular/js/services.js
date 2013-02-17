'use strict';

angular.module('app.services', [])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.responseInterceptors.push(['$q', '$rootScope', function ($q, $rootScope) {
      function onSuccess(res) {
        $rootScope.httpLoading = false;
        $rootScope.httpError = false;
        return res;
      }

      function onError(res) {
        $rootScope.httpLoading = false;
        $rootScope.httpError = true;
        return $q.reject(res);
      }

      return function (promise) {
        $rootScope.httpLoading = true;
        $rootScope.httpError = false;
        return promise.then(onSuccess, onError);
      };
    }]);
  }])
  .factory('api', ['$rootScope', '$http', function ($rootScope, $http) {

    //return $resource('/api/1/posts/:postId', {postId:'@id'});

    function proxyCallback(callback) {
      return function (res) {
        if (res.status < 200 && res.status >= 300) {
          return callback(res.status, res.data.error);
        }
        return callback(null, res.data);
      }
    }

    function posts_list(callback) {
      var req = {
        method: 'GET',
        url: '/api/1/posts'
      };
      $http(req).then(proxyCallback(callback));
    }

    function posts_get(postId, callback) {
      var req = {
        method: 'GET',
        url: '/api/1/posts/' + postId
      };
      $http(req).then(proxyCallback(callback));
    }

    function posts_create(post, callback) {
      var req = {
        method: 'POST',
        url: '/api/1/posts',
        data: post
      };
      $http(req).then(proxyCallback(callback));
    }

    function posts_update(post, callback) {
      var req = {
        method: 'PUT',
        url: '/api/1/posts/' + post.id,
        data: post
      };
      $http(req).then(proxyCallback(callback));
    }

    function posts_destroy(postId, callback) {
      var req = {
        method: 'DELETE',
        url: '/api/1/posts/' + postId
      };
      $http(req).then(proxyCallback(callback));
    }

    function comments_list(postId, callback) {
      var req = {
        method: 'GET',
        url: '/api/1/posts/' + postId + '/comments'
      };
      $http(req).then(proxyCallback(callback));
    }

    function comments_get(postId, commentId, callback) {
      var req = {
        method: 'GET',
        url: '/api/1/posts/' + postId + '/comments/' + commentId
      };
      $http(req).then(proxyCallback(callback));
    }

    function comments_create(comment, callback) {
      var req = {
        method: 'POST',
        url: '/api/1/posts/' + comment.postId + '/comments',
        data: comment
      };
      $http(req).then(proxyCallback(callback));
    }

    function comments_update(comment, callback) {
      var req = {
        method: 'PUT',
        url: '/api/1/posts/' + comment.postId + '/comments/' + comment.id,
        data: post
      };
      $http(req).then(proxyCallback(callback));
    }

    function comments_destroy(postId, commentId, callback) {
      var req = {
        method: 'DELETE',
        url: '/api/1/posts/' + postId + '/comments/' + commentId
      };
      $http(req).then(proxyCallback(callback));
    }

    function init() {
      // init api client
    }

    return {
      init: init,
      posts: {
        list: posts_list,
        get: posts_get,
        create: posts_create,
        update: posts_update,
        destroy: posts_destroy
      },
      comments: {
        list: comments_list,
        get: comments_get,
        create: comments_create,
        update: comments_update,
        destroy: comments_destroy
      }
    };
  }]);
