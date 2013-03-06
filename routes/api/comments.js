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
  console.log('*** load comment ' + id);
  bbs.comments.load(id)
    .then(function (result) {
      fn(null, result);
    })
    .fail(function (err) {
      fn(err);
    })
    .done();
}

function index(req, res) {
  var postId = req.params.post;
  jsonResponse(res, bbs.getCommentsByPost(postId));
}

function show(req, res) {
  //var postId = req.param.post;
  var commentId = req.params.comment;
  jsonResponse(res, bbs.comments.load(commentId));
}

function create(req, res) {
  var postId = req.params.post;
  var comment = bbs.comments.createNew(req.body);
  comment.postId = postId;
  jsonResponse(res, bbs.comments.save(comment, true));
}

function update(req, res) {
  var postId = req.params.post;
  var commentId = req.params.comment;
  jsonResponse(res, bbs.comments.load(commentId).then(function (comment) {
    comment = _.defaults(req.body, comment);
    comment.postId = postId;
    return bbs.comments.save(comment, true);
  }));
}

function destroy(req, res) {
  //var postId = req.params.post;
  var commentId = req.params.comment;
  jsonResponse(res, bbs.comments.destroy(commentId));
}

module.exports = {
  load: load,
  index: index,
  show: show,
  create: create,
  update: update,
  destroy: destroy
};
