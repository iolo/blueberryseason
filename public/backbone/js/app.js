$(function () {

  var app = {};

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
    template: _.template($('#postListTpl').html()),
    initialize: function () {
      this.listenTo(this.model, 'sync', this.render);
      this.listenTo(this.model, 'reset', this.render);
    },
    render: function () {
      this.$el.html(this.template({'posts': this.model.toJSON()}));
      return this;
    }
  });

  var PostShowView = Backbone.View.extend({
    template: _.template($('#postShowTpl').html()),
    events: {
      'click #deletePostBtn': 'deletePost',
      'click .deleteCommentBtn': 'deleteComment',
      'submit #commentForm': 'submitComment'
    },
    initialize: function () {
      //this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.close);

      this.model.comments.fetch();
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
    },
    close: function () {
      //app.router.navigate('/posts', { trigger:true, replace:true });
      window.history.back();
    }
  });

  var PostFormView = Backbone.View.extend({
    //el: $('#contents'),
    template: _.template($('#postFormTpl').html()),
    events: {
      'click #submitPostBtn': 'submitPost'
    },
    initialize: function () {
      this.listenTo(this.model, 'sync', this.close);
    },
    render: function () {
      this.$el.html(this.template({post: this.model.toJSON()}));
      return this;
    },
    submitPost: function (evt) {
      evt.stopImmediatePropagation();
      // this will fire 'change' and 'sync'
      this.model.save({
        title: $('#postTitleText').val(),
        content: $('#postContentText').val(),
        author: $('#postAuthorText').val()
      }, { wait: true});
      return false;
    },
    close: function () {
      //app.router.navigate('/posts/' + this.model.get('id'), { trigger:true, replace:true });
      window.history.back();
    }
  });

///////////////////////////////////////////////////////////////////

  var Router = Backbone.Router.extend({
    routes: {
      'posts': 'postList',
      'posts/new': 'postNew',
      'posts/:id': 'postShow',
      'posts/:id/edit': 'postEdit',
      '': 'postList'
    },

    initialize: function () {
      app.posts = new Posts();
      app.posts.fetch();
    },

    postList: function () {
      if (this.postListView) {
        this.postListView.remove();
      }
      app.posts.fetch({
        success: function () {
          this.postListView = new PostListView({model: app.posts});
          $('#contents').html(this.postListView.render().el);
        }
      });
    },

    postShow: function (id) {
      if (this.postShowView) {
        this.postShowView.remove();
      }
      app.posts.fetch({
        success: function () {
          var post = app.posts.get(id);
          this.postShowView = new PostShowView({model: post});
          $('#contents').html(this.postShowView.render().el);
        }
      });
    },

    postNew: function () {
      if (this.postFormView) {
        this.postFormView.remove();
      }
      app.posts.fetch({
        success: function () {
          var post = new Post();
          this.postFormView = new PostFormView({model: post});
          $('#contents').html(this.postFormView.render().el);
        }
      });
    },

    postEdit: function (id) {
      if (this.postFormView) {
        this.postFormView.remove();
      }
      app.posts.fetch({
        success: function () {
          var post = app.posts.get(id);
          this.postFormView = new PostFormView({model: post});
          $('#contents').html(this.postFormView.render().el);
        }
      });
    }
  });

  ///////////////////////////////////////////////////////////////////

  app.posts = new Posts();
  app.router = new Router();
  Backbone.history.start();
});
