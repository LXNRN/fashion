// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// from http://stackoverflow.com/a/326076/120290
function inIframe() {
    try {
        return window.self !== window.top;
    } catch(err) {
        return true;
    }
}

// store query string in urlParams
// from http://stackoverflow.com/a/2880929/120290
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

// only return powers of 10; return blanks for anything else. (for log axis ticks.)
function bbwNumberFormatLog(dolla) {
    return (Math.round((Math.log(dolla) / Math.LN10) * 100) / 100) % 1 == 0 ? bbwNumberFormat(dolla) : "";
}

// adapted from d3.formatPrefix
function bbwNumberFormat(dolla) {
  var base = Math.max(1, Math.min(1e12, dolla));
  var scaler = bbwFormatPrefix(base);
  return parseFloat(scaler.scale(dolla).toPrecision(3))+scaler.symbol;
}
var bbw_formatPrefixes = [ "p", "n", "µ", "m", "", "k", "m", "b", "t" ].map(bbw_formatPrefix);
function bbwFormatPrefix(value, precision) {
  var i = 0;
  if (value) {
    if (value < 0) value *= -1;
    if (precision) value = d3.round(value, d3_format_precision(value, precision));
    i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
    i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));
  }
  return bbw_formatPrefixes[4 + i / 3];
};
function bbw_formatPrefix(d, i) {
  var k = Math.pow(10, Math.abs(4 - i) * 3);
  return {
    scale: i > 4 ? function(d) {
      return d / k;
    } : function(d) {
      return d * k;
    },
    symbol: d
  };
}

// Convert Excel dates into JS date objects
// @author https://gist.github.com/christopherscott/2782634
// @param excelDate {Number}
// @return {Date}
function getDateFromExcel(excelDate) {
  // 1. Subtract number of days between Jan 1, 1900 and Jan 1, 1970, plus 1 (Google "excel leap year bug")
  // 2. Convert to milliseconds.
  return new Date((excelDate - (25567 + 1))*86400*1000);
}

///////////////
// ANALYTICS //
///////////////

var chartBeatModule;
function analytics(meta) {
  var comscoreConfig = {
    site: meta.site, // e.g. "businessweek"
    author: meta.author, // e.g. "Claire Suddath"
    ctype: meta.type, // e.g. "graphic"
    cg1: meta.section, // e.g. "Lifestyle"
    name: meta.title, // e.g. "Can women ever win at work?"
    pubDate: meta.pubDate // e.g. "20140825"
  }

  var urlHash = window.location.hash

  var comscore = Comscore(comscoreConfig)
  comscore.track(urlHash)
  comscore.trackPageview()

  var _sf_async_config= {uid: 15087, domain: "www.businessweek.com"};
  _sf_async_config.useCanonical = true;

  _sf_async_config.sections = meta.section;
  _sf_async_config.authors = meta.author;


  (function(){
    function loadChartbeat() {
      window._sf_endpt=(new Date()).getTime();
      var e = document.createElement('script');
      e.setAttribute('language', 'javascript');
      e.setAttribute('type', 'text/javascript');
      e.setAttribute('src',
        (("https:" == document.location.protocol) ? "https://s3.amazonaws.com/" : "http://") + "static.chartbeat.com/js/chartbeat_pub.js");
      document.body.appendChild(e);
    }
    var oldonload = window.onload;
    window.onload = (typeof window.onload != 'function') ? loadChartbeat : function() { oldonload(); loadChartbeat(); };
  })();
}

/////////////
// SHARING //
/////////////

function shareFacebook(shareText) {
  event.preventDefault()
  var textString = shareText
  var text = encodeURIComponent(textString)
  var width  = 575,
      height = 400,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      url    = "http://www.facebook.com/sharer/sharer.php?u=" + text + "&url=" + document.URL,
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;

  window.open(url, 'twitter', opts);

  return false;
}

function shareTwitter(shareText) {
  event.preventDefault()
  var textString = shareText
  var text = encodeURIComponent(textString)
  var width  = 550,
      height = 420,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      articleUrl = encodeURIComponent(document.URL),
      url    = "http://twitter.com/share?text=" + text + "&url=" + articleUrl
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;

  window.open(url, 'linkedin', opts);

  return false;
}

function shareLinkedin(shareText) {
  event.preventDefault()
  var textString = shareText
  var text = encodeURIComponent(textString)
  var width  = 550,
      height = 420,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      articleUrl = encodeURIComponent(document.URL),
      url    = "http://www.linkedin.com/shareArticle?summary=" + articleUrl
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;

  window.open(url, 'facebook', opts);

  return false;
}

////////////////
// GOOGLE ADS //
////////////////

var ROOT_URL          = "http://www.businessweek.com/";
var DOUBLECLICK_URL_PREFIX = "http://ad.doubleclick.net/N5262";
var AD_SITE           = "mgh.bw.technology/global_tech_06052014";
var AD_LAYOUT_DESC    = "";
var AD_SUB_SITE       = "";
var AD_ZONE           = "";
var AD_URL            = (window.location.pathname == undefined) ? "/" : window.location.pathname.replace(/\/?$/, '/');
var AD_INTERVAL_TO    = 450;
var YIELDEX           = true;
var NEGATIVE_AD_CATEGORIES = "";
var URL_HASH          = "";
var RANDOM_NUMBER     = ("1"+(""+Math.random()).substring(2,11));
var AD_KEYWORD        = "";
var _BUCKET           = "";
var _BUCKET_GROUP     = "";

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [], function () {
  var a = document.createElement("script");
  a.async = !0, a.type = "text/javascript", a.src = ("https:" == document.location.protocol ? "https://" : "http://") + "www.googletagservices.com/tag/js/gpt.js";
  var b = document.getElementsByTagName("script")[0];
  b.parentNode.insertBefore(a, b), googletag.bw_loaded = !0
}();

/*
Copyright 2013 Michael Countis
MIT License: http://opensource.org/licenses/MIT
*/
if(window.innerWidth > 895) {
  !function(){"use strict";window.googletag=window.googletag||{},window.googletag.cmd=window.googletag.cmd||[],googletag.cmd.push(function(){if(!(googletag.hasOwnProperty("on")||googletag.hasOwnProperty("off")||googletag.hasOwnProperty("trigger")||googletag.hasOwnProperty("events"))){var a=googletag.debug_log.log,b=[],c=function(a,c,d){b.push({name:a,id:c,match:d})};c("gpt-google_js_loaded",8,/Google service JS loaded/gi),c("gpt-gpt_fetch",46,/Fetching GPT implementation/gi),c("gpt-gpt_fetched",48,/GPT implementation fetched\./gi),c("gpt-page_load_complete",1,/Page load complete/gi),c("gpt-queue_start",31,/^Invoked queued function/gi),c("gpt-service_add_slot",40,/Associated ([\w]*) service with slot ([\/\w]*)/gi),c("gpt-service_add_targeting",88,/Setting targeting attribute ([\w]*) with value ([\w\W]*) for service ([\w]*)/gi),c("gpt-service_collapse_containers_enable",78,/Enabling collapsing of containers when there is no ad content/gi),c("gpt-service_create",35,/Created service: ([\w]*)/gi),c("gpt-service_single_request_mode_enable",63,/Using single request mode to fetch ads/gi),c("gpt-slot_create",2,/Created slot: ([\/\w]*)/gi),c("gpt-slot_add_targeting",17,/Setting targeting attribute ([\w]*) with value ([\w\W]*) for slot ([\/\w]*)/gi),c("gpt-slot_fill",50,/Calling fillslot/gi),c("gpt-slot_fetch",3,/Fetching ad for slot ([\/\w]*)/gi),c("gpt-slot_receiving",4,/Receiving ad for slot ([\/\w]*)/gi),c("gpt-slot_render_delay",53,/Delaying rendering of ad slot ([\/\w]*) pending loading of the GPT implementation/gi),c("gpt-slot_rendering",5,/^Rendering ad for slot ([\/\w]*)/gi),c("gpt-slot_rendered",6,/Completed rendering ad for slot ([\/\w]*)/gi),googletag.events=googletag.events||{},googletag.on=function(a,b,c){if(!b)return this;a=a.split(" ");var d=c?b:void 0,e=c||b,f=0,g="";for(e.data=d,g=a[f=0];f<a.length;g=a[++f])(this.events[g]=this.events[g]||[]).push(e);return this},googletag.off=function(a,b){a=a.split(" ");var c=0,d="",e=0,f=function(){};for(d=a[c];c<a.length;d=a[++c])if(this.events.hasOwnProperty(d))if(b){for(e=this.events[d].length-1,f=this.events[d][e];e>=0;f=this.events[d][--e])f==b&&this.events[d].splice(e,1);0===this.events[d].length&&delete this.events[d]}else delete this.events[d];return this},googletag.trigger=function(a,b){if(!this.events[a]||0===this.events[a].length)return this;var b=b||[],c=0,d=this.events[a][c];for(d;c<this.events[a].length&&d.apply(this,[{data:d.data}].concat(b))!==!1;d=this.events[a][++c]);return this},googletag.debug_log.log=function(c,d){if(d&&d.getMessageId&&"number"==typeof d.getMessageId()){var h=Array.prototype.slice.call(arguments),i=0;for(i;i<b.length;i++)b[i].id===d.getMessageId()&&googletag.trigger(b[i].name,h)}return a.apply(this,arguments)}}})}();
}

if(window.innerWidth > 895) {
  googletag.cmd.push(function() {
    googletag.defineSlot('/5262/mgh.bw.technology/global_tech_06052014', [[728, 90], [970, 66], [1, 1]], 'top').addService(googletag.pubads());
    googletag.defineSlot('/5262/mgh.bw.technology/global_tech_06052014', [[300, 250], [300, 600], [1, 1]], 'right1').addService(googletag.pubads());
    googletag.defineSlot('/5262/mgh.bw.technology/global_tech_06052014', [[300, 250], [1, 1]], 'right3').addService(googletag.pubads());
    //googletag.pubads().collapseEmptyDivs();
    googletag.pubads().enableAsyncRendering();
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
  });
  var global_ad_options = {
    url: window.location.pathname,
    krux_host: encodeURIComponent(location.hostname),
    krux_uid: (Krux.user == undefined) ? "" : Krux.user,
    krux_segments: (Krux.segments == undefined) ? "" : Krux.segments,
    keyword: ((AD_KEYWORD == "") ? "" : AD_KEYWORD),
    negative_ad_categories: (NEGATIVE_AD_CATEGORIES == "") ? [] : NEGATIVE_AD_CATEGORIES.split(",")
  };

  function displayAds() {
    googletag.cmd.push(function() {
      var ad_containers = document.getElementsByClassName("gpt_ad_container");
      for (var i = 0; i < ad_containers.length; i++) {
        var ac = ad_containers[i];
        var ad_attributes = {
          position: ac.getAttribute('data-position'),
          size_array: ac.getAttribute('data-gpt-size'),
          ad_size: ac.getAttribute('data-size'),
          tile: ac.getAttribute('data-tile'),
          ist: ac.getAttribute('data-tile') == "1" ? "dcopt=ist;" : "",
          pt: ac.getAttribute('data-position'),
          tz: ac.getAttribute('data-tz'),
          yield_ex_string: (YIELDEX ? (ac.getAttribute('data-size') + "|" +
            ac.getAttribute('data-position') + "|" + ac.getAttribute(
              'data-tz') + "|" + global_ad_options.keyword) : "")
        };
        googletag.on && googletag.on('gpt-slot_rendered', function(e, level,
          message, service, slot, reference) {
          var $iframe;
          var body_content;
          var found_ad_response = false;

          var slotId = slot.getSlotId();
          var $slot = document.getElementById(slotId.getDomId());
          var iframes = $slot.getElementsByTagName("iframe");
          for (var i = 0; i < iframes.length; i++) {
            if (!iframes[i].getAttribute('id').match(/hidden/)) {
              $iframe = iframes[i];
              break;
            }
          }
          var $iframe_doc = $iframe.contentWindow.document;
          var $iframe_content = $iframe_doc.getElementsByTagName("body");
          if ($iframe_content.length > 0) {
            body_content = $iframe_content[0].innerHTML || '';
            found_ad_response = (body_content.replace(/^\s+|\s+$/g, '') !=
              '');
          }
          if (found_ad_response) {
            $slot.parentNode.setAttribute('style', 'height:' + $iframe.getAttribute(
              'height') + 'px');
            $slot.setAttribute('style', 'height:' + $iframe.getAttribute(
              'height') + 'px');
            $iframe.setAttribute('style', 'height:' + $iframe.getAttribute(
              'height') + 'px');
            $iframe.parentNode.setAttribute('style', 'height:' + $iframe.getAttribute(
              'height') + 'px');
          }

        });
        googletag.cmd.push(function() {
          googletag.display(ad_attributes.position);
        });
      }
    });
  }
  var d=window;d.attachEvent?d.attachEvent("onload",displayAds):d.addEventListener&&d.addEventListener("load",displayAds,!1);
}
