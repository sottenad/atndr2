
$(function(){

	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(initMapWithLocation);
	} else {
		initMapWithoutLocation();
	}
})

function initMapWithLocation(location){
	var mapOptions = {
	  center: new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
	  zoom: 12
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	google.maps.event.addDomListener(window, 'load', initialize);
}

function initMapWithoutLocation(location){
	var mapOptions = {
	  center: new google.maps.LatLng( 122.4167,-37.7833 ),
	  zoom: 8
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	google.maps.event.addDomListener(window, 'load', initialize);
}

function initialize(){
	console.log("we're loaded");
}

