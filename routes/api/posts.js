'use strict';

var
  _ = require('underscore'),
  postDao = require('nobatis').createDao({
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

function callbackJsonResponse(res) {
  return function (err, result) {
    if (err) {
      return res.json({error: err});
    }
    return res.json(result);
  };
}

function list(req, res) {
  postDao.all(callbackJsonResponse(res));
}

function get(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, callbackJsonResponse(res));
}

function create(req, res) {
  var post = postDao.createNew(req.body);
  postDao.save(post, function (err, numRows, insertId) {
    if (err) {
      return res.json({error: err});
    }
    console.log('posts create:', arguments);
    postDao.load(insertId, callbackJsonResponse(res));
  });
}

function update(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, function (err, post) {
    if (err) {
      return res.json({error: err});
    }
    post = _.defaults(req.body, post);
    postDao.save(post, function (err, numRows) {
      if (err) {
        return res.json({error: err});
      }
      console.log('posts update:', arguments);
      postDao.load(postId, callbackJsonResponse(res));
    });
  });
}

function destroy(req, res) {
  var postId = req.param('postId');
  postDao.destroy(postId, callbackJsonResponse(res));
}

module.exports = {
  list: list,
  get: get,
  create: create,
  update: update,
  destroy: destroy
};
