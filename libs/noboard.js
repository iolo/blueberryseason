'use strict';

var
  _ = require('underscore'),
  nobatis = require('nobatis'),
  dataSource = nobatis.createDataSource(),
  posts = nobatis.createDao({
    table: 'posts',
    defaults: function () {
      return {
        id: 0,
        created: new Date(),
        modified: new Date(),
        author: '',
        title: '',
        content: ''
      };
    }
  }),
  comments = nobatis.createDao({
    table: 'comments',
    defaults: function () {
      return {
        id: 0,
        created: new Date(),
        modified: new Date(),
        author: '',
        content: '',
        postId: ''
      };
    }
  });

function getPostsWithCommentsCount(bounds) {
  return dataSource.withSession(function (session) {
    return session.select('posts.selectWithCommentsCount', [], bounds);
  });
}

function getCommentsByPost(postId) {
  return dataSource.withSession(function (session) {
    return session.select('comments.selectByPost', { postId: postId });
  });
}

module.exports = {
  getPostsWithCommentsCount: getPostsWithCommentsCount,
  getCommentsByPost: getCommentsByPost,
  posts: posts,
  comments: comments
};

