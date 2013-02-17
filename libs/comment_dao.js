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

module.exports = postDao;

