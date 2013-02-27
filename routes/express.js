'use strict';

var
  _ = require('underscore'),
  bbs = require('../libs/bbs');

function list(req, res) {
  bbs.getPostsWithCommentsCount()
    .then(function (posts) {
      res.render('express/list', {result: posts});
    })
    .fail(function (err) {
      res.render('error', {error: err});

    });
}

function show(req, res) {
  var postId = req.param('postId');
  bbs.posts.load(postId)
    .then(function (post) {
      return [post, bbs.getCommentsByPost(postId)];
    })
    .spread(function (post, comments) {
      res.render('express/show', { post: post, comments: comments });
    })
    .fail(function (err) {
      return res.render('error', {error: err});
    });
}

function newForm(req, res) {
  var post = bbs.posts.createNew();
  res.render('express/form', {result: post});
}

function editForm(req, res) {
  var postId = req.param('postId');
  bbs.posts.load(postId)
    .then(function (post) {
      res.render('express/form', {result: post});
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function save(req, res) {
  var post = _.defaults(req.body, bbs.posts.createNew());
  bbs.posts.save(post)
    .then(function () {
      res.redirect('/express/list');
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function destroy(req, res) {
  var postId = req.param('postId');
  bbs.posts.destroy(postId)
    .then(function () {
      res.redirect('/express/list');
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function save_comment(req, res) {
  var comment = _.defaults(req.body, bbs.comments.createNew());
  bbs.comments.save(comment)
    .then(function () {
      res.redirect('/express/show?postId=' + comment.postId);
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function destroy_comment(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');
  bbs.comments.destroy(commentId)
    .then(function () {
      res.redirect('/express/show?postId=' + postId);
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

module.exports = {
  list: list,
  show: show,
  newForm: newForm,
  editForm: editForm,
  save: save,
  destroy: destroy,
  save_comment: save_comment,
  destroy_comment: destroy_comment
};
