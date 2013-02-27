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

// classic webapp with express
app.get('/express/list', routes.express.list);
app.get('/express/show', routes.express.show);
app.get('/express/new', routes.express.newForm);
app.get('/express/edit', routes.express.editForm);
app.post('/express/save', routes.express.save);
app.get('/express/delete', routes.express.destroy);
app.post('/express/save_comment', routes.express.save_comment);
app.get('/express/delete_comment', routes.express.destroy_comment);
app.get('/express/', routes.express.list);

// restful api
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
  console.log("BlueBerrySeason server listening on " + config.express.host + ":" + config.express.port);
});
