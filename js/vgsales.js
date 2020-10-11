'use strict';

const WIDTH = 800;
const HEIGHT = 300;
const TITLE_X_OFFSET = 750;
const TITLE_Y_OFFSET = 20;

function createBarChart(chartData, key, aggregates, scaleObj) {
  // console.log(chartData);

  var data = [];
  for (let i = 0; i < chartData.length; i++) {
    // console.log(chartData[i]);
    data.push(chartData[i]["Global_Sales"]);
  }

  console.log(data);

  let div = d3.select('.nintendo-viz').append('div').classed(key,true);

  var svg = d3.select(`.${key}`)
            .append("svg")
            .attr("width", WIDTH + 100)
            .attr("height", HEIGHT)

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr({
      class : "bar",
      width : function(d) {console.log(d); return scaleObj["scale"](d)},
      height: "40",
      y : function(d, i) {return i*50 + 10;},
      x : "10"
     });

  //TODO: Title text location is hardcoded
  svg.append("text")
      .attr("x", WIDTH - TITLE_X_OFFSET)
      .attr("y", HEIGHT - TITLE_Y_OFFSET)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(chartData[0]["Platform"]);

}

function gatherAggregates(json) {

  let aggregateGlobalSales = [];

  for (let key in json) {
    for (let gameIndex in json[key]) {
      let game = json[key];
      aggregateGlobalSales.push(game[gameIndex]["Global_Sales"]);
    }
  }

  return {
    "Min Sales" : d3.min(aggregateGlobalSales),
    "Max Sales" : d3.max(aggregateGlobalSales),
    "Global_Sales" : aggregateGlobalSales
  };
}

function createAxis(aggregates) {
  // Create scale
  let scaleSvg = d3.select('.nintendo-viz').append('svg').classed("global-axis", true)
                .attr("width", WIDTH+100)
                .attr("height", 30)
                .attr("x", 0)

  var scale = d3.scale.linear()
                .domain([d3.min(aggregates["Global_Sales"]), d3.max(aggregates["Global_Sales"])])
                .range([10, d3.max(aggregates["Global_Sales"])*10]);

  // console.log("Scale test: " + scale(3.6));

  // Add scales to axis
  var x_axis = d3.svg.axis(scale)
                 .scale(scale);

  //Append group and insert axis
  scaleSvg.append("g")
     .call(x_axis);

  return {
    "scaleSvg" : scaleSvg,
    "scale" : scale,
  };
}

function readDataFiles() {

  $.getJSON("data/nintendo.json", function(json) {
    console.log(json);

    // createBarChart(json["Wii"]);

    let aggregates = gatherAggregates(json);

    let scaleObj = createAxis(aggregates);

    for (let key in json){
      createBarChart(json[key], key, aggregates, scaleObj);
    }
  });
}

//TODO: An init function that grabs the max values to create a scale at the top

$(document).ready(function() {
  readDataFiles();
});
   