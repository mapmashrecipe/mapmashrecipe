var map, places, infowindow, geocoder,addressMarker, chart, destvalue;
var markers = [];
var cityMarkers = [];
var privateMarkers = [];
var pharmMarkers = [];
var allrecMarkers = [];
var addressMarkers=[];
var autocomplete;
var infowindow = new google.maps.InfoWindow();
var infoBubble = new InfoBubble();
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
  
var cityserviceLayer = new google.maps.KmlLayer('http://www.jihoonson.com/CApps/CityRecServiceArea2.kmz', {clickable:false, suppressInfoWindows:true, preserveViewport:true});
var privserviceLayer = new google.maps.KmlLayer('http://www.jihoonson.com/CApps/PrivRecServiceArea2.kmz', {clickable:false, suppressInfoWindows:true, preserveViewport:true});
var pharmserviceLayer = new google.maps.KmlLayer('http://www.jihoonson.com/CApps/PharmRecServiceArea2.kmz', {clickable:false, suppressInfoWindows:true, preserveViewport:true});
var cpserviceLayer = new google.maps.KmlLayer('http://www.jihoonson.com/CApps/AllrecRecServiceArea2.kmz', {clickable:false, suppressInfoWindows:true, preserveViewport:true});
	
google.load("visualization", "1", {packages:["corechart"]});

function initialize() {
  geocoder = new google.maps.Geocoder();
  directionsDisplay = new google.maps.DirectionsRenderer();

  var mapTypeControlOpts = {
	mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.TERRAIN],
	position: google.maps.ControlPosition.TOP_RIGHT,
	style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
  };
  var chicago = new google.maps.LatLng(41.875696,-87.624207);
  
  var myMapOptions = {
    zoom: 11,
    center: chicago,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	mapTypeControlOptions: mapTypeControlOpts,
	panControl:false,
	zoomControl:true,
	zoomControlOptions:{style: google.maps.ZoomControlStyle.DEFAULT,
	  position: google.maps.ControlPosition.RIGHT_TOP},
	scaleControl:true,
	scaleControlOptions: {position:google.maps.ControlPosition.BOTTOM_CENTER}
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), myMapOptions);	

  var cityBoundaryLayer = new google.maps.KmlLayer('http://data.cityofchicago.org/api/file_data/FbjscW4rNuQOuoguwcAn-EXO8wY9k7y0gijm0Od3OKc?filename=Kmlcityboundary.kml', {clickable:false, suppressInfoWindows:true, preserveViewport:true});
  cityBoundaryLayer.setMap(map);

  google.maps.event.addListener(map, 'click', function(event){
    deleteAddressMarkers();
    addressMarker = new google.maps.Marker({
      map: map,
	  icon: new google.maps.MarkerImage("images/bulbgrey.png", new google.maps.Size(48, 48)),
      position: event.latLng,
      draggable: true,
	  animation: google.maps.Animation.DROP
    });
	destvalue = document.getElementById('dest').options[document.getElementById('dest').selectedIndex].value;
	google.maps.event.addListener(addressMarker, 'dragend', function(event) {
		  destvalue = document.getElementById('dest').options[document.getElementById('dest').selectedIndex].value;
	      find_closest_marker(event,destvalue);
    });
    addressMarkers.push(addressMarker);
    find_closest_marker(event,destvalue);
	
  });

  downloadUrl("RecycleAddressData2.php", function(data) {
	    
		var xmlDoc = xmlParse(data);
		var records = xmlDoc.getElementsByTagName("pt");

		for (var i = 0; i < records.length; i++) {
		  var rec = records[i];	  
		  var id = rec.getAttribute("ID");
		  var name = rec.getAttribute("Name");
		  var type = rec.getAttribute("Type");
		  var addr = rec.getAttribute("Address");
		  var lat = rec.getAttribute("Lat");
		  var lng = rec.getAttribute("Lng");
		  var phone = rec.getAttribute("Phone");
		  var hrs = rec.getAttribute("Hours");
		  var cbrd = rec.getAttribute("Cardboard");
		  var gp = rec.getAttribute("GlassPlastic");
		  var met = rec.getAttribute("Metals");
		  //set google point
		  var latlng = new google.maps.LatLng(lat, lng);
		
          //define two information window htmls for two tabs		
		  var infoRecycle1 = "<div class='phoneytext'><ul><h3>" + name + "</h3><li>"
			+ "<b>Type: </b>" + type + "</li><li>"
			+ "<b>Address: </b>" + addr +"</li><li>"
			+ "<b>Phone: </b>" + phone +"</li><li>"
			+ "<b>Hours: </b>" + hrs +"</li></ul></div>";
		  
		  if (type=="Pharmaceuticals") {
		    var infoRecycle2 = "<div class='phoneytext'><ul><li>"
			  + "<b>Pharmaceuticals: </b>Unused or expired prescription and over-the-counter medications. Syringes, Needles, Medical waste, and Medical equipment are not accepted. </li></ul></div>";
		  }
		  else {
		    var infoRecycle2 = "<div class='phoneytext'><ul><li>"
			  + "<b>Cardboard: </b>" + cbrd + "</li><li>"
			  + "<b>Glass&Plastic: </b>" + gp +"</li><li>"
			  + "<b>Metals: </b>" + met +"</li></ul></div>";
		  }
		  
			
		  createMarker(latlng,infoRecycle1,infoRecycle2,name,type);	    	  
		}
 });
  loadCnty(document.getElementById('cnty').options[document.getElementById('cnty').selectedIndex].value)
}

//display chart
function loadCnty(value){
	downloadUrl("phptest1.php", function(data) {	    
		var xmlDoc = xmlParse(data);
		var records = xmlDoc.getElementsByTagName("geog");		

		for (var i = 0; i < records.length; i++) {
		  var rec = records[i];	  
		  var id = rec.getAttribute("id");
		  var name = rec.getAttribute("name");
		  if (name == value) {
		    
            var recordsitem = rec.getElementsByTagName("item");
			var length = recordsitem.length;var data = new google.visualization.DataTable();
			data.addColumn('string', 'Year');
			data.addColumn('number', 'Capacity');
			data.addRows(length);
			for (var j=0; j<length; j++){
			  var recitem = recordsitem[j];
			  var datid = recitem.getAttribute("datid").slice(16);
			  var val = parseFloat(recitem.getAttribute("val"));
			  data.setValue(j,0, datid);
			  data.setValue(j,1, val);
			}		        
			chart = new google.visualization.BarChart(document.getElementById('chart_div'));
			chart.draw(data, {width: 420, height: 180, title: 'Landfill Capacity', colors:['green'],
              vAxis: {title: 'Year', titleTextStyle: {color: 'red'}}
            });
	
		  }
		}
	});  	
}
//show service area
function showServiceArea(value) {
  if (value == "city"){
    cityserviceLayer.setMap(map);
    privserviceLayer.setMap(null);
    pharmserviceLayer.setMap(null);
    cpserviceLayer.setMap(null);
  }
  else if (value == "private") {
    cityserviceLayer.setMap(null);
    privserviceLayer.setMap(map);
    pharmserviceLayer.setMap(null);
    cpserviceLayer.setMap(null);
  }
  else if (value == "pharm") {
    cityserviceLayer.setMap(null);
    privserviceLayer.setMap(null);
    pharmserviceLayer.setMap(map);
    cpserviceLayer.setMap(null);
  }
  else {
    cityserviceLayer.setMap(null);
    privserviceLayer.setMap(null);
    pharmserviceLayer.setMap(null);
    cpserviceLayer.setMap(map);
  }
}

//search address
function codeAddress() {
    deleteAddressMarkers();
    var address = document.getElementById("address").value;
	destvalue = document.getElementById('dest').options[document.getElementById('dest').selectedIndex].value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        addressMarker = new google.maps.Marker({
            map: map, 
			icon: new google.maps.MarkerImage("images/bulbgrey.png", new google.maps.Size(48, 48)),
            position: results[0].geometry.location,
            draggable: true,
			animation: google.maps.Animation.DROP
        });
		google.maps.event.addListener(addressMarker, 'dragend', function(event) {
	      find_closest_marker(event,destvalue);
        });
		addressMarkers.push(addressMarker);
		find_closest_marker(addressMarker,destvalue);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });	
}

//create recycling markers
function createMarker(latlng,info1,info2,name,type){
  if (type=="CityOfChicago") {
    var markerImage = new google.maps.MarkerImage("images/recycleY48.png",
      new google.maps.Size(48, 48));

	var marker = new google.maps.Marker({
	  position: latlng,
	  icon: markerImage,
	  title: name,
	  map:map
	});  
    markers.push(marker);
	cityMarkers.push(marker);
	allrecMarkers.push(marker);
  }
  else if (type=="Pharmaceuticals") {
    var markerImage = new google.maps.MarkerImage("images/tubeY48.png",
      new google.maps.Size(48, 48));

	var marker = new google.maps.Marker({
	  position: latlng,
	  icon: markerImage,
	  title: name,
	  map:map
	});  
    markers.push(marker);
	pharmMarkers.push(marker);
  }	
  else if (type=="Private") {
    var markerImage = new google.maps.MarkerImage("images/recycleB48.png",
      new google.maps.Size(48, 48));
	var marker = new google.maps.Marker({
	  position: latlng,
	  icon: markerImage,
	  title: name,
	  map:map
	});  
    markers.push(marker);
	privateMarkers.push(marker);
	allrecMarkers.push(marker);
  }	  
	
	  var infoBubbleOptions = {
        maxWidth: 400,
		maxHeight: 600,
		  backgroundColor: '#365E0C ',
		  borderRadius: 10,
		  borderWidth: 1,
		  borderColor: '#76CE16 ',
		  shadowStyle:1,
		  padding:0,
		  arrowStyle:2,
		  arrowPosition: 75,
		  arrowSize: 20,
		  backgroundClassName: 'phoney'		  
        };

	  google.maps.event.addListener(marker, 'click', function(){			
		//to open only one infobubble,close the existing one and set a new infobubble
		infoBubble.close();
		infoBubble = new InfoBubble();
		infoBubble.setOptions(infoBubbleOptions);
		infoBubble.addTab('<div class="phoneytab">Center</div>', info1);
		infoBubble.addTab('<div class="phoneytab">Materials</div>', info2);	
		infoBubble.open(map,marker);
	  });

}

function deleteAddressMarkers(){
	if (addressMarkers){
		for (f in addressMarkers){
			addressMarkers[f].setMap(null);
		}
		addressMarkers.length = 0;
	}
}

function deleteall(){
  //delete kml layers
  cityserviceLayer.setMap(null);
  privserviceLayer.setMap(null);
  pharmserviceLayer.setMap(null);
  cpserviceLayer.setMap(null);
	
  deleteAddressMarkers();
  //document.getElementById("directions-panel").style.display = "none";
  $( "#directions-panel" ).dialog('close');
  if (directionsDisplay) directionsDisplay.setMap(null);
}

//find the nearest recycling markers
function rad(x) {return x*Math.PI/180;}
function find_closest_marker(event, value){
  if (value=="AllRec"){
    find_closest_markerAllRec( event );
  }
  else if (value=="Private"){
    find_closest_markerPrivate( event );
  }
  else if (value=="Pharm"){
    find_closest_markerPharm( event );
  }
  else {
    find_closest_markerCity( event ); 
  }
}  
function find_closest_markerCity( event ) {

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    if (typeof(event.latLng) != "undefined") {
	  var lat = event.latLng.lat();
      var lng = event.latLng.lng();
	}
	else {
	  var lat = event.getPosition().lat();
	  var lng = event.getPosition().lng();
	}
    var R = 6371;
    var distances = [];
    var closest = -1;

    for( i=0;i<cityMarkers.length; i++ ) {
        var mlat = cityMarkers[i].getPosition().lat();
        var mlng = cityMarkers[i].getPosition().lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
	calcRoute(cityMarkers[closest]);
}
function find_closest_markerPrivate( event ) {

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    if (typeof(event.latLng) != "undefined") {
	  var lat = event.latLng.lat();
      var lng = event.latLng.lng();
	}
	else {
	  var lat = event.getPosition().lat();
	  var lng = event.getPosition().lng();
	}
    var R = 6371;
    var distances = [];
    var closest = -1;

    for( i=0;i<privateMarkers.length; i++ ) {
        var mlat = privateMarkers[i].getPosition().lat();
        var mlng = privateMarkers[i].getPosition().lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
	calcRoute(privateMarkers[closest]);
}
function find_closest_markerAllRec( event ) {

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    if (typeof(event.latLng) != "undefined") {
	  var lat = event.latLng.lat();
      var lng = event.latLng.lng();
	}
	else {
	  var lat = event.getPosition().lat();
	  var lng = event.getPosition().lng();
	}
    var R = 6371;
    var distances = [];
    var closest = -1;

    for( i=0;i<allrecMarkers.length; i++ ) {
        var mlat = allrecMarkers[i].getPosition().lat();
        var mlng = allrecMarkers[i].getPosition().lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
	calcRoute(allrecMarkers[closest]);
}
function find_closest_markerPharm( event ) {

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    if (typeof(event.latLng) != "undefined") {
	  var lat = event.latLng.lat();
      var lng = event.latLng.lng();
	}
	else {
	  var lat = event.getPosition().lat();
	  var lng = event.getPosition().lng();
	}
    var R = 6371;
    var distances = [];
    var closest = -1;

    for( i=0;i<pharmMarkers.length; i++ ) {
        var mlat = pharmMarkers[i].getPosition().lat();
        var mlng = pharmMarkers[i].getPosition().lng();
        var dLat  = rad(mlat - lat);
        var dLong = rad(mlng - lng);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(lat)) * Math.cos(rad(lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        distances[i] = d;
        if ( closest == -1 || d < distances[closest] ) {
            closest = i;
        }
    }
	calcRoute(pharmMarkers[closest]);
}

//calculate route using google directionsService
function calcRoute(theMarker) {
  var start = addressMarker.getPosition();
  var end = theMarker.getPosition();
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
	  //document.getElementById("directions-panel").style.display = "block";
	  $( "#directions-panel" ).dialog('open');
    }
  });
}

//create the chart
function chartPoll(a,b,c,name){
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Party');
	data.addColumn('number', 'Poll');
	data.addRows(3);
	data.setValue(0, 0, "Dem");
	data.setValue(0, 1, parseFloat(a));
	data.setValue(1, 0, "Rep");
	data.setValue(1, 1, parseFloat(b));
	data.setValue(2, 0, "Other");
	data.setValue(2, 1, parseFloat(c));
	
	//in case the name variable is "Total" and not a county name, title is set to be "Iowa State" and if it is a county name, 'County' is attached to the name as a title.
	if (name != "Total"){
		chartTitle = name + " County";
	}
	else {
		chartTitle = "Iowa State (Total)"
	}
	chart = new google.visualization.PieChart(document.getElementById('chart_div'));
	
	//draw chart and set options for chart variables
	chart.draw(data, {width: 300, height: 230, title:chartTitle, is3D:true, backgroundColor:'#FDEEF4',titleTextStyle:{color: 'green', fontName: 'Vernada', fontSize: 22 }});
}	

//create a direction panel window
$(function() {
  $( "#directions-panel" ).dialog({ autoOpen: false });
});

//legend menu
	$(document).ready(function() {
	  $(".topMenuAction1").click( function() {
		if ($("#openCloseIdentifier1").is(":hidden")) {
		  $("#slider1").animate({ 
			marginTop: "-186px"
		  }, 500 );
	      $("#topMenuImage1").html('<img src="images/legend_p1.png"/>');
		  $("#openCloseIdentifier1").show();
		} else {
		  $("#slider1").animate({ 
			marginTop: "55px"
		  }, 500 );
		  $("#topMenuImage1").html('<div id="close"><img src="images/closeNP.png" alt="close"/></div>');
		  $("#openCloseIdentifier1").hide();
		}
	  });
	});
	
//logo menu
	$(document).ready(function() {
	  $(".topMenuAction2").click( function() {
		if ($("#openCloseIdentifier2").is(":hidden")) {
		  $("#slider2").animate({ 
			marginLeft: "-430px"
		  }, 500 );
	      $("#topMenuImage2").html('<img src="images/landfillB.png"/>');
		  $("#openCloseIdentifier2").show();
		} else {
		  $("#slider2").animate({ 
			marginLeft: "0px"
		  }, 500 );
		  $("#topMenuImage2").html('<div id="close"><img src="images/closeN.png" alt="close"/></div>');
		  $("#openCloseIdentifier2").hide();
		}
	  });
	});
//About menu
	$(document).ready(function() {
	  $(".topMenuAction3").click( function() {
		if ($("#openCloseIdentifier3").is(":hidden")) {
		  $("#slider3").animate({ 
			marginLeft: "-650px"
		  }, 500 );
	      $("#topMenuImage3").html('<img src="images/aboutB.png"/>');
		  $("#openCloseIdentifier3").show();
		} else {
		  $("#slider3").animate({ 
			marginLeft: "0px"
		  }, 500 );
		  $("#topMenuImage3").html('<div id="close"><img src="images/closeN.png" alt="close"/></div>');
		  $("#openCloseIdentifier3").hide();
		}
	  });
	});