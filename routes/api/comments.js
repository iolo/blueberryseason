'use strict';

var
  _ = require('underscore'),
  commentDao = require('../../libs/comment_dao');

function callbackJsonResponse(res) {
  return function (err, result) {
    if (err) {
      return res.json({error: err});
    }
    return res.json(result);
  };
}

function list(req, res) {
  var postId = req.param('postId');
  commentDao.listByPost(postId, callbackJsonResponse(res));
}

function get(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');
  commentDao.load(commentId, callbackJsonResponse(res));
}

function create(req, res) {
  var postId = req.param('postId');
  var comment = commentDao.createNew(req.body);
  comment.postId = postId;
  commentDao.save(comment, function (err, numRows, insertId) {
    if (err) {
      return res.json({error: err});
    }
    console.log('comments create:', arguments);
    commentDao.load(insertId, callbackJsonResponse(res));
  });
}

function update(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');

  commentDao.load(commentId, function (err, comment) {
    if (err) {
      return res.json({error: err});
    }
    comment = _.defaults(req.body, comment);
    comment.postId = postId;
    commentDao.save(comment, function (err, numRows) {
      if (err) {
        return res.json({error: err});
      }
      console.log('comments update:', arguments);
      commentDao.load(commentId, callbackJsonResponse(res));
    });
  });
}

function destroy(req, res) {
  var postId = req.param('postId');
  var commentId = req.param('commentId');
  commentDao.destroy(commentId, callbackJsonResponse(res));
}

module.exports = {
  list: list,
  get: get,
  create: create,
  update: update,
  destroy: destroy
};
