'use strict';

var
  _ = require('underscore'),
  postDao = require('../libs/post_dao'),
  commentDao = require('../libs/comment_dao');

function callbackForJadeResponse(res, view) {
  return function (err, result) {
    if (err) {
      return res.render('error', {error: err});
    }
    return res.render(view, {result: result});
  };
}

function callbackForRedirect(res, to) {
  return function (err, result) {
    if (err) {
      return res.render('error', {error: err});
    }
    return res.redirect(to);
  };
}

function list(req, res) {
  postDao.listWithCommentsCount(callbackForJadeResponse(res, 'posts/list'));
}

function show(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, function (err, post) {
    if (err) {
      return res.render('error', {error: err});
    }
    commentDao.listByPost(postId, function(err, comments) {
      if (err) {
        return res.render('error', {error: err});
      }
      return res.render('posts/show', { post: post, comments: comments });
    });
  });
}

function newForm(req, res) {
  var post = postDao.createNew();
  res.render('posts/form', {result: post});
}

function editForm(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, callbackForJadeResponse(res, 'posts/form'));
}

function save(req, res) {
  var post = _.defaults(req.body, postDao.createNew());
  postDao.save(post, callbackForRedirect(res, '/posts'));
}

function destroy(req, res) {
  var postId = req.param('postId');
  postDao.destroy(postId, callbackForRedirect(res, '/posts'));
}

function save_comment(req, res) {
  var comment = _.defaults(req.body, commentDao.createNew());
  commentDao.save(comment, callbackForRedirect(res, '/posts/show?postId=' + comment.postId));
}

function destroy_comment(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');
  commentDao.destroy(commentId, callbackForRedirect(res, '/posts/show?postId=' + postId));
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
