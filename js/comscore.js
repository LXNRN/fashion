var DocCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
};

var Comscore = function(config) {
  var docCookies = DocCookies;
  var comscore_account = '3005059';
  var escape_str = window.encodeURIComponent !== undefined ? window.encodeURIComponent : window.escape;
  var unescape_str = window.decodeURIComponent !== undefined ? window.decodeURIComponent : window.unescape;
  var uid_cookie_name = 'bdfpc';
  var cookie_domain = window.location.hostname;
  var internal_link_key = 'comScore';
  //Ex. "bloomberg"
  var ns_site = config.site;




  var pageTrackingVars = {
    bb_content_cc: 0,
    bb_author: config.author,
    bb_attributor: config.attributor,
    bb_c_type: config.ctype,
    bb_cg_1: config.cg1 || '',
    bb_cg_2: config.cg2 || '',
    bb_cg_3: config.cg3 || '',
    c7: window.document.URL,
    c8: window.document.title,
    c9: config.referrer || '',
    //ex "blp.visual-data:billionaires-mobile"
    bb_name: config.name
  };

  function comScore(t) {
    var b = 'comScore', o = document, f = o.location, a = '', g = 2048, s, k, p, h, r = 'characterSet', n = 'defaultCharset', m = (window.encodeURIComponent !== undefined ? window.encodeURIComponent : window.escape);
    if (o.cookie.indexOf(b + '=') !== -1) {
      p = o.cookie.split(';');
      for (h = 0, f = p.length; h < f; h++) {
        var q = p[h].indexOf(b + '=');
        if (q !== -1) {
          a = '&' + window.unescape(p[h].substring(q + b.length + 1));
        }
      }
    }
    t = t + '&ns__t=' + (new Date().getTime());
    t = t + '&ns_c=' + (o[r] || (o[n] || '')) + '&c8=' + m(o.title) + a + '&c7=' + m(f && f.href ? f.href : o.URL) + '&c9=' + m(o.referrer);
    if (t.length > g && t.indexOf('&') > 0) {
      s = t.substr(0, g - 8).lastIndexOf('&');
      t = (t.substring(0, s) + '&ns_cut=' + m(t.substring(s + 1))).substr(0, g);
    }
    if (o.images) {
      k = new Image();
      if (window.ns_p === undefined) {
        ns_p = k;
      }
      k.src = t;
    } else {
      o.write(['<', 'p', '><', 'img src="', t, '" height="1" width="1" alt="*"', '><', '/p', '>'].join(''));
    }
  }


  function get_var_val(var_name) {
    return eval('(typeof(' + var_name + ")!=='undefined') ? " + var_name + " : ''");
  }

  function collect() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
  }


  function param_2_tracking_url(params) {
    var default_params = {
      'bb_userid': docCookies.getItem(uid_cookie_name),
      'bb_bregid': unescape_str(docCookies.getItem('breg')).split(':')[0], //prop32
      'name': config.name,
      // 'name': get_var_val('Description').replace(/\//g, ':'),
      'bb_groupid': config.groupid || '', //prop6
      'bb_pub_d': config.pubDate,
      'bb_quick': '0',
      'ns_site': ns_site
    };

    default_params = collect(default_params, params)
    var param_url = '';
    var p;
    for (p in default_params) {
      if (default_params.hasOwnProperty(p)) {
        param_url += '&' + escape_str(p) + '=' + escape_str(default_params[p]);
      }
    }
    var ret_url = 'http' + (document.location.href.charAt(4) === 's' ? 's://sb' : '://b') + '.scorecardresearch.com/p?c1=2&c2=' + comscore_account;
    ret_url += param_url;
    return ret_url;
  }

  function generate_update_bdfpc() {
    var cookie_domain = window.location.hostname;
    var val = docCookies.getItem(uid_cookie_name);
    if (typeof(val) === 'undefined') {
      val = '001.' + String('0000000000' + Math.floor(Math.random() * 10000000000)).slice(-10) + '.' + Math.floor((new Date()).getTime() / 1000);
    }
    // set/refresh cookie value/expiry
    var yearFromNow = new Date();
    yearFromNow.setYear(yearFromNow.getFullYear() + 1);
    docCookies.setItem(uid_cookie_name, val, yearFromNow, '/', cookie_domain);

  }

  function escape_tracking_value(str) {
    return escape_str(str.trim().replace('=', '').replace('&', ''));
  }

  function clearTrackCookie() {
    docCookies.removeItem(internal_link_key, '/', cookie_domain);
  }

  var that = {

    track: function(params) {
      comScore(param_2_tracking_url(params));
      clearTrackCookie();
    },

    trackPageview: function() {
      // where do we get to include the URL?
      that.track(pageTrackingVars);
    },

    hiddenEventTrack: function(text, link_pos, link_type) {
      // comScore hidden events for on page event tracking
      clearTrackCookie();
      comScore('http' + (document.location.href.charAt(4) === 's' ? 's://sb' : '://b') + '.scorecardresearch.com/b?c1=2&c2=' + comscore_account + '&ns_site=bloomberg&ns_type=hidden&bb_linkpos=' + escape_tracking_value(link_pos) + '&bb_linkname=' + escape_tracking_value(text) + '&bb_linktype=' + escape_tracking_value(link_type));
    },

    internalLinkTrack: function(text, link_pos, link_type) {
      var val = 'bb_linkname=' + escape_tracking_value(text) + '&bb_linkpos=' + escape_tracking_value(link_pos) + '&bb_linktype=' + escape_tracking_value(link_type);
      docCookies.setItem(internal_link_key, val, null, '/', cookie_domain);
    }

  };

  generate_update_bdfpc();
  return that;
};