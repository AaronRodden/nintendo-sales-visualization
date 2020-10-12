'use strict';

const WIDTH = 800;
const HEIGHT = 300;
const TITLE_X_OFFSET = 750;
const TITLE_Y_OFFSET = 20;
// TODO: Fix this hardcoding
let IMAGE_X_OFFSET = 276;
let IMAGE_Y_OFFSET = 0;

function createBarChart(chartData, key, div, aggregates, scaleObj) {

  var data = [];
  for (let i = 0; i < chartData.length; i++) {
    // console.log(chartData[i]);
    data.push(chartData[i]["Global_Sales"]);
  }

  // console.log(data);

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
      width : function(d) {return scaleObj["scale"](d)},
      height: "40",
      y : function(d, i) {return i*50 + 50;},
      x : "10"
     });
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
                .attr("width", WIDTH)
                .attr("height", 30)

  var scale = d3.scale.linear()
                .domain([d3.min(aggregates["Global_Sales"]), d3.max(aggregates["Global_Sales"])])
                .range([10, d3.max(aggregates["Global_Sales"])*10]);

  // Add scales to axis
  var x_axis = d3.svg.axis(scale)
                 .scale(scale);

  //Append group and insert axis
  scaleSvg.append("g")
     .attr("transform", "translate(" + IMAGE_X_OFFSET + "," + (10) + ")")
     .call(x_axis);

  return {
    "scaleSvg" : scaleSvg,
    "scale" : scale,
  };
}

//TODO: Should an image be a seperate div?
function insertPicture(key) {
  var img = document.createElement("img", {class : `${key}-img`});

  img.src = `assets/${key}/${key}.png`; 
  // img.addEventListener('load', function () {
  //   // console.log("It's loaded!")
  // })
  // img.onload = function() {
  //   console.log("Width: " + this.width);
  //   console.log("Height: " + this.height);
  //   IMAGE_X_OFFSET = this.width;
  //   IMAGE_Y_OFFSET = this.height;
  // }

  var src = document.getElementsByClassName(`${key}`)[0];
   
  src.appendChild(img); 
}

function readDataFiles() {

  $.getJSON("data/nintendo.json", function(json) {
    console.log(json);

    let aggregates = gatherAggregates(json);
    let scaleObj = createAxis(aggregates);

    for (let key in json){
      let div = d3.select('.nintendo-viz').append('div').classed(key,true);
      insertPicture(key, div);
      createBarChart(json[key], key, div, aggregates, scaleObj);
    }
  });
}

$(document).ready(function() {
  readDataFiles();
});
   