'use strict';

var
  _ = require('underscore'),
  nobatis = require('nobatis'),
  dataSource = nobatis.createDataSource(),
  postDao = nobatis.createDao({
    table: 'posts',
    defaults: {
      id: 0,
      created: new Date(),
      modified: new Date(),
      author: '',
      title: '',
      content: ''
    }
  });

postDao.listWithCommentsCount = function (bounds, callback) {
  var args = [ 'posts.selectWithCommentsCount', [] ];
  if (arguments.length === 2) { // with 'bounds' argument
    args.push(bounds);
    args.push(callback);
  } else { // with 'bounds' argument
    callback = bounds;
    args.push(callback);
  }
  dataSource.withSession(function (session) {
    session.select.apply(session, args);
  });
};

module.exports = postDao;

