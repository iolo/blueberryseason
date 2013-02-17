'use strict';

var
  _ = require('underscore'),
  nobatis = require('nobatis'),
  dataSource = nobatis.createDataSource(),
  commentDao = nobatis.createDao({
    table: 'comments',
    defaults: {
      id: 0,
      created: new Date(),
      modified: new Date(),
      author: '',
      content: '',
      postId: ''
    }
  });

commentDao.listByPost = function(postId, callback) {
  dataSource.withSession(function (session) {
    session.select('comments.selectByPost', { postId: postId }, callback);
  });
};

module.exports = commentDao;

