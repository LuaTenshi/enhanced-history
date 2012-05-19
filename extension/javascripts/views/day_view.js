// Generated by CoffeeScript 1.3.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BH.Views.DayView = (function(_super) {

    __extends(DayView, _super);

    DayView.name = 'DayView';

    function DayView() {
      return DayView.__super__.constructor.apply(this, arguments);
    }

    DayView.prototype.className = 'day_view';

    DayView.prototype.templateId = 'day';

    DayView.prototype.events = {
      'click .delete_all': 'clickedDeleteAll',
      'keyup .search': 'filtered'
    };

    DayView.prototype.initialize = function(config) {
      this.attachGeneralEvents();
      return this.model.on('change', this.renderHistory, this);
    };

    DayView.prototype.render = function(type) {
      this.$el.html(this.template(_.extend(i18n.day(), this.model.toTemplate())));
      this.$('.content').css({
        opacity: 0
      }).html('');
      this.$('button').attr('disabled', 'disabled');
      return this;
    };

    DayView.prototype.renderHistory = function() {
      var contentElement, offset;
      this.collection = this.model.get('history');
      this.$('.search').focus();
      contentElement = this.$('.content');
      $(contentElement).css({
        opacity: 0
      }).html('');
      this.collection.each(function(model) {
        return $(contentElement).append(new BH.Views.TimeVisitView({
          model: model,
          collection: model.get('pageVisits')
        }).render().el);
      });
      if (this.collection.length === 0) {
        $(contentElement).append(Mustache.render($('#noVisits').html(), i18n.day())).css({
          opacity: 1
        });
        this.$('button').attr('disabled', 'disabled');
        $(document).scrollTop(0);
        if (this.model.get('filter')) {
          return this.$('.content').append('<a href="3">Maybe try searching full history?</a>');
        }
      } else {
        if (this.startTime) {
          offset = $("[data-time='" + this.startTime + "']").offset();
          $('body').scrollTop((offset ? offset.top : 0) - 104);
        }
        $(contentElement).css({
          opacity: 1
        });
        $('.time_visit_view').stickyElements({
          stickyClass: 'time_interval',
          padding: 104
        }, function(element) {
          return self.updateRoute(element);
        });
        Helpers.tabIndex($('.content a', this.el));
        this.$('button').attr('disabled', null);
        $('.spacer').remove();
        this.$el.append('<div class="spacer" />');
        return this.$('.spacer').height($(window).height() - this.$('.time_visit_view:last-child').height() - 210);
      }
    };

    DayView.prototype.clickedDeleteAll = function(ev) {
      if ($(ev.target).parent().attr('disabled') !== 'disabled') {
        ev.preventDefault();
        this.promptView = CreatePrompt(chrome.i18n.getMessage('confirm_delete_all_visits', [this.model.get('extendedFormalDate')]));
        this.promptView.open();
        return this.promptView.model.on('change', this.deleteAction, this);
      }
    };

    DayView.prototype.deleteAction = function(prompt) {
      if (prompt.get('action')) {
        if (this.collection) {
          this.promptView.spin();
          this.model.clear();
          return this.promptView.close();
        }
      } else {
        return this.promptView.close();
      }
    };

    DayView.prototype.filtered = function(ev) {
      return this.model.set({
        filter: $(ev.currentTarget).val()
      });
    };

    return DayView;

  })(BH.Views.Modal);

}).call(this);
