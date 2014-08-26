var chartBeatModule;

$(document).ready(function() {

  var comscoreConfig = {
    site: "businessweek",
    author: "Firstname Lastname",
    ctype: "graphic",
    cg1: "Lifestyle",
    name: "This is a title",
    pubDate: "20140825"
  }

  var urlHash = window.location.hash

  var comscore = Comscore(comscoreConfig)
  comscore.track(urlHash)
  comscore.trackPageview()

  var _sf_async_config= {uid: 15087, domain: "www.businessweek.com"};
  _sf_async_config.useCanonical = true;

  _sf_async_config.sections = "Lifestyle";
  _sf_async_config.authors = "Firstname Lastname";


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


  $('.popup-twitter').click(function(event) {
    event.preventDefault()
    var textString = "This string gets tweeted with the link."
    var text = encodeURIComponent(textString)
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = $(this).attr('href') + text + "&url=" + document.URL,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

    window.open(url, 'twitter', opts);

    return false;
  });

  $('.popup-linkedin').click(function(event) {
    event.preventDefault()
    var textString = "This string gets posted with the link."
    var text = encodeURIComponent(textString)
    var width  = 550,
        height = 420,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        articleUrl = encodeURIComponent("http://businessweek.com"),
        // url    = $(this).attr('href') + text + "&url=" + articleUrl
        url = "http://www.linkedin.com/shareArticle?summary=I+just+took+Businessweek%27s+Can+Women+Ever+Get+Ahead+at+Work+quiz%2C+and+you+should+too%2E&title=Can+a+Woman+Ever+Win+at+Work%3F&mini=true&url=" + encodeURIComponent(document.URL)
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

                 console.log(url)

    window.open(url, 'linkedin', opts);

    return false;
  });

    $('.popup-facebook').click(function(event) {
    event.preventDefault()
    var textString = "This string gets posted with the link."
    var text = encodeURIComponent(textString)
    var width  = 550,
        height = 420,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        articleUrl = encodeURIComponent(document.URL),
        url    = $(this).attr('href') + articleUrl
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

        console.log(url)

    window.open(url, 'facebook', opts);

    return false;
  });


    var navigation = responsiveNav(".nav-collapse", {
      animate: true,                    // Boolean: Use CSS3 transitions, true or false
      transition: 284,                  // Integer: Speed of the transition, in milliseconds
      label: "",                    // String: Label for the navigation toggle
      insert: "after",                  // String: Insert the toggle before or after the navigation
      customToggle: "",                 // Selector: Specify the ID of a custom toggle
      closeOnNavClick: false,           // Boolean: Close the navigation when one of the links are clicked
      openPos: "relative",              // String: Position of the opened nav, relative or static
      navClass: "nav-collapse",         // String: Default CSS class. If changed, you need to edit the CSS too!
      navActiveClass: "js-nav-active",  // String: Class that is added to <html> element when nav is active
      jsClass: "js",                    // String: 'JS enabled' class which is added to <html> element
      init: function(){},               // Function: Init callback
      open: function(){},               // Function: Open callback
      close: function(){}               // Function: Close callback
    });
  // https://www.facebook.com/sharer/sharer.php?u=http://example.com?share=1&cup=blue&bowl=red&spoon=green

  // http://www.linkedin.com/shareArticle?mini=true&url={articleUrl}&title={articleTitle}&summary={articleSummary}&source={articleSource}
  // http://www.linkedin.com/shareArticle?mini=true&url=http%3A//developer.linkedin.com&title=LinkedIn%20Developer%20Network&summary=My%20favorite%20developer%20program&source=LinkedIn

  // if(window.innerWidth < 895) {
  //   $('#bloomberg').attr('src', 'img/bloomberg-single.png')
  // }
})
