$( document ).ready(function() {
  if(inIframe()) $("body").addClass("iframed");

  var container = d3.select("#container");
  var width = d3.random.normal(350, 100);
  var height = d3.random.normal(350, 100);
  var characters = d3.random.normal(160, 60);
  var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit eget eros ullamcorper lobortis id ac dui. Vivamus commodo pulvinar leo, ac consectetur arcu mattis vel. Donec dapibus, orci eget ullamcorper egestas, felis ex elementum est, ut fermentum leo tortor nec felis. Nulla euismod commodo dui, sed pretium tortor luctus nec. Integer rhoncus metus enim, et vehicula nulla ullamcorper eu.";

  for(var i=1; i<=50; i++) {

    var w = Math.round(width());
    var h = Math.round(height());
    var c = Math.round(characters());

    var item = container
      .append("div")
      .classed("item", true)
      .classed(randomItemClass(), true)
      .style("width", w+"px")
      .style("border", randomBorder());

    item.append("img").attr("src", "http://placekitten.com/"+w+"/"+h);

    item.append("div").classed("num", true).text(i).classed(randomNumClass(), true);
    item.append("div").classed("hed", true).text(lorem.substr(0,c/4));
    item.append("div").classed("dek", true).text(lorem.substr(0,c));

  }

  var masonry;
  imagesLoaded(container[0][0], function() {
    masonry = new Masonry( container[0][0], {
      columnWidth: 1,
      itemSelector: ".item"
    });
  });

});

$(".answer").click(function() {
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
