'use strict';

var
  _ = require('underscore'),
  postDao = require('nobatis').createDao({
    table: 'posts',
    defaults: {
      id: 0,
      created: new Date(),
      updated: new Date(),
      author: '',
      title: '',
      content: ''
    }
  });

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
  postDao.all(callbackForJadeResponse(res, 'posts/list'));
}

function show(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, callbackForJadeResponse(res, 'posts/show'));
}

function newForm(req, res) {
  var post = postDao.createNew();
  console.log('new isNew:', postDao.isNew(post));
  console.log('new:', post);
  res.render('posts/form', {result: post});
}

function editForm(req, res) {
  var postId = req.param('postId');
  postDao.load(postId, callbackForJadeResponse(res, 'posts/form'));
}

function save(req, res) {
  var post = _.defaults(req.body, postDao.createNew());
  if (post.id === '0') {
    post.id = 0;
  }
  console.log('save isNew:', postDao.isNew(post));
  console.log('save:', post);
  postDao.save(post, callbackForRedirect(res, '/posts'));
}

function destroy(req, res) {
  var postId = req.param('postId');
  postDao.destroy(postId, callbackForRedirect(res, '/posts'));
}

module.exports = {
  list: list,
  show: show,
  newForm: newForm,
  editForm: editForm,
  save: save,
  destroy: destroy
};
