// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  __extends(BH.Views.VersionView, BH.Views.Modal({
    className: 'version_view',
    templateId: 'version',
    events: {
      'click .close': 'closeClicked'
    },
    initialize: function() {
      return this.attachGeneralEvents();
    },
    render: function() {
      this.$el.html(this.template(this.model.toTemplate()));
      return this;
    },
    closeClicked: function(ev) {
      ev.preventDefault();
      this.model.setSuppress(true);
      this.close();
      return BH.router.navigate('#settings');
    },
    openClicked: function(ev) {
      ev.preventDefault();
      return this.open();
    }
  }));

}).call(this);
