$(function () {

  ///////////////////////////////////////////////////////////////////

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
      this.model.bind('all', this.render, this);
    },
    render: function () {
      console.log('postsView.render', this.model, this.model.length);
      var posts = _.map(this.model.models, function (model) {
        return model.toJSON();
      });
      console.log('postsView.render', posts);
      this.$el.html(this.template({'posts': this.model.toJSON()}));
      return this;
    }
  });

  var PostShowView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postShowTpl').html()),
    initialize: function () {
      this.model.bind('all', this.render, this);
    },
    render: function () {
      this.$el.html(this.template({'post': this.model.toJSON()}));
      return this;
    }
  });

  var PostFormView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postFormTpl').html()),
    events: {
      'click #postSubmitBtn': 'submit'
    },
    initialize: function () {
      this.model.bind('all', this.render, this);
    },
    render: function () {
      this.$el.html(this.template({post: this.model.toJSON()}));
      return this;
    },
    submit: function () {
      console.log('submit!', arguments);
      this.model.set({
        title: $('#postTitleText').val(),
        content: $('#postContentText').val(),
        author: $('#postAuthorText').val()
      });
      if (this.model.isNew()) {
        console.log('submit model is new!');
        app.posts.create(this.model);
      } else {
        console.log('submit model is NOT new!');
        this.model.save();
      }
      app.navigate('posts', {trigger: true});
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
      'posts/:id/delete': 'postDelete',
      '': 'postList'
    },

    initialize: function () {
      this.posts = new Posts();
      this.posts.fetch();
      console.log('app.initialize:', this.posts);
    },

    postList: function () {
      console.log('---> postList', arguments);
      this.posts.fetch();
      var view = new PostListView({model: this.posts});
      view.render();
    },

    postShow: function (id) {
      console.log('---> postShow', arguments);
      var post = this.posts.get(id);
      var view = new PostShowView({model: post});
      view.render();
    },

    postNew: function () {
      var post = new Post();
      var view = new PostFormView({model: post});
      view.render();
    },

    postEdit: function (id) {
      var post = this.posts.get(id);
      var view = new PostFormView({model: post});
      view.render();
    },

    postDelete: function (id) {
      if (confirm('are you sure to delete this post?\n')) {
        this.posts.remove(id);
      }
      app.navigate('posts', {trigger: true});
    }

  });

  ///////////////////////////////////////////////////////////////////

  var app = new App();
  Backbone.history.start();
});
