function Get(e){var t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(null),t.responseText}function style(e){return{weight:2,opacity:1,color:"white",dashArray:"3",fillOpacity:.7,fillColor:getColor(e.properties.density)}}function onEachFeature(e,t){t.on({click:highlightFeature})}function highlightFeature(e){selectedLayer&&geojson.resetStyle(selectedLayer),incomingLayer&&map.removeLayer(incomingLayer),e.target&&(selectedLayer=e.target),selectedLayer.setStyle({weight:4,color:"#8A2E00",dashArray:"",fillOpacity:.5}),L.Browser.ie||L.Browser.opera||selectedLayer.bringToFront(),info.update(selectedLayer.feature.properties),showLocation()}function resetHighlight(e){geojson.resetStyle(e.target),info.update()}function getColor(e){return e>1e3?"#800026":e>500?"#BD0026":e>200?"#E31A1C":e>100?"#FC4E2A":e>50?"#FD8D3C":e>20?"#FEB24C":e>10?"#FED976":"#FFEDA0"}function zoomToFeature(e){map.fitBounds(e.target.getBounds())}function changeOpt(e){console.log("vale: "+e),$.getJSON("countries.json",function(t){for(var a=0;a<t.features.length;a++)if(e===t.features[a].properties.name){console.log(t.features[a].geometry);{t.features[a].geometry.coordinates}if(incomingLayer&&map.removeLayer(incomingLayer),incomingLayer=L.GeoJSON.geometryToLayer(t.features[a]),incomingLayer.setStyle({weight:4,color:"#8A2E00",dashArray:"",fillOpacity:.5}),window.map.removeLayer(incomingLayer),incomingLayer.addTo(map),console.log(incomingLayer._latlngs),selectedLayer&&geojson.resetStyle(selectedLayer),incomingLayer._latlngs)console.log("Polygon"),map.fitBounds(incomingLayer._latlngs);else{var r=incomingLayer.getLatLngs();console.log(r);for(var n=[],i=0;i<r.length;i++)i>0&&(n=r[i-1].concat(r[i]));map.fitBounds(n)}console.log(incomingLayer),cntryName=e,showLocation()}})}function zoomToFullExtent(){map.setView([10.91,22.83],2)}function FormatNumberLength(e,t){for(var a=""+e;a.length<t;)a="0"+a;return a}function getDataLE(){return barDataLE}function changeLE(e){var t=d3.scale.linear().domain([0,d3.max(e,function(e){return e.value})]).range([0,heightLE-marginLE.top-marginLE.bottom]),a=d3.scale.linear().domain([0,d3.max(e,function(e){return e.value})]).range([heightLE-marginLE.top-marginLE.bottom,0]),r=myChartLE.selectAll("rect").data(e,keyLE);d3.selectAll(".axisLE").remove(),r.enter().append("rect").attr("class","bar").style("fill",function(e,t){return colorLE(t)}).attr("width",function(){return(widthLE-marginLE.left-marginLE.right)/e.length-barOffsetLE}).attr("x",function(t,a){return(widthLE-marginLE.left-marginLE.right)/e.length*a+marginLE.left}).attr("height",function(e){return t(e.value)}).attr("y",function(e){return heightLE-t(e.value)}).on("mouseover",function(e){d3.select(this).style("opacity",.5),tooltipLE.transition().style("display","block").style("opacity",.9),tooltipLE.html(e.value).style("left",d3.event.pageX+"px").style("top",d3.event.pageY+"px")}).on("mouseout",function(){d3.select(this).style("opacity",1),tooltipLE.style("display","none")}),r.transition().duration(1500).attr("height",function(e){return t(e.value)}).attr("y",function(e){return heightLE-marginLE.top-marginLE.bottom-t(e.value)});var n=d3.svg.axis().scale(xScaleLE).tickFormat(function(t){return e[t].label}).orient("bottom");myChartLE.append("g").attr("class","x axisLE").attr("transform","translate("+marginLE.left+","+(heightLE-marginLE.top-marginLE.bottom)+")").call(n).selectAll(".x text").style("text-anchor","end").attr("dx","-.8em").attr("dy",".15em").attr("transform",function(){return"rotate(-65)"});var i=d3.svg.axis().scale(a).orient("left").ticks(5);myChartLE.append("g").attr("class","y axisLE").attr("transform","translate("+marginLE.left+",0)").call(i)}function getDataEthnic(){return pieDataEthnic}function changeEthnic(){function e(e){return e.startAngle+(e.endAngle-e.startAngle)/2}$("#mValueSexRatio").html("Sex ratio at birth (males per female): "+mvSexRatio);var t=svgEthnic.select(".slices").selectAll("path.slice").data(pieEthnic(pieDataEthnic),keyEthnic);t.enter().insert("path").style("fill",function(e){return colorE(e.data.label)}).attr("class","slice").on("mouseover",function(e){d3.select(this).style("opacity",.5),tooltipEthnic.transition().style("display","block").style("opacity",.9),tooltipEthnic.html(parseInt(e.value).toLocaleString()).style("left",d3.event.pageX+"px").style("top",d3.event.pageY+"px")}).on("mouseout",function(){d3.select(this).style("opacity",1),tooltipEthnic.style("display","none")}),t.transition().duration(1e3).attrTween("d",function(e){this._current=this._current||e;var t=d3.interpolate(this._current,e);return this._current=t(0),function(e){return arcEthnic(t(e))}}),t.exit().remove();var a=svgEthnic.select(".labels").selectAll("text").data(pieEthnic(pieDataEthnic),keyEthnic);a.enter().append("text").attr("dy",".35em").text(function(e){return e.data.label}),a.transition().duration(1e3).attrTween("transform",function(t){this._current=this._current||t;var a=d3.interpolate(this._current,t);return this._current=a(0),function(t){var r=a(t),n=outerArcEthnic.centroid(r);return n[0]=radiusE*(e(r)<Math.PI?1:-1),"translate("+n+")"}}).styleTween("text-anchor",function(t){this._current=this._current||t;var a=d3.interpolate(this._current,t);return this._current=a(0),function(t){var r=a(t);return e(r)<Math.PI?"start":"end"}}),a.exit().remove();var r=svgEthnic.select(".lines").selectAll("polyline").data(pieEthnic(pieDataEthnic),keyEthnic);r.enter().append("polyline"),r.transition().duration(1e3).attrTween("points",function(t){this._current=this._current||t;var a=d3.interpolate(this._current,t);return this._current=a(0),function(t){var r=a(t),n=outerArcEthnic.centroid(r);return n[0]=.95*radiusE*(e(r)<Math.PI?1:-1),[arcEthnic.centroid(r),outerArcEthnic.centroid(r),n]}}),r.exit().remove()}function changeBDM(e){xScaleBDM.domain(d3.range(e.length));var t=Math.abs(d3.min(e,function(e){return e.value})),a=d3.min(e,function(e){return e.value});a>0&&(t=0);var r=Math.abs(d3.max(e,function(e){return e.value}));yScaleBDM.domain([-t,r]),d3.selectAll(".axisBDM").remove(),svgBDM.selectAll(".bar").data(e).enter().append("rect").attr("class",function(e){return e.value<0?"bar negative":"bar positive"}).attr("y",function(e){return yScaleBDM(Math.max(0,e.value))}).attr("x",function(e,t){return xScaleBDM(t)}).attr("height",function(e){return Math.abs(yScaleBDM(e.value)-yScaleBDM(0))}).attr("width",xScaleBDM.rangeBand()).style("fill",function(e,t){return colorBDM(t)}).on("mouseover",function(e){d3.select(this).style("opacity",.5),tooltipBMR.transition().style("display","block").style("opacity",.9),tooltipBMR.html(e.value).style("left",d3.event.pageX+"px").style("top",d3.event.pageY+"px")}).on("mouseout",function(){d3.select(this).style("opacity",1),tooltipBMR.style("display","none")}),svgBDM.selectAll(".bar").transition().duration(1500).attr("height",function(e){return Math.abs(yScaleBDM(e.value)-yScaleBDM(0))}).attr("y",function(e){return yScaleBDM(Math.max(0,e.value))}).delay(function(e,t){return 20*t}).ease("elastic"),svgBDM.append("g").attr("class","x axisBDM").call(yAxis),svgBDM.append("g").attr("class","y axisBDM").append("line").attr("y1",yScaleBDM(0)).attr("y2",yScaleBDM(0)).attr("x1",0).attr("x2",widthBDM);var n=function(e){return e.label},i=(svgBDM.selectAll("rect").data(e,n),d3.svg.axis().scale(xScaleBDM).tickFormat(function(t){return e[t].label}).orient("bottom"));svgBDM.append("g").attr("class","x axisBDM").attr("id","xLabelBDM").attr("transform","translate("+marginBDM.left+","+heightBDM+")").call(i).selectAll(".x text").style("text-anchor","end").attr("dx","-.8em").attr("dy",".15em").attr("transform",function(){return"rotate(-65)"}),d3.select("#xLabelBDM").select("path").remove()}function getDataAge(){return barDataAge}function changeAge(e){$("#mValueTotPop").html("Total Population: "+mvTotPop);var t=d3.scale.linear().domain([0,d3.max(e,function(e){return e.value})]).range([0,heightA-margin.top-margin.bottom]),a=d3.scale.linear().domain([0,d3.max(e,function(e){return e.value})]).range([heightA-margin.top-margin.bottom,0]),r=myChartAge.selectAll("rect").data(e,keyAge);d3.selectAll(".axis").remove(),r.enter().append("rect").attr("class","bar").style("fill",function(e,t){return colorA(t)}).attr("width",function(){return(widthA-margin.left-margin.right)/e.length-barOffset}).attr("x",function(t,a){return(widthA-margin.left-margin.right)/e.length*a+margin.left}).attr("height",function(e){return t(e.value)}).attr("y",function(e){return heightA-t(e.value)}).on("mouseover",function(e){d3.select(this).style("opacity",.5),tooltipAge.transition().style("display","block").style("opacity",.9),tooltipAge.html(parseInt(e.value).toLocaleString()).style("left",d3.event.pageX+"px").style("top",d3.event.pageY+"px")}).on("mouseout",function(){d3.select(this).style("opacity",1),tooltipAge.style("display","none")}),r.transition().duration(750).attr("height",function(e){return t(e.value)}).attr("y",function(e){return heightA-margin.top-margin.bottom-t(e.value)});var n=d3.svg.axis().scale(xScale).tickFormat(function(t){return e[t].label}).orient("bottom");myChartAge.append("g").attr("class","x axis").attr("transform","translate("+margin.left+","+(heightA-margin.top-margin.bottom)+")").call(n).selectAll(".x text").style("text-anchor","end").attr("dx","-.8em").attr("dy",".15em").attr("transform",function(){return"rotate(-65)"});var i=d3.svg.axis().scale(a).orient("left").ticks(5);myChartAge.append("g").attr("class","y axis").attr("transform","translate("+margin.left+",0)").call(i)}function changeMR(e){xScaleMR.domain(d3.range(e.length));var t=Math.abs(d3.min(e,function(e){return e.value})),a=d3.min(e,function(e){return e.value});a>0&&(t=0);var r=Math.abs(d3.max(e,function(e){return e.value}));yScaleMR.domain([-t,r]),d3.selectAll(".axisMR").remove(),svgMR.selectAll(".bar").data(e).enter().append("rect").attr("class",function(e){return e.value<0?"bar negative":"bar positive"}).attr("y",function(e){return yScaleMR(Math.max(0,e.value))}).attr("x",function(e,t){return xScaleMR(t)}).attr("height",function(e){return Math.abs(yScaleMR(e.value)-yScaleMR(0))}).attr("width",xScaleMR.rangeBand()).style("fill",function(e,t){return colorMR(t)}).on("mouseover",function(e){d3.select(this).style("opacity",.5),tooltipMR.transition().style("display","block").style("opacity",.9),tooltipMR.html(e.value).style("left",d3.event.pageX+"px").style("top",d3.event.pageY+"px")}).on("mouseout",function(){d3.select(this).style("opacity",1),tooltipMR.style("display","none")}),svgMR.selectAll(".bar").transition().duration(1500).attr("height",function(e){return Math.abs(yScaleMR(e.value)-yScaleMR(0))}).attr("y",function(e){return yScaleMR(Math.max(0,e.value))}).delay(function(e,t){return 20*t}).ease("elastic"),svgMR.append("g").attr("class","x axisMR").call(yAxis),svgMR.append("g").attr("class","y axisMR").append("line").attr("y1",yScaleMR(0)).attr("y2",yScaleMR(0)).attr("x1",0).attr("x2",widthMR);var n=function(e){return e.label},i=(svgMR.selectAll("rect").data(e,n),d3.svg.axis().scale(xScaleMR).tickFormat(function(t){return e[t].label}).orient("bottom"));svgMR.append("g").attr("class","x axisMR").attr("id","xLabelMR").attr("transform","translate("+marginMR.left+","+heightMR+")").call(i).selectAll(".x text").style("text-anchor","end").attr("dx","-.8em").attr("dy",".15em").attr("transform",function(){return"rotate(-65)"}),d3.select("#xLabelMR").select("path").remove()}function showLocation(){(countries="undefined")&&$("#iResults").html("Choose a country.");var e=[{label:"Life Expectancy",value:0},{label:"Life Expectancy:Female",value:0},{label:"Life Expectancy:Male",value:0}],t=[{label:"Birth Rate",value:0},{label:"Death Rate",value:0},{label:"Migration Rate",value:0}],a=[{label:"Female Pop.",value:0},{label:"Male Pop.",value:0}],r=[{label:"under5",value:0},{label:"5 - 9",value:0},{label:"10 - 14",value:0},{label:"15 - 19",value:0},{label:"20 - 24",value:0},{label:"25 - 29",value:0},{label:"30 - 34",value:0},{label:"35 - 39",value:0},{label:"40 - 44",value:0},{label:"45 - 49",value:0},{label:"50 - 54",value:0},{label:"55 - 59",value:0},{label:"60 - 64",value:0},{label:"65 - 69",value:0},{label:"70 - 74",value:0},{label:"75 - 79",value:0},{label:"80 - 84",value:0},{label:"85 - 89",value:0},{label:"90 - 94",value:0},{label:"95 - 99",value:0},{label:"100over",value:0}],n=[{label:"Mortality Rate - Infant",value:37.64},{label:"Mortality Rate - under 5",value:12.9},{label:"Mortality Rate - Infant (Female)",value:20.64},{label:"Mortality Rate - under 5 (Female)",value:12.9},{label:"Mortality Rate - Infant (Male)",value:37.64},{label:"Migration Rate - under 5 (Male)",value:-10.22}],i="http://api.census.gov/data/timeseries/idb/5year?get=E0&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(i,function(t){var a=t[1][0];e[0].value=a;var r="http://api.census.gov/data/timeseries/idb/5year?get=E0_F&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(r,function(t){var a=t[1][0];e[1].value=a;var r="http://api.census.gov/data/timeseries/idb/5year?get=E0_M&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(r,function(t){var a=t[1][0];e[2].value=a,pieData=e,changeLE(e)})})});var l="http://api.census.gov/data/timeseries/idb/5year?get=NAME,FPOP&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(l,function(e){var t=e[1][1];a[0].value=t;var r="http://api.census.gov/data/timeseries/idb/5year?get=NAME,MPOP&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(r,function(e){var t=e[1][1];a[1].value=t,pieDataEthnic=a;var r="http://api.census.gov/data/timeseries/idb/5year?get=NAME,SRB&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(r,function(e){mvSexRatio=e[1][1],changeEthnic(a)})})});var i="http://api.census.gov/data/timeseries/idb/5year?get=NAME,CBR&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(i,function(e){var a=e[1][1];t[0].value=a;var r="http://api.census.gov/data/timeseries/idb/5year?get=NAME,CDR&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(r,function(e){var a=e[1][1];t[1].value=a;var r="http://api.census.gov/data/timeseries/idb/5year?get=NAME,NMR&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(r,function(e){var a=e[1][1];t[2].value=a,barDataBDM=t,changeBDM(t)})})});var c="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP0_4&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(c,function(e){var t=e[1][1];r[0].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP5_9&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[1].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP10_14&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[2].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP15_19&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[3].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP20_24&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[4].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP25_29&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[5].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP30_34&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[6].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP35_39&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[7].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP40_44&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[8].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP45_49&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[9].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP50_54&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[10].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP55_59&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[11].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP60_64&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[12].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP65_69&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[13].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP70_74&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[14].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP75_79&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[15].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP80_84&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[16].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP85_89&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[17].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP90_94&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[18].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP95_99&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[19].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP100_&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];r[20].value=parseInt(t);var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,POP&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){mvTotPop=parseInt(e[1][1]).toLocaleString(),barDataAge=r,changeAge(r)})})})})})})})})})})})})})})})})})})})})})});var i="http://api.census.gov/data/timeseries/idb/5year?get=NAME,IMR&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(i,function(e){var t=e[1][1];n[0].value=t;var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,MR0_4&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];n[1].value=t;var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,IMR_F&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];n[2].value=t;var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,FMR0_4&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];n[3].value=t;var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,IMR_M&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];n[4].value=t;var a="http://api.census.gov/data/timeseries/idb/5year?get=NAME,MMR0_4&NAME="+cntryName+"&time="+selectedYear+"&key=0facf9a8f4b6ae0f76ce47e6dee0683e47c0bdcc";$.get(a,function(e){var t=e[1][1];n[5].value=t,barDataMR=n,changeMR(n)})})})})})});var o="<br/>Country: "+cntryName;$("#iResults").html("undefined"===cntryName?"Choose a country - click a country on the map or select one from the dropdown list":o)}function changeYear(e){selectedYear=e,showLocation()}function fnWindowResized(){$("#mapContainer").height=$(window).height()}function openRightPanelSTab(){$("#rightC").hasClass("hidden")&&($("#middleC").toggleClass("col-md-12 col-md-8"),$("#rightC").toggleClass("hidden show"),$("#rightC").addClass("col-md-4"),$(window).width()<992&&($("#map").height($(window).height()-50-300),map.resize())),$('#rightNavTab a[href="#searchResults"]').tab("show")}function resizeMap(){$("#map").height($(window).width()<992&&$("#rightC").hasClass("col-md-4")?$(window).height()-$("#navbarHeader").height()-300:$(window).height()-$("#navbarHeader").height())}var statesData="countries.json",selectedYear,json_obj=JSON.parse(Get(statesData)),selectedLayer;map=L.map("map").setView([10.91,22.83],2),L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',maxZoom:18}).addTo(map);var geojson;geojson=L.geoJson(json_obj,{style:style,onEachFeature:onEachFeature}).addTo(map);var info=L.control();info.onAdd=function(){return this._div=L.DomUtil.create("div","info"),this.update(),this._div};var cntryName;info.update=function(e){cntryName=e.name,console.log(cntryName)};var stopListHtml="<label for='stopList' class='select' style='height:0px;font-size:0px;'></label><select name='stopList' id='stopList' data-mini='true' onchange='changeOpt(value);'><option value='0'>Click a country on the map or select one from the list</option>";$.getJSON("countries.json",function(e){for(var t=0;t<e.features.length;t++)stopListHtml+="<option value='"+e.features[t].properties.name+"'>"+e.features[t].properties.name+"</option>";stopListHtml+="</select>",$("#stopListG").html(stopListHtml)});var incomingLayer;Number.prototype.formatMoney=function(e,t,a){var r=this,e=isNaN(e=Math.abs(e))?2:e,t=void 0==t?".":t,a=void 0==a?",":a,n=0>r?"-":"",i=parseInt(r=Math.abs(+r||0).toFixed(e))+"",l=(l=i.length)>3?l%3:0;return n+(l?i.substr(0,l)+a:"")+i.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+a)+(e?t+Math.abs(r-i).toFixed(e).slice(2):"")};var barDataLE,barDataLE0=[{label:"Life Expectancy",value:0},{label:"Life Expectancy:Female",value:0},{label:"Life Expectancy:Male",value:0}];barDataLE=barDataLE0;var heightLE=400,widthLE=600,barWidthLE=30,barOffsetLE=10,paddingLE=50,marginLE={top:30,right:50,bottom:130,left:30},keyLE=function(e){return e.label},colorLE=d3.scale.linear().domain([0,barDataLE.length]).range(["#268bd2","#85992c"]),xScaleLE=d3.scale.ordinal().domain(d3.range(0,barDataLE.length)).rangeBands([0,widthLE-marginLE.left-marginLE.right]),myChartLE=d3.select("#chart").append("svg").attr("width",widthLE).attr("height",heightLE).append("g").attr("width",widthLE-marginLE.left-marginLE.right).attr("height",heightLE-marginLE.top-marginLE.bottom).attr("transform","translate("+marginLE.left+","+marginLE.top+")"),key=function(e){return e.data.label},tooltipLE=d3.select("body").append("div").style("position","absolute").style("padding","0 10px").style("background","white").style("opacity",0).attr("class","d3-tip").attr("id","tipLE");changeLE(barDataLE0),medianLEValue=.8,$("#chartRace").append("<div id='chartEthnic'  style='float:left'></div>");var pieDataEthnic,widthE=660,heightE=300,radiusE=Math.min(widthE,heightE)/2,colorE=d3.scale.ordinal().range(["#bd3613","#2176c7"]),pieDataEthnic0=[{label:"Female Pop.",value:5e3},{label:"Male Pop.",value:5e3}];pieDataEthnic=pieDataEthnic0;var pieEthnic=d3.layout.pie().sort(null).value(function(e){return e.value}),svgEthnic=d3.select("#chartEthnic").append("svg").attr("width",widthE).attr("height",heightE).append("g").attr("id","pieChartEthnic");svgEthnic.append("g").attr("class","slices"),svgEthnic.append("g").attr("class","labels"),svgEthnic.append("g").attr("class","lines");var arcEthnic=d3.svg.arc().outerRadius(.8*radiusE).innerRadius(.4*radiusE),outerArcEthnic=d3.svg.arc().innerRadius(.9*radiusE).outerRadius(.9*radiusE);svgEthnic.attr("transform","translate("+widthE/2+","+heightE/2+")");var keyEthnic=function(e){return e.data.label},tooltipEthnic=d3.select("body").append("div").style("position","absolute").style("padding","0 10px").style("background","white").style("opacity",0).attr("class","d3-tip").attr("id","tipEthnic");mvSexRatio=1,$("#chartEthnic").append("<div id='mValueSexRatio' class='medianValue'>Sex ratio at birth (males per females): "+mvSexRatio+"</div>"),changeEthnic(getDataEthnic());var barDataBDM,barDataBDM0=[{label:"Birth Rate",value:0},{label:"Death Rate",value:0},{label:"Migration Rate",value:0}];barDataBDM=barDataBDM0;var marginBDM={top:30,right:10,bottom:120,left:30},widthBDM=600-marginBDM.left-marginBDM.right,heightBDM=400-marginBDM.top-marginBDM.bottom,colorBDM=d3.scale.ordinal().range(["#17becf","#ff7f0e","#2ca02c"]),yScaleBDM=d3.scale.linear().range([heightBDM,0]).nice();console.log("y:"+yScaleBDM);var xScaleBDM=d3.scale.ordinal().rangeRoundBands([0,widthBDM],.2),yAxis=d3.svg.axis().scale(yScaleBDM).orient("left"),svgBDM=d3.select("#chartHousing").append("svg").attr("width",widthBDM+marginBDM.left+marginBDM.right).attr("height",heightBDM+marginBDM.top+marginBDM.bottom).append("g").attr("transform","translate("+marginBDM.left+","+marginBDM.top+")"),tooltipBMR=d3.select("body").append("div").style("position","absolute").style("padding","0 10px").style("background","white").style("opacity",0).attr("class","d3-tip").attr("id","tipBMR");$("#chartHousing").append("<div id='mValueBDM' class='medianValue'>Births/Deaths/Net Migration per 1,000 population</div>"),changeBDM(barDataBDM0);var barDataAge,barDataAge0=[{label:"under5",value:0},{label:"5 - 9",value:0},{label:"10 - 14",value:0},{label:"15 - 19",value:0},{label:"20 - 24",value:0},{label:"25 - 29",value:0},{label:"30 - 34",value:0},{label:"35 - 39",value:0},{label:"40 - 44",value:0},{label:"45 - 49",value:0},{label:"50 - 54",value:0},{label:"55 - 59",value:0},{label:"60 - 64",value:0},{label:"65 - 69",value:0},{label:"70 - 74",value:0},{label:"75 - 79",value:0},{label:"80 - 84",value:0},{label:"85 - 89",value:0},{label:"90 - 94",value:0},{label:"95 - 99",value:0},{label:"100over",value:0}];barDataAge=barDataAge0;var heightA=400,widthA=600,barWidth=30,barOffset=2,padding=50,margin={top:30,right:50,bottom:50,left:50};console.log("margin.top"+margin.top);var keyAge=function(e){return e.label},colorA=d3.scale.linear().domain([0,.33*barDataAge.length,.66*barDataAge.length,barDataAge.length]).range(["#B58929","#c61c6f","#268bd2","#85992c"]),xScale=d3.scale.ordinal().domain(d3.range(0,barDataAge.length)).rangeBands([0,widthA-margin.left-margin.right]),myChartAge=d3.select("#chartAge").append("svg").attr("width",widthA).attr("height",heightA).append("g").attr("width",widthA-margin.left-margin.right).attr("height",heightA-margin.top-margin.bottom).attr("transform","translate("+margin.left+","+margin.top+")");mvTotPop=0,$("#chartAge").append("<div id='mValueTotPop' class='medianValue'>Total Population "+mvTotPop+"</div>");var tooltipAge=d3.select("body").append("div").style("position","absolute").style("padding","0 10px").style("background","white").style("opacity",0).attr("class","d3-tip").attr("id","tipAge");changeAge(barDataAge0);var barDataMR,barDataMR0=[{label:"MortalityRate-Infant",value:0},{label:"MortalityRate-under5",value:0},{label:"MortalityRate-Infant(Female)",value:0},{label:"MortalityRate-under5(Female)",value:0},{label:"MortalityRate-Infant(Male)",value:0},{label:"MigrationRate-under5(Male)",value:0}];barDataMR=barDataMR0;var marginMR={top:30,right:10,bottom:200,left:30},widthMR=600-marginMR.left-marginMR.right,heightMR=500-marginMR.top-marginMR.bottom,colorMR=d3.scale.ordinal().range(["#7b7f15","#cfd369","#801515","#d46a6a","#113b51","#477187"]),yScaleMR=d3.scale.linear().range([heightMR,0]).nice();console.log("y:"+yScaleMR);var xScaleMR=d3.scale.ordinal().rangeRoundBands([0,widthMR],.2),yAxis=d3.svg.axis().scale(yScaleMR).orient("left"),svgMR=d3.select("#chartIncome").append("svg").attr("width",widthMR+marginMR.left+marginMR.right).attr("height",heightMR+marginMR.top+marginMR.bottom).append("g").attr("transform","translate("+marginMR.left+","+marginMR.top+")"),tooltipMR=d3.select("body").append("div").style("position","absolute").style("padding","0 10px").style("background","white").style("opacity",0).attr("class","d3-tip").attr("id","tipMR");changeMR(barDataMR0),selectedYear=2015,$(window).resize(function(){resizeMap()}),resizeMap(),$('a[data-toggle="tab"]').on("shown.bs.tab",function(){var e=document.getElementById("tipLE");e&&(e.style.display="none");var t=document.getElementById("tipEthnic");t&&(t.style.display="none");var a=document.getElementById("tipBMR");a&&(a.style.display="none");var r=document.getElementById("tipMR");r&&(r.style.display="none");var n=document.getElementById("tipAge");n&&(n.style.display="none")});