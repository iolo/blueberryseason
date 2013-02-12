'use strict';

var
  _ = require('underscore'),
  postDao = require('nobatis').createDao({ table: 'posts' });

function callbackJsonResponse(res) {
  return function (err, result) {
    if (err) {
      return res.json({error: err});
    }
    return res.json({result: result});
  };
}

function list(req, res) {
  postDao.all(callbackJsonResponse(res));
}

function get(req, res) {
  var postId = req.param('postId');
  postDao.get(postId, callbackJsonResponse(res));
}

function create(req, res) {
  var post = postDao.create(req.body);
  postDao.save(post, callbackJsonResponse(res));
}

function update(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, function (err, post) {
    if (err) {
      return res.json({error: err});
    }
    post = _.defaults(post, req.body);
    postDao.save(post, callbackJsonResponse(res));
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
