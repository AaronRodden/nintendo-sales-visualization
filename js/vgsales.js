'use strict';

const WIDTH = 800;
const HEIGHT = 300;
const TITLE_X_OFFSET = 750;
const TITLE_Y_OFFSET = 20;
// TODO: Fix this hardcoding
let IMAGE_X_OFFSET = 387;
let IMAGE_Y_OFFSET = 0;

function showGif() {
  console.log("gif");
}

function createBarChart(chartData, key, div, aggregates, scaleObj) {

  var data = [];
  for (let i = 0; i < chartData.length; i++) {
    data.push(chartData[i]["Global_Sales"]);
  }

  var svg = d3.select(`.${key}`)
            .append("svg")
            .attr("width", WIDTH + 100)
            .attr("height", HEIGHT)

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    // TODO: Better data pre-processing would have avoided this...
    let gifName = d["Name"].replace(':', '');
    gifName = gifName.replace('/', ' ');
    gifName = gifName.replace('é', 'e');
    console.log(gifName)

    let platformName;
    if (d["Platform"] == "3DS"){
      platformName = "threeDS";
    }
    else {
      platformName = d["Platform"];
    }

    var img = document.createElement("img");
    img.className = "gif";
    img.src = `assets\\${platformName}\\${gifName}.gif`;

    var src = document.getElementsByClassName(`${platformName}`)[0];
   
    src.appendChild(img); 

    return "<strong>Name:</strong> <span style='color:red'>" + d["Name"] + "</span>" + "<br>" +
           "<strong>GlobalSales:</strong> <span style='color:red'>" + d["Global_Sales"] + "</span>" + "<br>" +
           "<strong>Genre:</strong> <span style='color:red'>" + d["Genre"] + "</span>" + "<br>" +
           "<strong>Year:</strong> <span style='color:red'>" + d["Year"] + "</span>";
  })

  svg.call(tip);

  svg.selectAll(".bar")
    .data(chartData)
    .enter()
    .append("rect")
    .attr({
      class : "bar",
      width : function(d) {return scaleObj["scale"](d["Global_Sales"])},
      height: "40",
      y : function(d, i) {return i*50 + 50;},
      x : "10"
     })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  let barElements = document.getElementsByClassName("bar")
  for (let i = 0; i < barElements.length; i++) {
    barElements[i].addEventListener("mouseout", function() {
      var elem = document.getElementsByClassName("gif")[0];
      elem.remove();
    });
  }

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
  document.getElementsByClassName("nintendo-viz")[0].style.marginTop = "50px";
  document.getElementsByClassName("nintendo-viz")[0].style.marginBottom = "150px";
}

$(document).ready(function() {
  readDataFiles();
});
   