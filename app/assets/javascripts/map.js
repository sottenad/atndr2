
function initialize(){
	console.log("we're loaded");
}



var initialLocation;
var geoOn;
var sf = new google.maps.LatLng(37.7833, -122.4167);
var myOptions = {
	zoom: 15,
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	panControl: true,
	panControlOptions: {
	   	position: google.maps.ControlPosition.RIGHT_TOP
	},
	zoomControl: true,
	zoomControlOptions: {
   		position: google.maps.ControlPosition.RIGHT_TOP,
     	style: google.maps.ZoomControlStyle.SMALL
	},
	mapTypeControl: false, streetViewControl: false, overviewMapControl: false};
var map;
var marker;
var point;
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var mArr =  [];
var monArr = ["Jan","Feb","Mar","Apr","May","June","July","Aug","Sept","Oct","Nov", "Dec"];
var dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var eventCount; //number of shows returned for this area


$(function(){
	var pos = '';
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	map.setCenter(sf);
	map.panBy(-345, 0);
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(p) {
		  pos = p
		  initialLocation = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
			getShows(pos.coords.latitude,pos.coords.longitude);
			map.setCenter(initialLocation);	
			geoOn=true;
			$('#loading').html('<h3>Loading Shows</h3><img id="limg" src="images/ui/load.png" />');		
		}, function(error){
			geoOn=false;

			});
	}

	//Use Current Location button press
	$('#currloc').on('click',function(){
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(p) {
			  pos = p
			  initialLocation = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
				getShows(pos.coords.latitude,pos.coords.longitude);
				map.setCenter(initialLocation);	
				geoOn=true;
				$('#loading').html('<h3>Loading Shows</h3><img id="limg" src="images/ui/load.png" />');		
			}, function(error){
				console.log(error);
				alert("Please enable Geolocation in your browsers preferences. We promise we're not stalking you.");
			});
		}
		
	});
	
	//$('#bg').fadeOut(200);
	$('#cls').css('display','none');
	showLocationPanel();

	//Open itunes links in new window
       $('.buy').on('click',function(event) {
           event.preventDefault();
           event.stopPropagation();
           window.open(this.href, '_blank');
       });
	   
	 $('.rm').click(function(){ reloadMap();});
	 $('.so').click(function(){ $('#bg').fadeIn(); $('#cls').css('display','block');});
	 $('#cls').on('click', function(){$('#bg').fadeOut(200)});

});
function showLocationPanel(){
	$('#bg').fadeIn(200);
	
	//Catch the enter press on the address field
	$('#textSearch').keypress(function(e){
		if(e.which == 13){
			getLocation( $('#textSearch').val().replace(/ /g,'+') );
		}
    });
	
	$('#searchBtn').on('click',function(){
		getLocation( $('#textSearch').val().replace(/ /g,'+') );
	});	
}


function isArray(obj) { 
	return (obj.constructor.toString().indexOf("Array") != -1);
}

function getLocation(l){
	geocoder.geocode( { 'address': l}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
		var loc = results[0].geometry.location
        map.setCenter(loc);
		$('#bg').fadeOut(200);
		getShows(loc.lat(), loc.lng());
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
	});
}



function getShows(lat, lng){	
	$('#shows ul').empty();
	$('#loading').show();
	
	//Grab Handlebars templates from the DOM
	var infowindowsource = $("#infowindow-template").html();
	var infowindowtemplate = Handlebars.compile(infowindowsource);
	var listsource = $("#list-template").html();
	var listtemplate = Handlebars.compile(listsource);
	
	deleteOverlays();
	
	//This populates the list, which is sorted on shows
	$.getJSON("/api/shows", function(d){
		if(d.error > 0){
			$('#loading').hide();
			alert('Could not find any shows, please try again in a different location');
		}else{
			console.log(d);
			var listoutput = listtemplate(d);
			$('#resultsList').html(listoutput);
		}
		
	})
	
	//This populates the map, which is sorted on venues
	$.getJSON("/api/venues", function(data) {
		if(data.error > 0){
			$('#loading').hide();
			alert('Could not find any shows, please try again in a different location');
		}else{
			
			//var e = data.events.event;
			
			var e = data;
			eventCount = e.length;
			$('#loading').hide();
			for(var i in e){
							
				var content = infowindowtemplate(e[i]);
				
				point = new google.maps.LatLng(e[i].lat, e[i].long);
				marker = new google.maps.Marker({ map:map, animation: google.maps.Animation.DROP, position: point, icon:'http://www.atndr.com/images/ui/marker.png'});
				google.maps.event.addListener(marker, 'click', handleMarkerClick(infowindow, marker, e[i].name, content, point, true));
				//google.maps.event.addDomListener(document.getElementById('item'+i),'click', handleMarkerClick(infowindow, marker, [i].name, content, point, false) );
				
				mArr.push(marker);
				
				
				(function() { // Closure here here instead of "bindItem()"
					var p = point;
					var m = marker;
					var h = [i].name;
					var info = infowindow;
				})();
			}
		}//End Else
    });
}

function deleteOverlays() {
  if (mArr) {
    for (i in mArr) {
      mArr[i].setMap(null);
    }
    mArr.length = 0;
  }
}


function listClick(point){
	map.setCenter(point);
	map.panBy(-345, 0);
	
};

function reloadMap(){
	var loc = map.getCenter();
	getShows(loc.lat(), loc.lng());
}


function handleMarkerClick(infowin, marker, headliner, content, point, scroll) { 
  return function() { 	
	var headlineUrl = headliner.replace(/ /g,'+');
	/*
	if( $(content).find('audio').length <= 0){
		$.getJSON("http://itunes.apple.com/search?term="+headlineUrl+"&entity=musicTrack&limit=3&sort=popular&callback=?", function(data) {
			
			var r = data.results;
			var players = '';
				if(!(jQuery.isEmptyObject( r))){
					content +='<div class="tracks"><h5>Popular Tracks</h5>';
				}
				for (i in r){
					players = players + '<div class="player"><span class="play"></span><span>'+r[i].trackName+'</span><audio id="player" name="player" src="'+r[i].previewUrl+'" controls="controls"></audio><a class="buy" href="'+r[i].trackViewUrl+'">View in iTunes</a></div>';
				}
				content += players;
				content += '</div></div>' // closing for .tracks and '.infoWindow' from getShows
		
			infowindow.close()
			infowindow.setContent(content);
			infowin.open(map, marker);
			map.setCenter(point);	
				map.panBy(-345, 0);
					
			$('.player .play').on('click',function(){	
				$(this).parent().parent().find('audio').each(function(){ 
					this.pause();
					$(this).siblings('.pause').removeClass('pause').addClass('play');
				});
				$(this).siblings('audio')[0].play(); 
				$(this).parent().find('.pause').removeClass('pause').addClass('play');
				$(this).removeClass('play').addClass('pause');
			});
			$('.player .pause').on('click',function(){
				$(this).siblings('audio')[0].pause(); 
				$(this).removeClass('pause').addClass('play');
			});
		});
	}else{
		infowindow.close()
		infowindow.setContent(content);
		infowin.open(map, marker);
	}
	*/
		infowindow.close()
		infowindow.setContent(content);
		infowin.open(map, marker);
	
	/*	
	$('#shows ul li').removeClass();
	$(item).addClass('selected');
	if(scroll){
	var ipos = $(item).position();
	var delta = $('#shows ul').scrollTop()+ipos.top;
	$('#shows ul').animate({scrollTop:delta}, 300);
	}
	*/
   }
}