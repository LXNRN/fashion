var meta = {
  site: "businessweek", // e.g. "businessweek"
  author: "Dude", // e.g. "Claire Suddath"
  type: "graphic", // e.g. "graphic"
  section: "Lifestyle", // e.g. "Lifestyle"
  title: "What to wear to the office this fall", // e.g. "Can women ever win at work?"
  pubDate: "20140828", // e.g. "20140825"
  shareText: "Omg I love clothes"
};

var data = [];

var masonry,
    templateItem,
    templateQuote,
    $container;

// random number generators for fixtures
var width = d3.random.normal(350, 100);
var height = d3.random.normal(350, 100);
var characters = d3.random.normal(160, 60);
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit eget eros ullamcorper lobortis id ac dui. Vivamus commodo pulvinar leo, ac consectetur arcu mattis vel. Donec dapibus, orci eget ullamcorper egestas, felis ex elementum est, ut fermentum leo tortor nec felis. Nulla euismod commodo dui, sed pretium tortor luctus nec. Integer rhoncus metus enim, et vehicula nulla ullamcorper eu.";

// random item fixture constructor
function Item(id) {
  var w = Math.round(width());
  var h = Math.round(height());
  var c = Math.round(characters());

  this.id = id;
  this.type = _.sample(["general", "could-you-wear-this", "illustrated-guide", "brand-to-know", "real-person-problem", "quote"]);
	this.hed = lorem.substr(0,c/4);
	this.dek = lorem.substr(0,c);
	this.credit = lorem.substr(0,c/2);
  this.imgSmall = "img/" + ('0' + id).slice(-2) + "_small.png";
  this.imgLarge = "img/" + ('0' + id).slice(-2) + "_large.png";
  getImageSize(this.imgSmall, this, function(item, size) {
    item.imgSize = size;
  });
}

// fill in fixtures
for(var i=1; i<=50; i++) {
  data.push(new Item(i));
}

///////////////////////////////////////////////////

$( document ).ready(function() {
  if(inIframe()) $("body").addClass("iframed");

  // Read in templates
  templateItem = $("#template-item").html();
  templateQuote = $("#template-quote").html();

  // MASONRY (once images load)
  $container = $('#container').masonry({
    itemSelector: '.item',
    columnWidth: 1
  });

  // Load the initial 10 (kinda duplicate code...)
  var $items = getItems($("#container").children().length-1, 10);
  $container.masonryImagesReveal($items);

  // SOCIAL RULES EVERYTHING AROUND ME, SCREAM
  $('.popup-twitter').click(function() {shareTwitter(meta.shareText) } );
  $('.popup-linkedin').click(function() { shareLinkedIn(meta.shareText) } );
  $('.popup-facebook').click(function() { shareFacebook(meta.shareText) } );

  // Post-poll tweet (delegated event)
  $(document).on("click", ".poll .answer .tweet", function(event) {
    shareTwitter($(event.currentTarget).data("shareText"), document.URL.split("#")[0] + "#" + $(event.currentTarget).closest('.item').attr("id"));
  });

  // the unbearable weight of ANALYTICS OR IT DIDN'T HAPPEN!!!
  analytics(meta);

});

// delegated event, so it stays "live" (won't fire after poll is resolved)
$(document).on("click", ".poll.unresolved .answer", function(event) {

  var poll = $(event.target).closest('.poll');
  var answer = $(event.target).closest('.answer');
  var answerValue = answer.hasClass('yes');

  poll.removeClass("unresolved");
  poll.addClass("resolved");

  poll.find(".answer").addClass("final");
  answer.addClass("selected");
  answer.find('.progress').show();

  // send request to poll server
  postData = {
    app: 'fashion2014',
    questionId: poll.data('poll-id'),
    text: 'Could you wear this?',
    answers: [
      {id: 0, text: "Yes", vote: answerValue.toString()},
      {id: 1, text: "No", vote: !answerValue.toString()}
    ]
  }
  $.post("http://bw-poll-server.herokuapp.com", postData, function(returnData) {

    answer.find('.progress').hide();

    voteSum = returnData.answers.reduce(function(prev, value) { return prev + value.votes; }, 0);
    tally = [];

    returnData.answers.forEach(function(answer) {
      percentage = Math.round((answer.votes/voteSum)*100);
      answerEl = poll.find('[data-answer-id="'+answer.id+'"]');
      answerEl.css("width", percentage+"%");
      if(percentage==0) { answerEl.hide(); }
      answerEl.find(".percentage").text(percentage+"%");
      tally[answer.text] = percentage;
    })

    if(tally['Yes'] > 50) {
      if(answerValue) {
        // majority would wear, including user
        shareText = "Majority rules: I would totally wear this.";
      } else {
        // majority would wear, but user wouldn't
        shareText = "Can you believe most people would wear this? I wouldn't!";
      }
    } else {
      if(answerValue) {
        // majority wouldn't wear, but user would
        shareText = "I don't get why people wouldn't wear this. I totally would.";
      } else {
        // majority wouldn't wear, including user
        shareText = "Obviously nobody wants to wear this.";
      }
    }

    answer.find(".tweet").show().data("shareText", shareText);

  }, 'json');

})

$(window).scroll(function(event) {

  // terrible janky width-dependent (?!) parallax background scroll
  var y = $(window).scrollTop();
  $("body").css("background-position", "0% " + (y/100)+"%");

  // when you hit the bottom, load more
  if($(window).scrollTop() + $(window).height() == $(document).height()) {
    var $items = getItems($("#container").children().length-1, 10);
    $container.masonryImagesReveal($items);
  }
})

function getItems(offset, limit) {
  var itemsHTML = '';
  var items = data.slice(offset, offset+limit);
  items.forEach(function(item) {
    if(item.type == "quote") {
      itemsHTML += _.template(templateQuote, {"item": item});
    } else {
      itemsHTML += _.template(templateItem, {"item": item});
    }
  })
  return $(itemsHTML);
}

// from http://codepen.io/desandro/pen/kwsJb
$.fn.masonryImagesReveal = function( $items ) {
  var msnry = this.data('masonry');
  var itemSelector = msnry.options.itemSelector;
  // hide by default
  $items.hide();
  // append to container
  this.append( $items );
  $items.imagesLoaded().progress( function( imgLoad, image ) {
    // get item
    // image is imagesLoaded class, not <img>, <img> is image.img
    var $item = $( image.img ).parents( itemSelector );
    // un-hide item
    $item.show();
    // masonry does its thing
    msnry.appended( $item );
  });

  return this;
};

// thanks to http://stackoverflow.com/a/1093364/120290
function getImageSize(src, item, callback) {
  // create an offscreen image that isn't scaled but contains the same image.
  var img = new Image();
  img.src = src;

  // check if the image has finished loading
  img.onload = function() {
    callback(item, {width: img.width, height: img.height});
  };
}
