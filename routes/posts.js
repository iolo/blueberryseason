'use strict';

var
  _ = require('underscore'),
  noboard = require('../libs/noboard');

function list(req, res) {
  noboard.getPostsWithCommentsCount()
    .then(function (posts) {
      res.render('posts/list', {result: posts});
    })
    .fail(function (err) {
      res.render('error', {error: err});

    });
}

function show(req, res) {
  var postId = req.param('postId');
  noboard.posts.load(postId)
    .then(function (post) {
      return [post, noboard.getCommentsByPost(postId)];
    })
    .spread(function (post, comments) {
      res.render('posts/show', { post: post, comments: comments });
    })
    .fail(function (err) {
      return res.render('error', {error: err});
    });
}

function newForm(req, res) {
  var post = noboard.posts.createNew();
  res.render('posts/form', {result: post});
}

function editForm(req, res) {
  var postId = req.param('postId');
  noboard.posts.load(postId)
    .then(function (post) {
      res.render('posts/form', {result: post});
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function save(req, res) {
  var post = _.defaults(req.body, noboard.posts.createNew());
  noboard.posts.save(post)
    .then(function () {
      res.redirect('/posts');
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function destroy(req, res) {
  var postId = req.param('postId');
  noboard.posts.destroy(postId)
    .then(function () {
      res.redirect('/posts');
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function save_comment(req, res) {
  var comment = _.defaults(req.body, noboard.comments.createNew());
  noboard.comments.save(comment)
    .then(function () {
      res.redirect('/posts/show?postId=' + comment.postId);
    })
    .fail(function (err) {
      res.render('error', {error: err});
    });
}

function destroy_comment(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');
  noboard.comments.destroy(commentId)
    .then(function () {
      res.redirect('/posts/show?postId=' + postId);
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
