'use strict';

var
  _ = require('underscore'),
  noboard = require('../../libs/noboard');

function list(req, res) {
  var postId = req.param('postId');
  noboard.getCommentsByPost(postId)
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
  noboard.comments.load(commentId)
    .then(function (comment) {
      res.json(comment);
    })
    .fail(function (err) {
      res.json({error: err});
    });
}

function create(req, res) {
  var postId = req.param('postId');
  var comment = noboard.comments.createNew(req.body);
  comment.postId = postId;
  noboard.comments.save(comment, true)
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
  noboard.comments.load(commentId)
    .then(function (comment) {
      comment = _.defaults(req.body, comment);
      comment.postId = postId;
      return noboard.comments.save(comment, true);
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
  noboard.comments.destroy(commentId)
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
