'use strict';

var
  _ = require('underscore'),
  bbs = require('../../libs/bbs');

function jsonResponse(res, promise) {
  promise
    .then(function (result) {
      res.json(result);
    })
    .fail(function (err) {
      res.json({error: err});
    })
    .done();
}

function load(id, fn) {
  console.log('*** load post ' + id);
  bbs.posts.load(id)
    .then(function (result) {
      fn(null, result);
    })
    .fail(function (err) {
      fn(err);
    })
    .done();
}

function index(req, res) {
  jsonResponse(res, bbs.getPostsWithCommentsCount());
}

function show(req, res) {
  var postId = req.params.post;
  jsonResponse(res, bbs.posts.load(postId));
}

function create(req, res) {
  var post = bbs.posts.createNew(req.body);
  jsonResponse(res, bbs.posts.save(post, true));
}

function update(req, res) {
  var postId = req.params.post;
  jsonResponse(res, bbs.posts.load(postId).then(function (post) {
    post = _.defaults(req.body, post);
    console.log('update post', post);
    return bbs.posts.save(post, true);
  }));
}

function destroy(req, res) {
  var postId = req.params.post;
  jsonResponse(res, bbs.posts.destroy(postId));
}

module.exports = {
  load: load,
  index: index,
  show: show,
  create: create,
  update: update,
  destroy: destroy
};
