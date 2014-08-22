$( document ).ready(function() {
  if(inIframe()) $("body").addClass("iframed");

  var container = d3.select("#container");
  var width = d3.random.normal(300, 100);
  var height = d3.random.normal(400, 200);
  var characters = d3.random.normal(160, 60);
  var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed velit eget eros ullamcorper lobortis id ac dui. Vivamus commodo pulvinar leo, ac consectetur arcu mattis vel. Donec dapibus, orci eget ullamcorper egestas, felis ex elementum est, ut fermentum leo tortor nec felis. Nulla euismod commodo dui, sed pretium tortor luctus nec. Integer rhoncus metus enim, et vehicula nulla ullamcorper eu.";

  for(var i=1; i<=50; i++) {

    var w = Math.round(width());
    var h = Math.round(height());
    var c = Math.round(characters());

    var element = container
      .append("div")
      .classed("item", true)
      .style("width", w+"px");

    element.append("img").attr("src", "http://placekitten.com/"+w+"/"+h);

    element.append("div").classed("num", true).text(i);

    element.append("div").classed("dek", true).text(lorem.substr(0,c));

  }

  var masonry;
  imagesLoaded(container[0][0], function() {
    masonry = new Masonry( container[0][0], {
      columnWidth: 1,
      itemSelector: ".item"
    });
  });

});

function randomBorder() {
  return
}
