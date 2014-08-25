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

for(var i=1; i<10; i++) {
  data.push(new item());
}

$( document ).ready(function() {
  if(inIframe()) $("body").addClass("iframed");

  var container = $("#container");

  var templateItem = $("#template-item").html();
  var templatePoll = $("#template-poll").html();
  data.forEach(function(item, index) {
    container.append(_.template(templateItem, {"item": item, "index": index}))
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

function randomBorder() {
  var styles = ["dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
  var colors = ["black", "gray", "#f0f", "#0ff", "#0f0", "#ff0"];
  var style = styles[Math.floor(Math.random()*styles.length)];
  var width = Math.floor(Math.random() * 3 + 1);
  var color = colors[Math.floor(Math.random()*colors.length)];
  return width + "px " + style + " " + color;
}

function randomItemClass() {
  return "wobble" + Math.floor(Math.random() * 7);
}

function randomNumClass() {
  return "num" + Math.floor(Math.random()*4);
}
