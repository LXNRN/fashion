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
    shareTwitter($(event.currentTarget).data("shareText"), document.URL.split("#")[0] + "#" + $(event.currentTarget).closest('.item').attr("id"));
  });

  // the unbearable weight of ANALYTICS OR IT DIDN'T HAPPEN!!!
  analytics(meta);

});

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
  $.post("http://businessweek.com", postData, function(returnData) {
    // success
  }).fail(function() {

    //only because dylan's server isn't live yet...
    var returnData = {
      "_id": "53fca5bcb0a0ae9430307657",
      "text": "Could you wear this?",
      "id": 1,
      "app": "fashion2014",
      "__v": 2,
      "answers": [
        {
          "id": 0,
          "text": "Yes",
          "votes": Math.floor(Math.random()*50)
        },
        {
          "id": 1,
          "text": "No",
          "votes": Math.floor(Math.random()*50)
        }
      ]
    }

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
  var y = $(window).scrollTop();
  $("body").css("background-position", "0% " + (y/100)+"%");
})
