var module = root.namespace("common.analytics.chartbeat", {

  Config: root.Config.extend({
    defaults : {
      chartbeat: {
        config: "_sf_async_config",
        endpoint: "_sf_endpt"
      },
      dictionary : {
        parent: "No parent view was supplied at instantiation",
        viewErrorMessage: "Error: bloomberg.common.analytics.chartbeat.View must be instantiated as follows: " +
          "\n\t new bloomberg.common.analytics.chartbeat.View({ domain: \"mydomain\", uid: 1337})"
      },
    }
  }),

  Model: root.Model.extend({
    defaults: {
      domain: null,
      previousUrl: null,
      uid: null,
    },

  }),

  View: root.View.extend({

    attributes : {
      async: true,
      class: "bloomberg common analytics chartbeat",
      language: "javascript",
      src: "http://static.chartbeat.com/js/chartbeat.js",
      type: "text/javascript"
    },

    events: {},

    id : null,

    tagName: "script",

    configureOptions: function(options) {
      options = options || {};
      var chartbeatConfig = window[this.config.get("chartbeat").config];

      if (chartbeatConfig) {
        chartbeatConfig.authors = options.authorName;
        chartbeatConfig.sections = options.sectionName;
      }
    },

    isANewPage: function(currentUrl) {
      var previousUrl = this.model.get("previousUrl");
      return previousUrl && currentUrl !== previousUrl;
    },

    main: function (options) {
      var config = this.config;
      var dictionary = config.get("dictionary");
      var model = this.model;

      options = options || {};
      _.extend(this, options);

      if (!options.domain || !options.uid) {
        throw new Error(dictionary.viewErrorMessage);
      }

      model.set({
        domain: options.domain,
        uid: options.uid
      });

      var chartbeatConfig = config.get("chartbeat").config;
      window[chartbeatConfig] = {
        uid: model.get("uid"),
        domain: model.get("domain")
      };

      if (this.parent) {
        _.bindAll(this, "render");
        _.bindAll(this, [
          "configureOptions",
          "isANewPage",
          "render",
          "refresh",
          "reset"
        ]);
      }
      else {
        console.warn(dictionary.parent);
      }

      config = null;
      dictionary = null;
    },

    refresh: function(options) {
      var currentUrl;
      var currentPath;
      var currentTitle;
      if (typeof window !== "undefined" && window.pSUPERFLY) {
        this.configureOptions(options);

        currentUrl = window.location.href;
        currentPath = window.location.pathname;
        currentTitle = window.document.title;

        // Do not refresh if on the same page.
        if (this.isANewPage(currentUrl)) {
          window.pSUPERFLY.virtualPage(currentPath, currentTitle);
        }

        this.model.set("previousUrl", currentUrl);
      }
    },

    render: function (options) {
      var endpoint = this.config.get("chartbeat").endpoint;
      window[endpoint] = (new Date()).getTime();

      return this;
    },

    reset: function() {
      var chartbeatConfig = this.config.get("chartbeat").config;
      window[chartbeatConfig] = {};
    }

  })
});
