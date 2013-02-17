'use strict';

var config = require('./config'),
  noredis = require('noredis'),
  nobatis = require('nobatis'),
  dataSource = nobatis.createDataSource(config.nobatis),
  express = require('express'),
  http = require('http'),
  path = require('path'),
  routes = require('./routes'),
  app = express();

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/posts', routes.posts.list);
app.get('/posts/show', routes.posts.show);
app.get('/posts/new', routes.posts.newForm);
app.get('/posts/edit', routes.posts.editForm);
app.post('/posts/save', routes.posts.save);
app.get('/posts/delete', routes.posts.destroy);
app.post('/posts/save_comment', routes.posts.save_comment);
app.get('/posts/delete_comment', routes.posts.destroy_comment);

app.get('/api/1/posts', routes.api.posts.list);
app.post('/api/1/posts', routes.api.posts.create);
app.get('/api/1/posts/:postId', routes.api.posts.get);
app.put('/api/1/posts/:postId', routes.api.posts.update);
app.del('/api/1/posts/:postId', routes.api.posts.destroy);
app.get('/api/1/posts/:postId/comments', routes.api.comments.list);
app.post('/api/1/posts/:postId/comments', routes.api.comments.create);
app.get('/api/1/posts/:postId/comments/:commentId', routes.api.comments.get);
app.put('/api/1/posts/:postId/comments/:commentId', routes.api.comments.update);
app.del('/api/1/posts/:postId/comments/:commentId', routes.api.comments.destroy);

http.createServer(app).listen(config.express.port, config.express.host, function () {
  console.log("NoBoard server listening on " + config.express.host + ":" + config.express.port);
});
