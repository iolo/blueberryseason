'use strict';

var
  _ = require('underscore'),
  bbs = require('../../libs/bbs');

function list(req, res) {
  bbs.getPostsWithCommentsCount()
    .then(function (posts) {
      res.json(posts);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function get(req, res) {
  var postId = req.param('postId');
  bbs.posts.load(postId)
    .then(function (post) {
      res.json(post);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function create(req, res) {
  var post = bbs.posts.createNew(req.body);
  bbs.posts.save(post, true)
    .then(function (post) {
      res.json(post);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function update(req, res) {
  var postId = req.param('postId');
  bbs.posts.load(postId)
    .then(function (post) {
      post = _.defaults(req.body, post);
      console.log('update post', post);
      return bbs.posts.save(post, true);
    })
    .then(function (post) {
      res.json(post);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function destroy(req, res) {
  var postId = req.param('postId');
  bbs.posts.destroy(postId)
    .then(function (result) {
      res.json(result);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

module.exports = {
  list: list,
  get: get,
  create: create,
  update: update,
  destroy: destroy
};
