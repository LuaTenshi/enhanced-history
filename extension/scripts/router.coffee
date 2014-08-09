class BH.Router extends Backbone.Router
  routes:
    '': 'visits'
    'tags': 'tags'
    'tags/:id': 'tag'
    'devices': 'devices'
    'settings': 'settings'
    'search/*query(/p:page)': 'search'
    'search': 'search'
    'visits(/:date)': 'visits'
    'trails/new': 'newTrail'
    'trails/:name': 'trail'

  initialize: (options) ->
    settings = options.settings
    tracker = options.tracker

    @cache = new BH.Views.Cache
      settings: settings

    @trails = new Backbone.Collection()

    @app = new BH.Views.AppView
      el: $('.app')
      settings: settings
      trails: @trails
    @app.render()

    @on 'route', ->
      url = Backbone.history.getFragment()
      window.analyticsTracker.pageView url

  tags: ->
    view = @cache.view('tags')
    delay ->
      view.collection.fetch()

  devices: ->
    view = @cache.view('devices')
    delay -> view.collection.fetch()

  tag: (id) ->
    view = @cache.view('tag', [id])
    delay ->
      view.model.fetch()

  newTrail: ->
    view = @cache.view('newTrail')
    view.on 'build_trail', (model) =>
      @trails.add model

  trail: (name) ->
    view = @cache.view('trail')

  visits: (date = new Date()) ->
    # special cases
    date = switch date
      when 'today'
        moment(new Date())
      when 'yesterday'
        moment(new Date()).subtract('days', 1)
      else
        moment(date)

    date = date.startOf('day').toDate()

    view = @cache.view('visits', [date])

    delay ->
      new BH.Lib.VisitsHistory(date).fetch (history) ->
        view.collection.reset history

  settings: ->
    view = @cache.view('settings')

  search: (query, page) ->
    view = @cache.view('search')
    view.page.set(page: parseInt(page, 10), {silent: true}) if page?
    view.model.set query: decodeURIComponent(query)
    delay ->
      if query? && query != ''
        new BH.Lib.SearchHistory(query).fetch {}, (history, cacheDatetime = null) ->
          view.collection.reset history
          if cacheDatetime?
            view.model.set cacheDatetime: cacheDatetime
          else
            view.model.unset 'cacheDatetime'

delay = (callback) ->
  setTimeout (-> callback()), 250
