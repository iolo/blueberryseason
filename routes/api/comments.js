'use strict';

var
  _ = require('underscore'),
  bbs = require('../../libs/bbs');

function list(req, res) {
  var postId = req.param('postId');
  bbs.getCommentsByPost(postId)
    .then(function (comments) {
      res.json(comments);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function get(req, res) {
  //var postId = req.param('postId');
  var commentId = req.param('commentId');
  bbs.comments.load(commentId)
    .then(function (comment) {
      res.json(comment);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function create(req, res) {
  var postId = req.param('postId');
  var comment = bbs.comments.createNew(req.body);
  comment.postId = postId;
  bbs.comments.save(comment, true)
    .then(function (comment) {
      res.json(comment);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function update(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');
  bbs.comments.load(commentId)
    .then(function (comment) {
      comment = _.defaults(req.body, comment);
      comment.postId = postId;
      return bbs.comments.save(comment, true);
    })
    .then(function (comment) {
      res.json(comment);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function destroy(req, res) {
  //var postId = req.param('postId');
  var commentId = req.param('commentId');
  bbs.comments.destroy(commentId)
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
