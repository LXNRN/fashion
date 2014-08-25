var data = [];

var width = d3.random.normal(350, 100);
var height = d3.random.normal(350, 100);
var characters = d3.random.normal(160, 60);
var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit eget eros ullamcorper lobortis id ac dui. Vivamus commodo pulvinar leo, ac consectetur arcu mattis vel. Donec dapibus, orci eget ullamcorper egestas, felis ex elementum est, ut fermentum leo tortor nec felis. Nulla euismod commodo dui, sed pretium tortor luctus nec. Integer rhoncus metus enim, et vehicula nulla ullamcorper eu.";

function item() {
  var w = Math.round(width());
  var h = Math.round(height());
  var c = Math.round(characters());

  this.type = _.sample(["general", "could-you-wear-this", "illustrated-guide", "brand-to-know", "real-person-problem", "quote"]);
	this.hed = lorem.substr(0,c/4);
	this.dek = lorem.substr(0,c);
	this.credit = lorem.substr(0,c/2);
  this.img = "http://placekitten.com/"+w+"/"+h;
}

for(var i=1; i<20; i++) {
  data.push(new item());
}

$( document ).ready(function() {
  if(inIframe()) $("body").addClass("iframed");

  var container = $("#container");

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

  var masonry;
  imagesLoaded(container[0], function() {
    masonry = new Masonry( container[0], {
      columnWidth: 1,
      itemSelector: ".item"
    });
  });

});

$(document).on("click", ".poll.unresolved .answer", function() {

  $(".poll").removeClass("unresolved");
  $(".poll").addClass("resolved");

  var yes = Math.floor(Math.random()*100);
  $(".yes").css("width", yes+"%");
  $(".no").css("width", (100-yes)+"%");
  $(".answer").addClass("final");
})
