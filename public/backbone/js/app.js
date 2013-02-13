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
    },
    render: function () {
      console.log('postListView.render', this.model);
      this.$el.html(this.template({'posts': this.model.toJSON()}));
      return this;
    }
  });

  var PostShowView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postShowTpl').html()),
    events: {
      'click #postDeleteBtn': 'postDelete'
    },
    initialize: function () {
    },
    render: function () {
      console.log('postShowView.render', this.model);
      this.$el.html(this.template({'post': this.model.toJSON()}));
      return this;
    },
    postDelete: function (evt) {
      evt.preventDefault();
      if (confirm('Are you sure to delete this post?')) {
        this.model.destroy({
          success: function () {
            console.log('postDelete destroy success', arguments);
            app.navigate('posts', {trigger: true, replace: true});
          }
        });
      }
      return false;
    }
  });

  var PostFormView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postFormTpl').html()),
    events: {
      'click #postSubmitBtn': 'submit'
    },
    initialize: function () {
    },
    render: function () {
      console.log('postFormView.render', this.model);
      this.$el.html(this.template({post: this.model.toJSON()}));
      return this;
    },
    submit: function () {
      console.log('postFormView.submit', arguments);
      this.model.set({
        title: $('#postTitleText').val(),
        content: $('#postContentText').val(),
        author: $('#postAuthorText').val()
      });
      this.model.save(null, {
        success: function () {
          console.log('submit ok!');
          app.navigate('posts', {trigger: true, replace: true});
        }
      });
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
      console.log('app.initialize:', this.posts);
    },

    postList: function () {
      console.log('---> postList', arguments);
      this.posts.fetch({
        success: function (posts) {
          var view = new PostListView({model: posts});
          view.render();
        }
      });
    },

    postShow: function (id) {
      console.log('---> postShow', arguments);
      this.posts.fetch({
        success: function (posts) {
          console.log('postShow fetch success', arguments);
          var post = posts.get(id);
          var view = new PostShowView({model: post});
          view.render();
        }
      })
    },

    postNew: function () {
      console.log('---> postNew', arguments);
      var post = new Post();
      var view = new PostFormView({model: post});
      view.render();
    },

    postEdit: function (id) {
      console.log('---> postEdit', arguments);
      this.posts.fetch({
        success: function (posts) {
          console.log('postEdit fetch success', arguments);
          var post = posts.get(id);
          var view = new PostFormView({model: post});
          view.render();
        }
      });
    }
  });

  ///////////////////////////////////////////////////////////////////

  var app = new App();
  Backbone.history.start();
});
