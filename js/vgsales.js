'use strict';

function createBarChart(chartData, key) {
  console.log(chartData);

  var data = [];
  for (let i = 0; i < chartData.length; i++) {
    console.log(chartData[i]);
    data.push(chartData[i]["Global_Sales"]);
  }

  console.log(data);

  let div = d3.select('.nintendo-viz').append('div').classed(key,true);

  var svg = d3.select(`.${key}`)
            .append("svg")
            .attr("width", 800)
            .attr("height", 300)

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr({
      class : "bar",
      width : function(d) {return d * 20.0;},
      height: "40",
      y : function(d, i) {return i*50 + 10;},
      x : "50"
     });

  //TODO: Title text location is hardcoded
  svg.append("text")
      .attr("x", 50)
      .attr("y", 280)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(chartData[0]["Platform"]);

}

function readDataFiles() {

  $.getJSON("data/nintendo.json", function(json) {
    console.log(json);

    // createBarChart(json["Wii"]);

    for (let key in json){
      createBarChart(json[key], key);
    }
  });
}

$(document).ready(function() {
  readDataFiles();
});
   