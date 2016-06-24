
//leaflet code begins
//var statesData = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json";
var statesData = "countries.json";
var selectedYear; 
 
    function Get(statesData){
        var Httpreq = new XMLHttpRequest(); // a new request
        Httpreq.open("GET",statesData,false);
        Httpreq.send(null);
        return Httpreq.responseText; 
    }
    var json_obj = JSON.parse(Get(statesData));    

	var selectedLayer;
    
    function style(feature) {
        return {
		    weight: 2,
		    opacity: 1,
		    color: 'white',
		    dashArray: '3',
		    fillOpacity: 0.7,
            fillColor: getColor(feature.properties.density)
        };
    }
    	function onEachFeature(feature, layer) {
			layer.on({
				//mouseover: highlightFeature,
				//mouseout: resetHighlight,
				//click: zoomToFeature
                click: highlightFeature
			});
		}
        function highlightFeature(e) {
            if(selectedLayer) geojson.resetStyle(selectedLayer);
			if(incomingLayer) map.removeLayer(incomingLayer);
			
			if (e.target) selectedLayer = e.target;
			//console.log(e.target);
            //else selectedLayer = e;
			
			selectedLayer.setStyle({
				weight: 4,
				color: '#8A2E00',//#666',
				dashArray: '',
				fillOpacity: 0.5
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				selectedLayer.bringToFront();
			}

			info.update(selectedLayer.feature.properties);
            showLocation();
		}
		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}
    	function getColor(d) {
			return d > 1000 ? '#800026' :
			       d > 500  ? '#BD0026' :
			       d > 200  ? '#E31A1C' :
			       d > 100  ? '#FC4E2A' :
			       d > 50   ? '#FD8D3C' :
			       d > 20   ? '#FEB24C' :
			       d > 10   ? '#FED976' :
			                  '#FFEDA0';
		}
    
		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}
    
    map = L.map('map').setView([10.91, 22.83], 2);
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		maxZoom: 18
	}).addTo(map);

    var geojson;
    geojson = L.geoJson(json_obj, {
        style:style,
        onEachFeature: onEachFeature
    }).addTo(map);
    
    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    
    var cntryName; //tractName, countyName, stateName;

        info.update = function (props) {
        //this._div.innerHTML = '<h4>State:</h4>' +  (props ?   props.NAME10 + '<br />' + props.STATENS10 + '': '');
        //this._div.innerHTML = '<h4>Census Tract:</h4>' +  (props ?   props.name + '<br />' + props.slug + '': '');
        //this._div.innerHTML = '<h4>Census Tract:</h4>' +  (props ?   props.NAME + '<br />' + props.TRACTCE + '': '');
        //tractName = props.TRACTCE;
        //stateName = props.STATEFP;
        //countyName = props.COUNTYFP;
        cntryName = props.name;
        console.log(cntryName);
    };

	var stopListHtml = "<label for='stopList' class='select' style='height:0px;font-size:0px;'></label><select name='stopList' id='stopList' data-mini='true' onchange='changeOpt(value);'><option value='0'>Click a country on the map or select one from the list</option>";   
	$.getJSON("countries.json", function (d){
		for(var i=0;i<d.features.length;i++){
			stopListHtml += "<option value='" + d.features[i].properties.name + "'>" + d.features[i].properties.name + "</option>";
		}
		stopListHtml += "</select>";
		$("#stopListG").html(stopListHtml);
	});

var incomingLayer;

function changeOpt(v){
	console.log("vale: "+ v);
	$.getJSON("countries.json", function (d){
		for(var i=0;i<d.features.length;i++){
			if (v === d.features[i].properties.name){
				//highlightFeature(d.features[i]);
				console.log(d.features[i].geometry);
				var location = d.features[i].geometry.coordinates;

				if(incomingLayer) map.removeLayer(incomingLayer);
				//var selectLayerGroup = new L.LayerGroup();
				incomingLayer = L.GeoJSON.geometryToLayer(d.features[i]);//.addTo(map);//, options.pointToLayer, options.coordsToLatLng);
				//map.removeLayer(selectLayerGroup);
				
				incomingLayer.setStyle({
					weight: 4,
					color: '#8A2E00',//#666',
					dashArray: '',
					fillOpacity: 0.5
				});
				//selectLayerGroup.clearLayers();
				//map.removeLayer(selectLayerGroup);
				window.map.removeLayer(incomingLayer);
				//selectLayerGroup.addLayer(incomingLayer).addTo(map);
				incomingLayer.addTo(map);
				
				console.log(incomingLayer._latlngs);
				if(selectedLayer) geojson.resetStyle(selectedLayer);
				if (incomingLayer._latlngs) {
					console.log("Polygon");	
					map.fitBounds(incomingLayer._latlngs);
				}
				else {
					var bounds = incomingLayer.getLatLngs();
					console.log(bounds);
					var newArray = [];
					for(var y=0;y<bounds.length;y++){
						if(y>0) newArray = bounds[y-1].concat(bounds[y]);
					}
					map.fitBounds(newArray);
				}
				console.log(incomingLayer);
				//var latlngs = d.features[i].coordsToLatLngs(location, 1, true);
				//var newLocation = d.features[i].coordsToLatLngs(location, 1, true);
				//consolo.log("new location: " + latlngs);
				//d.features[i].coordsToLatLngs();
				//map.fitBounds(newLocation);
				//console.log(location);
				//map.fitBounds([[35.650072, 61.210817],[35.270664, 62.230651]]);
				//map.fitBounds([[61.210817,35.650072],[62.230651, 35.270664]]);
				//var poly = L.polygon(location);
				//var polyline = L.polyline(location, {color: 'red'}).addTo(map);
				//map.fitBounds(poly.getBounds());
				
				cntryName = v;
				showLocation();
				/*
				var location = d.features[i].geometry.coordinates;
				var lat = location[0];
				var lng = location[1];
				console.log(location);
				map.setView([lng, lat], 10);
				jtsMarkersList[v-1].openPopup();
				*/
			}
		}
	});
}
	
	function zoomToFullExtent() {
		map.setView([10.91, 22.83], 2);
	}
//end of leaflet code
        
        
//Chart

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}
/*
//Commute Chart     
var pieData;  
var medianIncomeValue;    
var width=660, height=300, radius=Math.min(width, height)/2;
var color = d3.scale.ordinal()
    .range(['#17becf','#ff7f0e','#2ca02c']);
  
var pieData0 = [
{label:"Life Expectancy", value:0},
{label:"Life Expectancy:Female", value:0},
{label:"Life Expectancy:Male", value:0}
];
pieData = pieData0;
function getData(){
  return pieData;
}
var pie = d3.layout.pie()
  .sort(null)
  .value(function(d){
    return d.value;
  });

//var arc = d3.svg.arc().outerRadius(radius);

var svg = d3.select("#chart").append("svg")
      .attr('width', width)
      .attr('height', height)
      .append('g')      
      .attr('id', 'pieChart');
      
svg.append('g').attr('class', 'slices');
svg.append('g').attr('class', 'labels');
svg.append('g').attr('class', 'lines');
svg.append('g').attr('class', 'legend');
svg.append('g').attr('class', 'legendrect');

var arc = d3.svg.arc()
  .outerRadius(radius * 0.8)
  .innerRadius(radius * 0.4);
var outerArc = d3.svg.arc()
  .innerRadius(radius * 0.9)
  .outerRadius(radius * 0.9);
svg.attr('transform', 'translate(' + 260 + ',' + height/2 + ')');

var key = function(d){return d.data.label;};
var tooltip = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding','0 10px')
      .style('background','white')
      .style('opacity',0)
      .attr('class', 'd3-tip');
      
change(getData());

function change(data){      
var slice = svg.select(".slices").selectAll("path.slice") 
      .data(pie(pieData), key);
      
slice.enter()
  .insert('path')
  .style("fill", function(d) { return color(d.data.label); })
  .attr('class', 'slice')
  .on('mouseover', function(d){
    d3.select(this).style('opacity', .5);
    tooltip.transition()
      .style('display', 'block')
      .style('opacity',.9)
    tooltip.html(d.value)
      .style('left', (d3.event.pageX) + 'px')
      .style('top', (d3.event.pageY) + 'px')
  })
  .on('mouseleave', function(d){
    d3.select(this).style('opacity', 1);
    tooltip.style('display', 'none');
  });
  slice   
    .transition().duration(1000)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        return arc(interpolate(t));
      };
    });

  slice.exit()
    .remove();
    
//legend labels and mark
var textLgd = svg.select('.legend').selectAll('text')
      .data(pie(pieData), key);

textLgd.enter()
  .append('text')
  .attr('dy', '1em')
  .text(function(d){
    return d.data.label;
  })
  .attr("transform", function(d,i) {
    return "translate(" + 250 + ", " + i*20  + ")";
  });
textLgd.exit()
  .remove();  


  var rectLgd = svg.select(".legendrect").selectAll("rect")
    .data(pie(pieData), key);
  
  rectLgd.enter()
    .append("rect")
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d) { return color(d.data.label); })
    .attr("transform", function(d,i){
      return "translate(" + 230 + "," + i*20 + ")";
    }); 
rectLgd.exit()
  .remove();  

  // ------- SLICE TO TEXT -------
var text = svg.select('.labels').selectAll('text')
      .data(pie(pieData), key);
text.enter()
  .append('text')
  .attr('dy', '.35em')
  .text(function(d){
    return d.data.label;
  });
function midAngle(d){
  return d.startAngle + (d.endAngle - d.startAngle)/2;
}
text.transition().duration(1000)
  .attrTween('transform', function(d){
    this._current = this._current || d;
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function(t){
      var d2 = interpolate(t);
      var pos = outerArc.centroid(d2);
      pos[0] = radius * (midAngle(d2) < Math.PI ? 1: -1);
      return 'translate(' + pos + ')';
    };
  })
  .styleTween('text-anchor', function(d){
    this._current = this._current || d;
    var interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(0);
    return function(t){
      var d2 = interpolate(t);
      return midAngle(d2) < Math.PI ? 'start' : 'end';
    };
  });

text.exit()
  .remove();  
  

  // ------- SLICE TO TEXT POLYLINES -------


  var polyline = svg.select(".lines").selectAll("polyline")
    .data(pie(pieData), key);
  
  polyline.enter()
    .append("polyline");

  polyline.transition().duration(1000)
    .attrTween("points", function(d){
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function(t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };      
    });

  polyline.exit()
    .remove();


}   
//End of Commute Chart
*/
//Life Expectancy Chart        
var barDataLE;
var barDataLE0 = [
{label:"Life Expectancy", value:0},
{label:"Life Expectancy:Female", value:0},
{label:"Life Expectancy:Male", value:0}
];
barDataLE = barDataLE0;
function getDataLE(){
  return barDataLE;
}

var heightLE =400 , widthLE =600 , barWidthLE=30, barOffsetLE=10, paddingLE=50;
var marginLE = {top:30,right:50,bottom:130,left:30};//{top:30,right:50,bottom:100,left:30};

var keyLE = function(d){return d.label;};

var colorLE = d3.scale.linear()
    .domain([0,barDataLE.length])
    .range(['#268bd2', '#85992c']);
var xScaleLE = d3.scale.ordinal()
    .domain(d3.range(0,barDataLE.length))
    .rangeBands([0, widthLE - marginLE.left - marginLE.right]);
    
var myChartLE = d3.select('#chart').append('svg')
    .attr('width', widthLE)
    .attr('height', heightLE)
    //.style('background', '#c9d7d6')
    .append("g")
    .attr('width', widthLE-marginLE.left-marginLE.right)
    .attr('height', heightLE-marginLE.top-marginLE.bottom)
    .attr("transform", "translate(" + marginLE.left + "," + marginLE.top + ")");  

var key = function(d){return d.data.label;};
var tooltipLE = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding','0 10px')
      .style('background','white')
      .style('opacity',0)
      .attr('class', 'd3-tip')
      .attr('id', 'tipLE');
    
changeLE(barDataLE0);
medianLEValue = 0.8;

//$("#chart").append("<div id='mInValue' class='medianValue'>Life Expectacy (both sexes)</div>");

function changeLE(data){
var yScaleLE = d3.scale.linear()
    .domain([0,d3.max(data, function(d) {return d.value})])
    .range([0,heightLE-marginLE.top-marginLE.bottom]);
var guideScaleLE = d3.scale.linear()
    .domain([0,d3.max(data, function(d) {return d.value})])
    .range([heightLE-marginLE.top-marginLE.bottom,0]);
  
var rectLE = myChartLE.selectAll('rect')
          .data(data, keyLE)          ;
d3.selectAll(".axisLE").remove();
rectLE.enter()
      .append('rect')
      .attr('class', 'bar')
      .style('fill', function(d,i){
        return colorLE(i);
      })
      .attr('width', function(d,i){
        return (widthLE-marginLE.left-marginLE.right)/data.length - barOffsetLE;}
      )
      .attr('x', function(d,i){
        return (widthLE-marginLE.left-marginLE.right)/data.length * i + marginLE.left;
      })
      .attr('height', function(d){
        return yScaleLE(d.value);
      })
      .attr('y', function(d){
        return heightLE - yScaleLE(d.value);
      })
	  .on('mouseover', function(d){
		d3.select(this).style('opacity', .5);
		tooltipLE.transition()
		  .style('display', 'block')
		  .style('opacity',.9)
		tooltipLE.html(d.value)
		  .style('left', (d3.event.pageX) + 'px')
		  .style('top', (d3.event.pageY) + 'px')
	  })
	  .on('mouseout', function(d){
		d3.select(this).style('opacity', 1);
		tooltipLE.style('display', 'none');
		//tooltip.hide;
	  });
    
  

rectLE.transition()
    .duration(1500)
        .attr('height', function(d){
        return yScaleLE(d.value);
      })
      .attr('y', function(d){
        return heightLE -marginLE.top - marginLE.bottom - yScaleLE(d.value);
      })/*
      .delay(function(d,i){
        return i*20;
      })
      .ease('elastic')*/;

var xAxisLE= d3.svg.axis()
        .scale(xScaleLE)
        .tickFormat(function(d) {return data[d].label;})
        .orient("bottom");
        
myChartLE.append("g")
  .attr("class", "x axisLE")
  .attr("transform", "translate(" + marginLE.left + "," + (heightLE-marginLE.top-marginLE.bottom) + ")")
  .call(xAxisLE)
  .selectAll(".x text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d){
      return "rotate(-65)";
    });

var yAxisLE = d3.svg.axis()
        .scale(guideScaleLE)
        .orient("left")
        .ticks(5);
myChartLE.append("g")
    .attr("class", "y axisLE")
    .attr("transform", "translate(" + marginLE.left + "," + 0 + ")")
    .call(yAxisLE);


}         

//Ethnic Chart      
$("#chartRace").append("<div id='chartEthnic'  style='float:left'></div>");
var pieDataEthnic;      
var widthE=660, heightE=300, radiusE=Math.min(widthE, heightE)/2;
var colorE = d3.scale.ordinal()
    .range(['#bd3613','#2176c7']);
  
var pieDataEthnic0 = [
{label:"Female Pop.", value:5000},
{label:"Male Pop.", value:5000}
];

pieDataEthnic = pieDataEthnic0;
function getDataEthnic(){
  return pieDataEthnic;
}
var pieEthnic = d3.layout.pie()
  .sort(null)
  .value(function(d){
    return d.value;
  });

var svgEthnic = d3.select("#chartEthnic").append("svg")
      .attr('width', widthE)
      .attr('height', heightE)
      .append('g')      
      .attr('id', 'pieChartEthnic');
      
svgEthnic.append('g').attr('class', 'slices');
svgEthnic.append('g').attr('class', 'labels');
svgEthnic.append('g').attr('class', 'lines');

var arcEthnic = d3.svg.arc()
  .outerRadius(radiusE * 0.8)
  .innerRadius(radiusE * 0.4);
var outerArcEthnic = d3.svg.arc()
  .innerRadius(radiusE * 0.9)
  .outerRadius(radiusE * 0.9);
svgEthnic.attr('transform', 'translate(' + widthE/2 + ',' + heightE/2 + ')');

var keyEthnic = function(d){return d.data.label;};
var tooltipEthnic = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding','0 10px')
      .style('background','white')
      .style('opacity',0)
      .attr('class', 'd3-tip')
      .attr('id', 'tipEthnic');

mvSexRatio = 1;   
$("#chartEthnic").append("<div id='mValueSexRatio' class='medianValue'>Sex ratio at birth (males per females): "+ mvSexRatio + "</div>");   

changeEthnic(getDataEthnic());

function changeEthnic(data){  
$("#mValueSexRatio").html("Sex ratio at birth (males per female): " + mvSexRatio);

var sliceEthnic = svgEthnic.select(".slices").selectAll("path.slice") 
      .data(pieEthnic(pieDataEthnic), keyEthnic);
      
sliceEthnic.enter()
  .insert('path')
  .style("fill", function(d) { return colorE(d.data.label); })
  .attr('class', 'slice')
  .on('mouseover', function(d){
    d3.select(this).style('opacity', .5);
    tooltipEthnic.transition()
      .style('display', 'block')
      .style('opacity',.9)
    tooltipEthnic.html(parseInt(d.value).toLocaleString())
      .style('left', (d3.event.pageX) + 'px')
      .style('top', (d3.event.pageY) + 'px')
  })
  .on('mouseout', function(d){
    d3.select(this).style('opacity', 1);
    tooltipEthnic.style('display', 'none');
  });
  sliceEthnic   
    .transition().duration(1000)
    .attrTween("d", function(d) {
      this._current = this._current || d;
      var interpolateEthnic = d3.interpolate(this._current, d);
      this._current = interpolateEthnic(0);
      return function(t) {
        return arcEthnic(interpolateEthnic(t));
      };
    });

  sliceEthnic.exit()
    .remove();
    
    
  //text labels
  var textEthnic = svgEthnic.select('.labels').selectAll('text')
        .data(pieEthnic(pieDataEthnic), keyEthnic);
  textEthnic.enter()
    .append('text')
    .attr('dy', '.35em')
    .text(function(d){
      return d.data.label;
    });
  function midAngleEthnic(d){
    return d.startAngle + (d.endAngle - d.startAngle)/2;
  }
  textEthnic.transition().duration(1000)
    .attrTween('transform', function(d){
      this._current = this._current || d;
      var interpolateEthnic = d3.interpolate(this._current, d);
      this._current = interpolateEthnic(0);
      return function(t){
        var d2Ethnic = interpolateEthnic(t);
        var posEthnic = outerArcEthnic.centroid(d2Ethnic);
        posEthnic[0] = radiusE * (midAngleEthnic(d2Ethnic) < Math.PI ? 1: -1);
        return 'translate(' + posEthnic + ')';
      };
    })
    .styleTween('text-anchor', function(d){
      this._current = this._current || d;
      var interpolateEthnic = d3.interpolate(this._current, d);
      this._current = interpolateEthnic(0);
      return function(t){
        var d2Ethnic = interpolateEthnic(t);
        return midAngleEthnic(d2Ethnic) < Math.PI ? 'start' : 'end';
      };
    });
  textEthnic.exit()
    .remove();  
  

  // ------- SLICE TO TEXT POLYLINES -------

  var polylineEthnic = svgEthnic.select(".lines").selectAll("polyline")
    .data(pieEthnic(pieDataEthnic), keyEthnic);
  
  polylineEthnic.enter()
    .append("polyline");

  polylineEthnic.transition().duration(1000)
    .attrTween("points", function(d){
      this._current = this._current || d;
      var interpolateEthnic = d3.interpolate(this._current, d);
      this._current = interpolateEthnic(0);
      return function(t) {
        var d2Ethnic = interpolateEthnic(t);
        var posEthnic = outerArcEthnic.centroid(d2Ethnic);
        posEthnic[0] = radiusE * 0.95 * (midAngleEthnic(d2Ethnic) < Math.PI ? 1 : -1);
        return [arcEthnic.centroid(d2Ethnic), outerArcEthnic.centroid(d2Ethnic), posEthnic];
      };      
    });
  
  polylineEthnic.exit()
    .remove();
}
//End of Ethnic Chart 

//Birth Death Migration Rate Chart2 
var barDataBDM;
var barDataBDM0 = [
{label:"Birth Rate", value:0},
{label:"Death Rate", value:0},
{label:"Migration Rate", value:0}
];
barDataBDM = barDataBDM0;

var marginBDM = {top: 30, right: 10, bottom: 120, left: 30},
    widthBDM = 600 - marginBDM.left - marginBDM.right,
    heightBDM = 400 - marginBDM.top - marginBDM.bottom;

var colorBDM = d3.scale.ordinal()
    .range(['#17becf','#ff7f0e','#2ca02c']);	
	
//var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
//var y0 = Math.max(Math.abs(d3.min(data, function(d){return d.value})), Math.abs(d3.max(data, function(d) {return d.value})));
//var y01 = Math.abs(d3.min(barDataBDM, function(d){return d.value}));
//var y02 = Math.abs(d3.max(barDataBDM, function(d) {return d.value}));
//console.log("y0:"+y0);
var yScaleBDM = d3.scale.linear()
    //.domain([-y01, y02])
    .range([heightBDM,0])
    .nice();
console.log("y:" + yScaleBDM);
var xScaleBDM = d3.scale.ordinal()
    //.domain(d3.range(barDataBDM.length))
    .rangeRoundBands([0,widthBDM], .2);

var yAxis = d3.svg.axis()
    .scale(yScaleBDM)
    .orient("left");

var svgBDM = d3.select("#chartHousing").append("svg")
    .attr("width", widthBDM + marginBDM.left + marginBDM.right)
    .attr("height", heightBDM + marginBDM.top + marginBDM.bottom)
  .append("g")
    .attr("transform", "translate(" + marginBDM.left + "," + marginBDM.top + ")");
	
var tooltipBMR = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding','0 10px')
      .style('background','white')
      .style('opacity',0)
      .attr('class', 'd3-tip')
      .attr('id', 'tipBMR');

$("#chartHousing").append("<div id='mValueBDM' class='medianValue'>Births/Deaths/Net Migration per 1,000 population</div>");	  
	  
changeBDM(barDataBDM0);

function changeBDM(data){

xScaleBDM.domain(d3.range(data.length));
var y01 = Math.abs(d3.min(data, function(d){return d.value}));
var y00 = d3.min(data, function(d){return d.value});
if (y00 >0) y01 = 0;
var y02 = Math.abs(d3.max(data, function(d) {return d.value}));
yScaleBDM.domain([-y01, y02]);

d3.selectAll(".axisBDM").remove();

svgBDM.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
    .attr("y", function(d) { return yScaleBDM(Math.max(0, d.value)); })
    .attr("x", function(d, i) { return xScaleBDM(i); })
    .attr("height", function(d) { return Math.abs(yScaleBDM(d.value) - yScaleBDM(0)); })
    .attr("width", xScaleBDM.rangeBand())      
	.style('fill', function(d,i){
        return colorBDM(i);
    })
	.on('mouseover', function(d){
		d3.select(this).style('opacity', .5);
		tooltipBMR.transition()
		  .style('display', 'block')
		  .style('opacity',.9)
		tooltipBMR.html(d.value)
		  .style('left', (d3.event.pageX) + 'px')
		  .style('top', (d3.event.pageY) + 'px')
	})
	.on('mouseout', function(d){
		d3.select(this).style('opacity', 1);
		tooltipBMR.style('display', 'none');
	});


svgBDM.selectAll(".bar").transition()
    .duration(1500)
        .attr('height', function(d){
        return Math.abs(yScaleBDM(d.value) - yScaleBDM(0));//yScaleBDM(d.value);
      })
      .attr('y', function(d){
        return yScaleBDM(Math.max(0, d.value));//return heightBDM -marginBDM.top - marginBDM.bottom - yScaleBDM(d.value);
      })
      .delay(function(d,i){
        return i*20;
      })
      .ease('elastic');	

svgBDM.append("g")
    .attr("class", "x axisBDM")
    .call(yAxis);

svgBDM.append("g")
    .attr("class", "y axisBDM")
  .append("line")
    .attr("y1", yScaleBDM(0))
    .attr("y2", yScaleBDM(0))
    .attr("x1", 0)
    .attr("x2", widthBDM); 


var keyBDM = function(d){return d.label;};	
var rect = svgBDM.selectAll('rect')
          .data(data, keyBDM);
		  
var xAxisBDM = d3.svg.axis()
        .scale(xScaleBDM)
        .tickFormat(function(d) {return data[d].label;})
        .orient("bottom");	

svgBDM.append("g")
  .attr("class", "x axisBDM")
  .attr("id", "xLabelBDM")
  .attr("transform", "translate(" + marginBDM.left + "," + heightBDM + ")")
  .call(xAxisBDM)
  .selectAll(".x text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d){
      return "rotate(-65)";
    });		
	
d3.select("#xLabelBDM").select("path").remove();
}



//Age Chart
var barDataAge;
var barDataAge0 = [
{label:"under5", value:0},
{label:"5 - 9", value:0},
{label:"10 - 14", value:0},
{label:"15 - 19", value:0},
{label:"20 - 24", value:0},
{label:"25 - 29", value:0},
{label:"30 - 34", value:0},
{label:"35 - 39", value:0},
{label:"40 - 44", value:0},
{label:"45 - 49", value:0},
{label:"50 - 54", value:0},
{label:"55 - 59", value:0},
{label:"60 - 64", value:0},
{label:"65 - 69", value:0},
{label:"70 - 74", value:0},
{label:"75 - 79", value:0},
{label:"80 - 84", value:0},
{label:"85 - 89", value:0},
{label:"90 - 94", value:0},
{label:"95 - 99", value:0},
{label:"100over", value:0}
];        
        
        
barDataAge = barDataAge0;
function getDataAge(){
  return barDataAge;
}

var heightA =400 , widthA =600 , barWidth=30, barOffset=2, padding=50;
var margin = {top:30,right:50,bottom:50,left:50};
console.log("margin.top"+ margin.top);

var keyAge = function(d){return d.label;};

var colorA = d3.scale.linear()
    .domain([0,barDataAge.length*.33,barDataAge.length*.66,barDataAge.length])
    .range(['#B58929','#c61c6f','#268bd2', '#85992c']);
var xScale = d3.scale.ordinal()
    .domain(d3.range(0,barDataAge.length))
    .rangeBands([0, widthA - margin.left - margin.right]);
    
var myChartAge = d3.select('#chartAge').append('svg')
    .attr('width', widthA)
    .attr('height', heightA)
    //.style('background', '#c9d7d6')
    .append("g")
    .attr('width', widthA-margin.left-margin.right)
    .attr('height', heightA-margin.top-margin.bottom)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

mvTotPop = 0;   
$("#chartAge").append("<div id='mValueTotPop' class='medianValue'>Total Population "+ mvTotPop + "</div>");   

var tooltipAge = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding','0 10px')
      .style('background','white')
      .style('opacity',0)
      .attr('class', 'd3-tip')
      .attr('id', 'tipAge');

changeAge(barDataAge0);

function changeAge(data){
$("#mValueTotPop").html("Total Population: " + mvTotPop);
var yScale = d3.scale.linear()
    .domain([0,d3.max(data, function(d) {return d.value})])
    .range([0,heightA - margin.top - margin.bottom]);
var guideScale = d3.scale.linear()
    .domain([0,d3.max(data, function(d) {return d.value})])
    .range([heightA-margin.top-margin.bottom,0]);
  
var rectAge = myChartAge.selectAll('rect')
          .data(data, keyAge)         ;
d3.selectAll(".axis").remove();
rectAge.enter()
      .append('rect')
      .attr('class', 'bar')
      .style('fill', function(d,i){
        return colorA(i);
      })
      .attr('width', function(d,i){
        return (widthA-margin.left-margin.right)/data.length - barOffset;}
      )
      .attr('x', function(d,i){
        return (widthA-margin.left-margin.right)/data.length * i + margin.left;
      })
      .attr('height', function(d){
        return yScale(d.value);
      })
      .attr('y', function(d){
        return heightA - yScale(d.value);
      })
      .on('mouseover', function(d){
		d3.select(this).style('opacity', .5);
		tooltipAge.transition()
		  .style('display', 'block')
		  .style('opacity',.9)
		tooltipAge.html(parseInt(d.value).toLocaleString())
		  .style('left', (d3.event.pageX) + 'px')
		  .style('top', (d3.event.pageY) + 'px')
	  })
	  .on('mouseout', function(d){
		d3.select(this).style('opacity', 1);
		tooltipAge.style('display', 'none');
	  });
    
  

rectAge.transition()
    .duration(750)
        .attr('height', function(d){
        return yScale(d.value);
      })
      .attr('y', function(d){
        return heightA -margin.top - margin.bottom - yScale(d.value);
      });

var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickFormat(function(d) {return data[d].label;})
        .orient("bottom");
        //.tickValues(xScale.domain().filter(function(d,i){
        //  return !(i%(data.lenght/3));
        //}));
        
myChartAge.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(" + margin.left + "," + (heightA-margin.top-margin.bottom) + ")")
  .call(xAxis)
  .selectAll(".x text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d){
      return "rotate(-65)";
    });

var yAxis = d3.svg.axis()
        .scale(guideScale)
        .orient("left")
        .ticks(5);
myChartAge.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .call(yAxis);
} 
        
//End of Age Chart  


//Mortality Rate Chart
var barDataMR;
var barDataMR0 = [
{label:"MortalityRate-Infant", value:0},
{label:"MortalityRate-under5", value:0},
{label:"MortalityRate-Infant(Female)", value:0},
{label:"MortalityRate-under5(Female)", value:0},
{label:"MortalityRate-Infant(Male)", value:0},
{label:"MigrationRate-under5(Male)", value:0}
];
barDataMR = barDataMR0;

var marginMR = {top: 30, right: 10, bottom: 200, left: 30},
    widthMR = 600 - marginMR.left - marginMR.right,
    heightMR = 500 - marginMR.top - marginMR.bottom;

var colorMR = d3.scale.ordinal()
    .range(['#7b7f15','#cfd369','#801515','#d46a6a','#113b51','#477187']);	
	
//var y0 = Math.max(Math.abs(d3.min(data)), Math.abs(d3.max(data)));
//var y0 = Math.max(Math.abs(d3.min(data, function(d){return d.value})), Math.abs(d3.max(data, function(d) {return d.value})));
//var y01 = Math.abs(d3.min(barDataMR, function(d){return d.value}));
//var y02 = Math.abs(d3.max(barDataMR, function(d) {return d.value}));
//console.log("y0:"+y0);
var yScaleMR = d3.scale.linear()
    //.domain([-y01, y02])
    .range([heightMR,0])
    .nice();
console.log("y:" + yScaleMR);
var xScaleMR = d3.scale.ordinal()
    //.domain(d3.range(barDataMR.length))
    .rangeRoundBands([0,widthMR], .2);

var yAxis = d3.svg.axis()
    .scale(yScaleMR)
    .orient("left");

var svgMR = d3.select("#chartIncome").append("svg")
    .attr("width", widthMR + marginMR.left + marginMR.right)
    .attr("height", heightMR + marginMR.top + marginMR.bottom)
  .append("g")
    .attr("transform", "translate(" + marginMR.left + "," + marginMR.top + ")");

var tooltipMR = d3.select('body').append('div')
      .style('position','absolute')
      .style('padding','0 10px')
      .style('background','white')
      .style('opacity',0)
      .attr('class', 'd3-tip')
      .attr('id', 'tipMR');
	  
changeMR(barDataMR0);

function changeMR(data){

xScaleMR.domain(d3.range(data.length));
var y01 = Math.abs(d3.min(data, function(d){return d.value}));
var y00 = d3.min(data, function(d){return d.value});
if (y00 >0) y01 = 0;
var y02 = Math.abs(d3.max(data, function(d) {return d.value}));
yScaleMR.domain([-y01, y02]);

d3.selectAll(".axisMR").remove();

svgMR.selectAll(".bar")
    .data(data)
  .enter().append("rect")
    .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
    .attr("y", function(d) { return yScaleMR(Math.max(0, d.value)); })
    .attr("x", function(d, i) { return xScaleMR(i); })
    .attr("height", function(d) { return Math.abs(yScaleMR(d.value) - yScaleMR(0)); })
    .attr("width", xScaleMR.rangeBand())      
	.style('fill', function(d,i){
        return colorMR(i);
      })
	.on('mouseover', function(d){
		d3.select(this).style('opacity', .5);
		tooltipMR.transition()
		.style('display', 'block')
		.style('opacity',.9)
		tooltipMR.html(d.value)
		.style('left', (d3.event.pageX) + 'px')
		.style('top', (d3.event.pageY) + 'px')
	})
	.on('mouseout', function(d){
		d3.select(this).style('opacity', 1);
		tooltipMR.style('display', 'none');
	});  


svgMR.selectAll(".bar").transition()
    .duration(1500)
        .attr('height', function(d){
        return Math.abs(yScaleMR(d.value) - yScaleMR(0));//yScaleMR(d.value);
      })
      .attr('y', function(d){
        return yScaleMR(Math.max(0, d.value));//return heightMR -marginMR.top - marginMR.bottom - yScaleMR(d.value);
      })
      .delay(function(d,i){
        return i*20;
      })
      .ease('elastic');	

svgMR.append("g")
    .attr("class", "x axisMR")
    .call(yAxis);

svgMR.append("g")
    .attr("class", "y axisMR")
  .append("line")
    .attr("y1", yScaleMR(0))
    .attr("y2", yScaleMR(0))
    .attr("x1", 0)
    .attr("x2", widthMR); 


var keyMR = function(d){return d.label;};	
var rect = svgMR.selectAll('rect')
          .data(data, keyMR);
		  
var xAxisMR = d3.svg.axis()
        .scale(xScaleMR)
        .tickFormat(function(d) {return data[d].label;})
        .orient("bottom");	

svgMR.append("g")
  .attr("class", "x axisMR")
  .attr("id", "xLabelMR")
  .attr("transform", "translate(" + marginMR.left + "," + heightMR + ")")
  .call(xAxisMR)
  .selectAll(".x text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d){
      return "rotate(-65)";
    });		
	
d3.select("#xLabelMR").select("path").remove();
}
        
//End of Mortality Chart 
selectedYear = 2015;
                    
function showLocation(evt){
if (countries = 'undefined') $("#iResults").html("Choose a country."); //console.log("it is undefined");

var pieData1 = [
{label:"Life Expectancy", value:0},
{label:"Life Expectancy:Female", value:0},
{label:"Life Expectancy:Male", value:0}
];  

var pieDataRace1 = [
{label:"Female Pop.", value:0},
{label:"Male Pop.", value:0}
];  

var barDataBDM1 = [
{label:"Birth Rate", value:0},
{label:"Death Rate", value:0},
{label:"Migration Rate", value:0}
];
  
var pieDataHousing1 = [
{label:"Owner-Occupied", value:0},
{label:"Renter-Occupied", value:0},
{label:"Vacant", value:0}
];

var pieDataEthnic1 = [
{label:"Female Pop.", value:0},
{label:"Male Pop.", value:0}
];  
var barDataAge1 = [
{label:"under5", value:0},
{label:"5 - 9", value:0},
{label:"10 - 14", value:0},
{label:"15 - 19", value:0},
{label:"20 - 24", value:0},
{label:"25 - 29", value:0},
{label:"30 - 34", value:0},
{label:"35 - 39", value:0},
{label:"40 - 44", value:0},
{label:"45 - 49", value:0},
{label:"50 - 54", value:0},
{label:"55 - 59", value:0},
{label:"60 - 64", value:0},
{label:"65 - 69", value:0},
{label:"70 - 74", value:0},
{label:"75 - 79", value:0},
{label:"80 - 84", value:0},
{label:"85 - 89", value:0},
{label:"90 - 94", value:0},
{label:"95 - 99", value:0},
{label:"100over", value:0}
];

var barDataMR1 = [
{label:"Mortality Rate - Infant", value:37.64},
{label:"Mortality Rate - under 5", value:12.90},
{label:"Mortality Rate - Infant (Female)", value:20.64},
{label:"Mortality Rate - under 5 (Female)", value:12.90},
{label:"Mortality Rate - Infant (Male)", value:37.64},
{label:"Migration Rate - under 5 (Male)", value:-10.22}
];

var pieDataEdu1 = [
{label:"-9th", value:0},
{label:"9-12th", value:0},
{label:"High School", value:0},
{label:"Some College", value:0},
{label:"Associate", value:0},
{label:"Bachelor", value:0},
{label:"Graduate", value:0}
];


//Commute chart
            var url1 = "http://api.census.gov/data/timeseries/idb/5year?get=E0&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(url1, function(data){
              var value1 = data[1][0];
              //console.log("value1:" + value1);
              pieData1[0].value = value1;
              var url2 = "http://api.census.gov/data/timeseries/idb/5year?get=E0_F&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(url2, function(data){
                var value2 = data[1][0];
                pieData1[1].value = value2;
                var url3 = "http://api.census.gov/data/timeseries/idb/5year?get=E0_M&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                $.get(url3, function(data){
                  var value3 = data[1][0];
                  pieData1[2].value = value3;
                  pieData = pieData1;
                  changeLE(pieData1); 
                });
              });             
            });

//Race chart
/*
            var urlR = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,FPOP&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(urlR, function(data){
              var value1 = data[1][1];
              pieDataRace1[0].value = value1;
              var urlR2 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,MPOP&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
			  $.get(urlR2, function(data){
                var value2 = data[1][1];
                pieDataRace1[1].value = value2;
                pieDataRace = pieDataRace1;
                changeRace(pieDataRace1); 
              });          
            }); 
*/			
			
			var urlR = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,FPOP&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(urlR, function(data){
              var value1 = data[1][1];
              pieDataEthnic1[0].value = value1;
              var urlR2 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,MPOP&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
			  $.get(urlR2, function(data){
                var value2 = data[1][1];
                pieDataEthnic1[1].value = value2;
                pieDataEthnic = pieDataEthnic1;
				
				var urlR3 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,SRB&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";	
				$.get(urlR3, function(data){
					mvSexRatio = data[1][1];					
					changeEthnic(pieDataEthnic1); 				
				})

              });          
            }); 
/*            
//Ethnic chart
            var urlE = "http://api.census.gov/data/2013/acs5/profile?get=DP05_0066E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(urlE, function(data){
              value1 = data[1][0];
              pieDataEthnic1[0].value = value1;
              var urlE2 = "http://api.census.gov/data/2013/acs5/profile?get=DP05_0071E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(urlE2, function(data){
                value2 = data[1][0];
                pieDataEthnic1[1].value = value2;
                pieDataEthnic = pieDataEthnic1;
                changeEthnic(pieDataEthnic1);
              });             
            });             

*/			
			//Birth, Death, Migration chart
            var url1 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,CBR&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(url1, function(data){
              var value1 = data[1][1];
              //console.log("value1:" + value1);
              barDataBDM1[0].value = value1;
              var url2 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,CDR&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(url2, function(data){
                var value2 = data[1][1];
                barDataBDM1[1].value = value2;
                var url3 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,NMR&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                $.get(url3, function(data){
                  var value3 = data[1][1];
                  barDataBDM1[2].value = value3;
                  barDataBDM = barDataBDM1;
                  changeBDM(barDataBDM1); 
                });
              });             
            });

			/*
			//Housing chart
            var urlH = "http://api.census.gov/data/2013/acs5/profile?get=DP04_0045E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(urlH, function(data){
              value1 = data[1][0];
              pieDataHousing1[0].value = parseInt(value1);
              var urlH2 = "http://api.census.gov/data/2013/acs5/profile?get=DP04_0046E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(urlH2, function(data){
                value2 = data[1][0];
                pieDataHousing1[1].value = parseInt(value2);
                var urlH3 = "http://api.census.gov/data/2013/acs5/profile?get=DP04_0003E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                $.get(urlH3, function(data){
                  value3 = data[1][0];
                  pieDataHousing1[2].value = parseInt(value3);
                  changeHousing(pieDataHousing1); 
                  console.log(pieDataHousing1);
  
                });
              });             
            }); 
*/            
//Age chart
            var urlA1 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP0_4&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            $.get(urlA1, function(data){
              var value1 = data[1][1];
              barDataAge1[0].value = parseInt(value1);
              var urlA2 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP5_9&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(urlA2, function(data){
                var value2 = data[1][1];
                barDataAge1[1].value = parseInt(value2);
                var urlA3 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP10_14&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                $.get(urlA3, function(data){
                  var value3 = data[1][1];
                  barDataAge1[2].value = parseInt(value3);
                  var urlA4 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP15_19&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                  $.get(urlA4, function(data){
                    var value4 = data[1][1];
                    barDataAge1[3].value = parseInt(value4);
                    var urlA5 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP20_24&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                    $.get(urlA5, function(data){
                      var value5 = data[1][1];
                      barDataAge1[4].value = parseInt(value5);
                      var urlA6 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP25_29&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                      $.get(urlA6, function(data){
                        var value6 = data[1][1];
                        barDataAge1[5].value = parseInt(value6);
                        var urlA7 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP30_34&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                        $.get(urlA7, function(data){
                          var value7 = data[1][1];
                          barDataAge1[6].value = parseInt(value7);
                          var urlA8 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP35_39&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                          $.get(urlA8, function(data){
                            var value8 = data[1][1];
                            barDataAge1[7].value = parseInt(value8);
                            var urlA9 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP40_44&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                            $.get(urlA9, function(data){
                              var value9 = data[1][1];
                              barDataAge1[8].value = parseInt(value9);
                              var urlA10 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP45_49&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                              $.get(urlA10, function(data){
                                var value10 = data[1][1];
                                barDataAge1[9].value = parseInt(value10);
                                var urlA11 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP50_54&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                $.get(urlA11, function(data){
                                  var value11 = data[1][1];
                                  barDataAge1[10].value = parseInt(value11);
                                  var urlA12 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP55_59&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                  $.get(urlA12, function(data){
                                    var value12 = data[1][1];
                                    barDataAge1[11].value = parseInt(value12);
                                    var urlA13 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP60_64&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                    $.get(urlA13, function(data){
                                      var value13 = data[1][1];
                                      barDataAge1[12].value = parseInt(value13);
                                      var urlA14 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP65_69&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                        $.get(urlA14, function(data){
                                          var value14 = data[1][1];
                                          barDataAge1[13].value = parseInt(value14);
                                          var urlA15 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP70_74&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                          $.get(urlA15, function(data){
                                            var value15 = data[1][1];
                                            barDataAge1[14].value = parseInt(value15);
                                            var urlA16 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP75_79&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                            $.get(urlA16, function(data){
                                              var value16 = data[1][1];
                                              barDataAge1[15].value = parseInt(value16);
                                              var urlA17 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP80_84&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                              $.get(urlA17, function(data){
                                                var value17 = data[1][1];
                                                barDataAge1[16].value = parseInt(value17);
                                                var urlA18 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP85_89&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                                $.get(urlA18, function(data){
                                                  var value18 = data[1][1];
                                                  barDataAge1[17].value = parseInt(value18);
                                                    var urlA19 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP90_94&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                                    $.get(urlA19, function(data){
                                                      var value19 = data[1][1];
                                                      barDataAge1[18].value = parseInt(value19);
                                                      var urlA20 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP95_99&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                                      $.get(urlA20, function(data){
                                                        var value20 = data[1][1];
                                                        barDataAge1[19].value = parseInt(value20);
                                                        var urlA21 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP100_&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                                        $.get(urlA21, function(data){
                                                          var value21 = data[1][1];
                                                          barDataAge1[20].value = parseInt(value21);     
                                                          var urlA22 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                                                          $.get(urlA22, function(data){                                        
                                                            mvTotPop = parseInt(data[1][1]).toLocaleString();
															
															barDataAge = barDataAge1;
                                                            changeAge(barDataAge1);                                     
                                                          });
                                                        });                                                            
                                                      });
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });                                                         
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });

//Income chart
            var url1 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,IMR&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(url1, function(data){
              var value1 = data[1][1];
              //console.log("value1:" + value1);
              barDataMR1[0].value = value1;
              var url2 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,MR0_4&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(url2, function(data){
                var value2 = data[1][1];
                barDataMR1[1].value = value2;
				
				var url3 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,IMR_F&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
				$.get(url3, function(data){
					var value3 = data[1][1];
					barDataMR1[2].value = value3;
				    
					var url4 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,FMR0_4&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
					$.get(url4, function(data){
						var value4 = data[1][1];
						barDataMR1[3].value = value4;
				        
						var url5 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,IMR_M&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
						$.get(url5, function(data){
							var value5 = data[1][1];
							barDataMR1[4].value = value5;
                
							var url6 = "http://api.census.gov/data/timeseries/idb/5year?get=NAME,MMR0_4&NAME=" + cntryName + "&time=" + selectedYear + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
							$.get(url6, function(data){
								var value6 = data[1][1];
								barDataMR1[5].value = value6;
									
								barDataMR = barDataMR1;
								changeMR(barDataMR1); 
			                });
		                });
			        });
                });
              });             
            });
/*

//Education chart
            var urlEdu1 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0059E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
            
            $.get(urlEdu1, function(data){
              value1 = data[1][0];
              pieDataEdu1[0].value = parseInt(value1);
              var urlEdu2 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0060E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
              $.get(urlEdu2, function(data){
                value2 = data[1][0];
                pieDataEdu1[1].value = parseInt(value2);
                var urlEdu3 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0061E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                $.get(urlEdu3, function(data){
                  value3 = data[1][0];
                  pieDataEdu1[2].value = parseInt(value3);
                  var urlEdu4 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0062E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                  $.get(urlEdu4, function(data){
                    value4 = data[1][0];
                    pieDataEdu1[3].value = parseInt(value4);
                    var urlEdu5 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0063E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                    $.get(urlEdu5, function(data){
                      value5 = data[1][0];
                      pieDataEdu1[4].value = parseInt(value5);
                      var urlEdu6 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0064E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                      $.get(urlEdu6, function(data){
                        value6 = data[1][0];
                        pieDataEdu1[5].value = parseInt(value6);
                        var urlEdu7 = "http://api.census.gov/data/2013/acs5/profile?get=DP02_0065E&for=tract:" + tractName + "&in=state:"+ stateName + "+county:" + countyName + "&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";
                        $.get(urlEdu7, function(data){
                          value7 = data[1][0];
                          pieDataEdu1[6].value = parseInt(value7);
                          pieDataEdu = pieDataEdu1;
                          changeEdu(pieDataEdu1);   

                          //var tract1 = parseInt(tract.toString().slice(0,4));
                          //var tract2 = tract.toString().substr(4,2);
                          //tract2 = FormatNumberLength(tract2, 2);
               
                        });
                      });
                    });
                  });
                });
              });             
            });             
*/            
    
                          var content = "<br/>Country: " + cntryName ;// +  tract1 + "." + tract2;
						  if (cntryName === 'undefined') $("#iResults").html("Choose a country - click a country on the map or select one from the dropdown list");     
                          else $("#iResults").html(content);       
        //}
     // }); 
      }
//End of Chart

function changeYear(value){
	selectedYear = value;
	showLocation()
}


//Run this whenever the window resizes. We can't resize when the map isn't visible because then it goes crazy when the map is shown
  $(window).resize(function () {
    //if ($('#home:visible').length) {
      resizeMap();
      //console.log("window resized");
    //}
  }); 
resizeMap();

//}); // End of AMD Codes

function fnWindowResized(){
   //console.log($(window).height());
   $("#mapContainer").height = $(window).height();
}



//Open search results panel and tab 
          function openRightPanelSTab() {
            if($("#rightC").hasClass("hidden")) {
              $("#middleC").toggleClass("col-md-12 col-md-8");
              $("#rightC").toggleClass("hidden show");
              $("#rightC").addClass("col-md-4"); 
              if ($(window).width()<992){
                //console.log($(window).height() + $(#navbar).height())
                $('#map').height($(window).height() -50-300);
      map.resize();
                //$("#map").css("height", "50vh")                
              }        
            }
            $('#rightNavTab a[href="#searchResults"]').tab('show');       
          }
//End of Open search results panel and tab

//get rid of remaining tooltips after mouse out event
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var frameidLE = document.getElementById("tipLE");
    if (frameidLE) {
        frameidLE.style.display = "none";
    }
    var frameidEthnic = document.getElementById("tipEthnic");
    if (frameidEthnic) {
        frameidEthnic.style.display = "none";
    }
    var frameidBMR = document.getElementById("tipBMR");
    if (frameidBMR) {
        frameidBMR.style.display = "none";
    }
    var frameidMR = document.getElementById("tipMR");
    if (frameidMR) {
        frameidMR.style.display = "none";
    }
    var frameidAge = document.getElementById("tipAge");
    if (frameidAge) {
        frameidAge.style.display = "none";
    }
})    

    function resizeMap() {
      
      if (($(window).width())<992&&($("#rightC").hasClass("col-md-4"))){
        $('#map').height($(window).height() - $('#navbarHeader').height()-300);
        //$("#map").css("height", "80vh");                
      }
      else {
        $('#map').height($(window).height() - $('#navbarHeader').height());
      }   
    }
