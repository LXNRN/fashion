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

var masonry;

// random number generators for fixtures
var width = d3.random.normal(350, 100);
var height = d3.random.normal(350, 100);
var characters = d3.random.normal(160, 60);
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit eget eros ullamcorper lobortis id ac dui. Vivamus commodo pulvinar leo, ac consectetur arcu mattis vel. Donec dapibus, orci eget ullamcorper egestas, felis ex elementum est, ut fermentum leo tortor nec felis. Nulla euismod commodo dui, sed pretium tortor luctus nec. Integer rhoncus metus enim, et vehicula nulla ullamcorper eu.";

// random item fixture constructor
function item(id) {
  var w = Math.round(width());
  var h = Math.round(height());
  var c = Math.round(characters());

  this.id = id;
  this.type = _.sample(["general", "could-you-wear-this", "illustrated-guide", "brand-to-know", "real-person-problem", "quote"]);
	this.hed = lorem.substr(0,c/4);
	this.dek = lorem.substr(0,c);
	this.credit = lorem.substr(0,c/2);
  this.img = "http://placekitten.com/"+w+"/"+h;
}

// fill in fixtures
for(var i=1; i<=50; i++) {
  data.push(new item(data.length));
}

///////////////////////////////////////////////////

$( document ).ready(function() {
  if(inIframe()) $("body").addClass("iframed");

  var container = $("#container");

  // fill in templates
  var templateItem = $("#template-item").html();
  var templateQuote = $("#template-quote").html();
  var templatePoll = $("#template-poll").html();
  data.forEach(function(item, index) {
    if(item.type == "quote") {
      container.append(_.template(templateQuote, {"item": item, "index": index}))
    } else {
      container.append(_.template(templateItem, {"item": item, "index": index}))
    }
  })

  // MASONRY (once images load)
  imagesLoaded(container[0], function() {
    masonry = new Masonry( container[0], {
      columnWidth: 1,
      itemSelector: ".item"
    });
  });

  // SOCIAL RULES EVERYTHING AROUND ME, SCREAM
  $('.popup-twitter').click(function() {shareTwitter(meta.shareText) } );
  $('.popup-linkedin').click(function() { shareLinkedIn(meta.shareText) } );
  $('.popup-facebook').click(function() { shareFacebook(meta.shareText) } );

  $('.tweet').click(function(event) {
    shareTwitter($(event.currentTarget).data("shareText"));
  });

  // the unbearable weight of ANALYTICS OR IT DIDN'T HAPPEN!!!
  analytics(meta);

});

$(document).on("click", ".poll.unresolved .answer", function(event) {

  var poll = $(event.target).closest('.poll');
  var answer = $(event.target).closest('.answer');
  var answerValue = answer.hasClass('yes');
  var yes = Math.floor(Math.random()*100);

  poll.removeClass("unresolved");
  poll.addClass("resolved");

  poll.find(".answer").addClass("final");
  answer.addClass("selected");

  poll.find(".yes").css("width", yes+"%");
  poll.find(".yes .percentage").text(yes+"%");

  poll.find(".no").css("width", (100-yes)+"%");
  poll.find(".no .percentage").text((100-yes)+"%");

  if(yes > 50) {
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

})

$(window).scroll(function(event) {
  var y = $(window).scrollTop();
  $("body").css("background-position", "0% " + (y/100)+"%");
})
