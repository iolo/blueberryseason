$(function () {

  ///////////////////////////////////////////////////////////////////

  var localStorage = new Backbone.LocalStorage("backbonepress-posts");
  var Post = Backbone.Model.extend({
    localStorage: localStorage,
    defaults: function () {
      return {
        type: 'post',
        status: 'publish',
        title: '',
        author: '',
        content: '',
        date: new Date(),
        comments: []
      };
    },


    initialize: function () {
      console.log('post.initialize', arguments);
    },

    submit: function () {
      console.log('post.submit', arguments);
    }
  });

  var Posts = Backbone.Collection.extend({
    model: Post,
    localStorage: localStorage,
  });

  ///////////////////////////////////////////////////////////////////

  var PostsView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postsTpl').html()),
    events: {
      'click #postNewBtn': 'postNew'
    },
    render: function () {
      //var posts = _.map(this.posts.models, function (m) { return m.attributes; });
      console.log('postsView.render', this.model);
      this.$el.html(this.template({'posts': this.model.toJSON()}));
      return this;
    },
    postNew: function () {
      new PostFormView({model: new Post()}).render();
      return false;
    }
  });

  var PostView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postTpl').html()),
    events: {
      'click #postEditBtn': 'postEdit',
      'click #postDeleteBtn': 'postDelete',
      'click #commentDeleteBtn': 'commentDelete',
      'click #commentSubmitBtn': 'commentSubmit'
    },
    render: function () {
      this.$el.html(this.template({'post': this.model.toJSON()}));
      return this;
    },
    postEdit: function () {
      new PostFormView({model: this.model}).render();
      return false;
    },
    postDelete: function () {
      if (confirm('are you sure to delete this post?')) {
        this.model.destroy({
          success: function () {
            console.log('destroy success', arguments);
            app.navigate('posts', {trigger: true});
          }
        });
      }
      return false;
    },
    commentDelete: function () {
      if (confirm('are you sure to delete this comment?')) {
      }
      return false;
    },
    commentSubmit: function () {
      return false;
    }
  });

  var PostFormView = Backbone.View.extend({
    el: $('#contents'),
    template: _.template($('#postFormTpl').html()),
    events: {
      'click #postSubmitBtn': 'submit'
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
        app.posts.create(this.model);
      } else {
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
      'posts/:id': 'postShow',
      '': 'postList'
    },

    initialize: function () {
      this.posts = new Posts();
    },

    postList: function () {
      console.log('---> postList', arguments);
      this.posts.fetch();
      new PostsView({model: this.posts}).render();
    },

    postShow: function (id) {
      console.log('---> postShow', arguments);
      var post = this.posts.get(id);
      new PostView({model: post}).render();
    }

  });

  ///////////////////////////////////////////////////////////////////

  var app = new App();
  Backbone.history.start();
});
