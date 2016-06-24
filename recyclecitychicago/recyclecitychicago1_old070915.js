var map, places, infowindow, geocoder,addressMarker, chart, destvalue, pos;
var markers = [];
var compMarkers = [];
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
  
  if(navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position) {
	  var pos = new google.maps.LatLng(position.coords.latitude,
		position.coords.longitude);
	  map.setCenter(pos);
	  locationDetection(pos);
	}, function() {
		handleNoGeolocation(true);
	});
  } else {
	// Browser doesn't support Geolocation
	handleNoGeolocation(false);
  }
  
  var cityBoundaryLayer = new google.maps.KmlLayer('http://data.cityofchicago.org/api/file_data/FbjscW4rNuQOuoguwcAn-EXO8wY9k7y0gijm0Od3OKc?filename=Kmlcityboundary.kml', {clickable:false, suppressInfoWindows:true, preserveViewport:true});
  cityBoundaryLayer.setMap(map);
  
  google.maps.event.addListener(map, 'click', function(event){
    deleteAddressMarkers();
    addressMarker = new google.maps.Marker({
      map: map,
	  icon: new google.maps.MarkerImage("images/car48.png", new google.maps.Size(48, 48)),
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
		  
		  if (type=="Pharmaceuticals") {
		    var recycleLink = "http://www.cityofchicago.org/city/en/depts/doe/provdrs/waste_mang/svcs/find_a_location_todisposeofpharmaceuticals.html";
		    var infoRecycle2 = "<div class='phoneytext'><ul><li>"
			  + "<b>Pharmaceuticals: </b>Unused or expired prescription and over-the-counter medications. Syringes, Needles, Medical waste, and Medical equipment are not accepted. </li></ul></div>";
		  }
		  else if (type=="Computer") {
		    var recycleLink = "http://www.cityofchicago.org/content/city/en/depts/doe/supp_info/hccrf/household_chemicalscomputerrecyclingfacilityoverview.html";
		    var infoRecycle2 = "<div class='phoneytext'><ul><li>"
			  + "<b>Accepted: </b>Household cleaners, oil-based paints, solvents, cell phones, compact fluorescent light bulbs, computer and related equipment</li>"
			  + "<li><b>Not accepted: </b>business/commercial sector wastes, explosives, fireworks or latex paint </li>"
			  + "</li><li>You can check the full list of items in <a href =" + "http://www.cityofchicago.org/content/city/en/depts/doe/supp_info/hccrf/household_chemicalscomputerrecyclingfacilityaccepteditems.html"
			  + " target='_blank'>here</a></li></ul></div>";
		  }
		  else if (type=="Private") {
		    var recycleLink = "http://www.chicagorecycling.org/sites.htm";
		    var infoRecycle2 = "<div class='phoneytext'><ul><li>"
			  + "<b>Cardboard: </b>" + cbrd + "</li><li>"
			  + "<b>Glass&Plastic: </b>" + gp +"</li><li>"
			  + "<b>Metals: </b>" + met +"</li></ul></div>";
		  }
		  else {
		    var recycleLink = "http://www.cityofchicago.org/content/city/en/depts/doe/provdrs/waste_mang/svcs/find_a_recyclingdropoffcenter.html";
		    var infoRecycle2 = "<div class='phoneytext'><ul><li>"
			  + "<b>Cardboard: </b>" + cbrd + "</li><li>"
			  + "<b>Glass&Plastic: </b>" + gp +"</li><li>"
			  + "<b>Metals: </b>" + met +"</li></ul></div>";
		  }
		  
		  //define two information window htmls for two tabs		
		  var infoRecycle1 = "<div class='phoneytext'><ul><h3><a href='" + recycleLink + "' target='_blank'>" + name + "</a></h3><li>"
			+ "<b>Type: </b>" + type + "</li><li>"
			+ "<b>Address: </b>" + addr +"</li><li>"
			+ "<b>Phone: </b>" + phone +"</li><li>"
			+ "<b>Hours: </b>" + hrs +"</li></ul></div>";
			
		  createMarker(latlng,infoRecycle1,infoRecycle2,name,type);	    	  
		}
 });
 
  
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
	var content = 'Error: The Geolocation service failed.';
  } else {
	var content = 'Error: Your browser doesn\'t support geolocation.';
  }
  var options = {
	map: map,
	position: new google.maps.LatLng(60, 105),
	content: content
  };
  map.setCenter(options.position);
}

function locationDetection(pos) {

  //initial trigger for closest facility and direction from location detection
    deleteAddressMarkers();
    addressMarker = new google.maps.Marker({
      map: map,
	  icon: new google.maps.MarkerImage("images/car48.png", new google.maps.Size(48, 48)),
      position: pos,
      draggable: true,
	  animation: google.maps.Animation.DROP
    });
	destvalue = document.getElementById('dest').options[document.getElementById('dest').selectedIndex].value;
	google.maps.event.addListener(addressMarker, 'dragend', function(event) {
		  destvalue = document.getElementById('dest').options[document.getElementById('dest').selectedIndex].value;
	      find_closest_marker(event,destvalue);
    });
    addressMarkers.push(addressMarker);
    find_closest_marker(addressMarker,destvalue);
  //end of initial trigger
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
	var cityState = "Chicago, IL";
    var address = document.getElementById("address").value + cityState;
	destvalue = document.getElementById('dest').options[document.getElementById('dest').selectedIndex].value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        addressMarker = new google.maps.Marker({
            map: map, 
			icon: new google.maps.MarkerImage("images/car48.png", new google.maps.Size(48, 48)),
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
  else {
    var markerImage = new google.maps.MarkerImage("images/computer48.png",
      new google.maps.Size(48, 48));
	var marker = new google.maps.Marker({
	  position: latlng,
	  icon: markerImage,
	  title: name,
	  map:map
	});  
    compMarkers.push(marker);
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
  else if (value=="Comp"){
    find_closest_markerComp( event );
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
	//google.maps.event.trigger(cityMarkers[closest], 'click');
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
	//google.maps.event.trigger(privateMarkers[closest], 'click');
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
	//google.maps.event.trigger(privateMarkers[closest], 'click');
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

function find_closest_markerComp( event ) {

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

    for( i=0;i<compMarkers.length; i++ ) {
        var mlat = compMarkers[i].getPosition().lat();
        var mlng = compMarkers[i].getPosition().lng();
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
	calcRoute(compMarkers[closest]);
}

//calculate route using google directionsService
function calcRoute(theMarker) {
  google.maps.event.trigger(theMarker, 'click');
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
	  //var destvalue1 = "Direction to " + document.getElementById('dest').options[document.getElementById('dest').selectedIndex].childNodes[0].nodeValue;
	  //$( "#directions-panel" ).dialog("option", "title", destvalue1);
	  $( "#directions-panel" ).dialog('open');
    }
  });
}
function selectedValueChange1() {
  var selectedValue = document.getElementById('dest1').selectedIndex;
  document.getElementById('dest').options[selectedValue].selected = true;
}
function selectedValueChange() {
  var selectedValue = document.getElementById('dest').selectedIndex;
  document.getElementById('dest1').options[selectedValue].selected = true;
}




//dialog	
	$(function() {
		$( "#dialog" ).dialog({ width: 800, modal: true, stack:false });
	});
	//create a direction panel window
	$(function() {
	    var selectTitle = '<select id="dest1" class="inputB1" name="destination1" onchange="find_closest_marker(addressMarker, value);selectedValueChange1()"><option value="CityOfChicago">City of Chicago Recycle Drop-off</option><option value="Private">Private Recycling Center</option><option value="AllRec">All Recycling Center</option><option value="Pharm">Dispose of Pharmaceuticals</option><option value="Comp">Household Chemicals &amp; Computer Recycling</option></select>'
		$( "#directions-panel" ).dialog({ autoOpen: false, maxHeight:400, position:['right','top'], title: "Direction to <br/>" + selectTitle});
	});
	$(document).ready(function(){
		$('#openAddressDialog').click(function(){
			$('#addressDialog').dialog({modal:false, width:570, title:'Type an address and find the nearest recycling facility', position:['center','top'], stack:false});
		});
		$('#openLegendDialog').click(function(){
			$('#legendDialog').dialog({modal:false, width:400, title:'Legend', stack:false});
		});
		$('#openLayerDialog').click(function(){
			$('#layerDialog').dialog({modal:false, width:700, title:'Layers: click a radio button to turn on a layer', stack:false});
		});
		$('#openQuestionDialog').click(function(){
			$('#questionDialog').dialog({modal:false, width:700, title:'How to use this app', maxHeight:400, stack:false});
		});
		$('#openInfoDialog').click(function(){
			$('#infoDialog').dialog({modal:false, width:700, maxHeight:400, title:'About', stack:false});
		});
		selectedValueChange();
	});