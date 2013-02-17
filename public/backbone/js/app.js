$(function () {

  ///////////////////////////////////////////////////////////////////

  var Comment = Backbone.Model.extend({
    urlRoot: function () {
      return '/api/1/posts/' + this.get('postId') + '/comments';
    },
    defaults: function () {
      return {
        id: null,
        created: new Date(),
        modified: new Date(),
        author: '',
        content: '',
        postId: null
      };
    }
  });

  var Comments = Backbone.Collection.extend({
    // url: dynamic
    model: Comment
  });

  var Post = Backbone.Model.extend({
    urlRoot: '/api/1/posts',
    defaults: function () {
      return {
        id: null,
        created: new Date(),
        modified: new Date(),
        title: '',
        author: '',
        content: ''
      };
    },
    initialize: function () {
      this.comments = new Comments();
      this.comments.url = '/api/1/posts/' + this.id + '/comments';
    }
  });

  var Posts = Backbone.Collection.extend({
    url: '/api/1/posts',
    model: Post
  });

  ///////////////////////////////////////////////////////////////////

  var PostListView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postListTpl').html()),
    initialize: function () {
      this.listenTo(this.model, 'sync', this.render);
    },
    render: function () {
      this.$el.html(this.template({'posts': this.model.toJSON()}));
      return this;
    }
  });

  var PostShowView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postShowTpl').html()),
    events: {
      'click #deletePostBtn': 'deletePost',
      'click .deleteCommentBtn': 'deleteComment',
      'submit #commentForm': 'submitComment'
    },
    initialize: function () {
      this.render();
      this.model.comments.fetch();
      this.listenTo(this.model, 'all', function (e) {
        console.log('postshow model', e);
      });
      this.listenTo(this.model, 'destroy', function () {
        app.navigate('posts', {trigger: true, replace: true});
      });
      this.listenTo(this.model.comments, 'all', function (e) {
        console.log('comments model', e);
      });
      this.listenTo(this.model.comments, 'destroy', function () {
        app.navigate('posts', {trigger: true, replace: true});
      });
      this.listenTo(this.model.comments, 'sync', this.render);
      this.listenTo(this.model.comments, 'destroy', this.render);
    },
    render: function () {
      this.$el.html(this.template({'post': this.model.toJSON(), 'comments': this.model.comments.toJSON(), 'comment': new Comment()}));
      return this;
    },
    deletePost: function (evt) {
      evt.stopImmediatePropagation();
      if (confirm('Are you sure to delete this post?')) {
        // this will fire 'remove' and 'destroy' event
        this.model.destroy();
      }
      return false;
    },
    deleteComment: function (evt) {
      evt.stopImmediatePropagation();
      if (confirm('Are you sure to delete this comment?')) {
        var commentId = $(evt.target).data('commentId');
        var comment = this.model.comments.get(commentId);
        // this will fire 'remove' and 'destroy' event
        comment.destroy();
      }
      return false;
    },
    submitComment: function (evt) {
      evt.stopImmediatePropagation();
      // this will fire 'add' and 'sync' event
      this.model.comments.create({
        content: $('#commentContentText').val(),
        author: $('#commentAuthorText').val(),
        postId: $('#commentPostIdText').val()
      });
      return false;
    }
  });

  var PostFormView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postFormTpl').html()),
    events: {
      'click #submitPostBtn': 'submitPost'
    },
    initialize: function () {
      console.log('postform init', arguments);
      this.listenTo(this.model, 'all', function (event) {
        console.log('postform model ', event);
      });
      this.listenTo(this.model, 'sync', function (event) {
        app.navigate('posts', {trigger: true, replace: true});
      });
      this.render();
    },
    render: function () {
      this.$el.html(this.template({post: this.model.toJSON()}));
      return this;
    },
    submitPost: function (evt) {
      evt.stopImmediatePropagation();
      console.log('postFormView.submit', arguments);
      var attrs = {
        title: $('#postTitleText').val(),
        content: $('#postContentText').val(),
        author: $('#postAuthorText').val()
      };
      console.log('new:', this.model.isNew(), 'id:', this.model.id);
      // this will fire 'change' and 'sync'
      this.model.save(attrs);
      return false;
    }
  });

///////////////////////////////////////////////////////////////////

  var App = Backbone.Router.extend({
    routes: {
      'posts': 'postList',
      'posts/new': 'postNew',
      'posts/:id': 'postShow',
      'posts/:id/edit': 'postEdit',
      '': 'postList'
    },

    initialize: function () {
      this.posts = new Posts();
      this.posts.fetch();
    },

    postList: function () {
      this.posts.fetch();
      new PostListView({model: this.posts});
    },

    postShow: function (id) {
      var post = this.posts.get(id);
      new PostShowView({model: post});
    },

    postNew: function () {
      var post = new Post();
      new PostFormView({model: post});
    },

    postEdit: function (id) {
      var post = this.posts.get(id);
      new PostFormView({model: post});
    }
  });

  ///////////////////////////////////////////////////////////////////

  var app = new App();
  Backbone.history.start();
});
