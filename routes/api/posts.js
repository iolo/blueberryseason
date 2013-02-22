'use strict';

var
  _ = require('underscore'),
  noboard = require('../../libs/noboard');

function list(req, res) {
  noboard.getPostsWithCommentsCount()
    .then(function (posts) {
      res.json(posts);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function get(req, res) {
  var postId = req.param('postId');
  noboard.posts.load(postId)
    .then(function (post) {
      res.json(post);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function create(req, res) {
  var post = noboard.posts.createNew(req.body);
  noboard.posts.save(post, true)
    .then(function (post) {
      res.json(post);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function update(req, res) {
  var postId = req.param('postId');
  noboard.posts.load(postId)
    .then(function (post) {
      post = _.defaults(req.body, post);
      console.log('update post', post);
      return noboard.posts.save(post, true);
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
  noboard.posts.destroy(postId)
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
