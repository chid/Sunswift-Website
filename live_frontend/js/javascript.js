// Copyright Daniel Friedman 2011
var albums = [];
var videos = [];
var tweets = [];
var TWITTERINTERVAL = 60000;
var CR = 5;
// Live 
var REALTIME = 'Replay'			// Options: Realtime, Socket, Replay
var LIVEDURATION = 2000;
var ROUND = 100;
var MAPTYPE = 'Maps';				// Options: Earth, Maps
var PATHPREFIX = '/wp-content/themes/sunswift';
var MAXARRAY = 1300;
var BATCHLENGTH = 60;
var dataTypes = [
	{'label':'arraypower','suffix':'W'},
	{'label':'motorpower','suffix':'W'},
	{'label':'batterypower','suffix':'W'}
];
/*
{'label':'motortemp'},
{'label':'arraypower','suffix':'W'},
{'label':'motorpower','suffix':'W'},
{'label':'latitude','suffix':''},
{'label':'longitude','suffix':''},
{'label':'heatsinktemp'},
*/
var follow = true;
var allData = Array();
var curkey = 1;
var map_loaded = false;
var map3D_loaded = false;
var map;
var marker;
var ge;
var oldlat = 0;
var oldlong = 0;
var curlat = 0;
var curlong = 0;
var infowindow;
var placemark;
var finalSpeed = 0;
var time=[];
var tmpVal=[];
var worker;
var updateIv=[]; 			// Burst update interval
var iv;					// Update value interval
var sb;					// Standby interval
var delayiv;
var twitterm=[];
var tinfowindow=[];
var replay_since = new Date();	// new Date();
var lastTime = 1292625914.81;
var timeOffset;
var online=false;
var nextupdate=15;
var lostconniv;
var dots = 1;
var events;


function $_GET()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
 
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function init_after_ready () {
	// Easiest way to add the 'Home' link first in the nav
	$("#navHeader ul:first").prepend("<li><a href='http://www.sunswift.com/'>Home</a></li>");
	// Reflect the main panel image asap.
	try { 
		$("#panel_image img").reflect({height:35}); 
		// Setup rounded corners for the site
		$("#navHeader").corner({ tl: { radius: 0 },	tr: { radius: CR },	bl: { radius: 0 },	br: { radius: 0 }, antiAlias: true,	autoPad: true, validTags: ["div"] });
		$("#body").corner({	tl: { radius: CR }, tr: { radius: CR }, bl: { radius: CR }, br: { radius: CR }, antiAlias: true, autoPad: true, validTags: ["div"] });
		// Create the nice google html button
		$("span.buttons").css({
			'padding' : '5px 20px',
			'font-size' : '14px'
		});
		/*
		$("span.mediaButton").styledButton({
			'orientation' : 'left',
			'action' : function () { showMedia($(this).attr('alt')) },
			'display' : 'block'
		});
		*/
		$("#launchmedia").button().tooltip({effect:"fade"});
		$("#launchlive").button().tooltip({effect:"fade"});
		$("#launchlive").click(function() {$(".tooltip").each(function() {$(this).hide();});launchLive();});
		$("#launchmedia").click(function() {$(".tooltip").each(function() {$(this).hide();});launchMedia();});
		// Create the tooltips for the live/media buttons
	} catch (err) {}
	// Setup our Twitter feed
	$("#twitter").getTwitter({
		userName: "sunswift",
		numTweets: 4,
		loaderText: "Loading Twitter...",
		slideIn: false,
		showHeading: true,
		headingText: "Twitter",
		showProfileLink: true
	});
	// Load up the Google framework
	$.getScript("http://www.google.com/jsapi?key=ABQIAAAA-HMp5qqzmJu3_GQm7YWsjhTmPQATf80Rq88b4VeTi98-rAJ_BRTfcciXC3UtD2NDPWvCjl4VQBXeNQ", function() {
		var gets = $_GET();
		if (gets["live"]=="auto" & gets["delay"]>0) {
			setTimeout("initLive()", gets["delay"]);
		}
		else if (gets["live"]=="auto") launchLive();
	});
	// Load the calendar last
	$("#calendar_container").html('<iframe src="http://www.google.com/calendar/hosted/sunswift.unsw.edu.au/embed?showTitle=0&amp;showDate=0&amp;showTabs=0&amp;showCalendars=0&amp;mode=AGENDA&amp;height=410&amp;wkst=1&amp;bgcolor=%23FFFFFF&amp;src=sunswift.unsw.edu.au_09rfnc8tv6il3lp0016pfehpso%40group.calendar.google.com&amp;color=%2394C7B6&amp;ctz=Australia%2FSydney" style=" border-width:0 " width="100%" height="410" frameborder="0" scrolling="no" id="google_calendar_iframe"></iframe>');
}


function init_after_load() {
	
}

function init_after_twitter() {
	
}

function launchLive() {
	if (navigator.userAgent.indexOf("MSIE")!=-1) alert("Unfortunately we do not have the resources to support Internet Explorer, and cannot guarantee Sunswift Live will function properly.");
	$("#panel_image,#media_container").fadeOut("fast");
	
	$("#mediaHeader").animate({height:"650px"}, "fast", function() {
		
		$(this).children("#live_container").css({display:"block"}); 
		
		$('#speedo').flash({
			swf: PATHPREFIX+'/images/Speedo.swf',
			id: "speedo-flash",
			width: 200,
			height: 192,
			play: false,
			allowscriptaccess: 'always',
			allowfullscreen: 'false',
			wmode: 'transparent'
		});
		
		$('#motortemp').flash({
			swf: PATHPREFIX+'/images/Temp-Guage.swf',
			id:"motortemp-flash",
			width: 100,
			height: 51,
			play: false,
			allowscriptaccess: 'always',
			allowfullscreen: 'false',
			wmode: 'transparent'
		});
		
		$('#heatsinktemp').flash({
			swf: PATHPREFIX+'/images/Temp-Guage.swf',
			id:"heatsink-flash",
			width: 100,
			height: 51,
			play: false,
			allowscriptaccess: 'always',
			allowfullscreen: 'false',
			wmode: 'transparent'
		});
		// Create the reflections of the flash objects
		$("#speedo").append('<img src="'+PATHPREFIX+'/images/Speedometer-grey.jpg" />')
		$("#speedo img").reflect({height:35});
		$('#motortemp').append('<img src="'+PATHPREFIX+'/images/temp-guage-reflect.png" width="100" />')
		$("#motortemp img").reflect({height:25});
		$('#heatsinktemp').append('<img src="'+PATHPREFIX+'/images/temp-guage-reflect.png" width="100" />')
		$("#heatsinktemp img").reflect({height:25});

		$("#array-outer-container").corner({
			tl: { radius: 2 },
			tr: { radius: 2 },
			bl: { radius: 2 },
			br: { radius: 2 },
			antiAlias: true,
			autoPad: true,
			validTags: ["div"]
		});

		// Create the control group actions
		$("#followmap").button();
		$("#livestate").buttonset();
		
		$("input:radio[name=radio]").change(function() {
			changeState($("input:radio[name='radio']:checked").val());
		});
		
		$("#beginning").button({
			text: false,
			icons: { primary: "ui-icon-seek-start" }
		}).click(function() {
			curkey=1;
			updateValues();
			if ($("#play").text()=="play") for (i in updateIv) clearInterval(updateIv[i]);	
		});
		
		$( "#play" ).button({
			text: false,
			icons: { primary: "ui-icon-pause" }
		}).live('click', function() {
			var options;
			if ( $( this ).text() === "pause" ) {
				stopAllIntervals();
				options = {
					label: "play",
					icons: {
						primary: "ui-icon-play"
					}
				};
			} 
			else {
				iv = setInterval("updateValues()", LIVEDURATION);
				options = {
					label: "pause",
					icons: {
						primary: "ui-icon-pause"
					}
				};
			}
			$( this ).button( "option", options );
		});
		$("#slider").slider({
			min: -2000,
			max: -20,
			value: -2000,
		   	slide: function(event, ui) { 
				resetUpdateTimer(ui.value);
			}
		});
		
		// Now the meaty bits
		loadMaps();
		initialize();
		_gaq.push(['_trackEvent', 'Live', 'Initialised']);
		//twitteriv = setInterval("updateTweetMaps();", TWITTERINTERVAL);
	});
}

function stopAllIntervals() {
	clearInterval(iv);
	for (i in updateIv) clearInterval(updateIv[i]);
	$("#array-inner-progress").stop();	
}

function updateTweetMaps() {
	$.getScript("http://twitter.com/statuses/user_timeline/sunswift.json?callback=checkTwitter&count=5");
}

function launchMedia() {
	// Incase Live is running, stop it by clearing the interval
	stopLive();
	// Get rid of the panel image and the Live container
	$("#panel_image,#live_container").fadeOut("fast");
	// Incase they clicked the galleries button twice, clear the innerHTML of the ul containing both elements.
	$("#album_container,#video_container").hide().children("ul").html("");
	// Add the loading text, and adjust the height of the container.
	$("#mediaHeader").prepend("<div id='medialoading'>Loading...</div>").animate({height:"400px"}, "fast", function() {
		$.getScript("http://graph.facebook.com/UNSWSunswift/albums?callback=setAlbums");
		$.getScript("http://www.vimeo.com/api/v2/sunswift/videos.json?callback=setVideos");
	}).children("#media_container").css({display:"block"});
	_gaq.push(['_trackEvent', 'Media', 'Initialised']);
}
// The following 2 functions are incase facebook loads before vimeo, or vice versa.
function setAlbums (object) {
	albums = object;
	if (videos.length != 0) goForthWithMedia();
}

function setVideos (object) {
	videos = object;
	if (albums.length != 0) goForthWithMedia();
}

function goForthWithMedia () {
	// Remove the loading text
	$("#medialoading").remove();
	// Figure out the height of the media container
	var mediaHeight = 120 + (Math.ceil(albums.data.length/4)+Math.ceil(videos.length/4))*135;
	// Heighten the media container
	$("#mediaHeader").animate({height:mediaHeight+"px"},"fast", function() {
		// Set the innerHTML of the media container
		$("#media_container").html('<div id="album_container"><div class="mediaTitle">Galleries <span id="album-desc"></span></div><ul></ul></div><div id="video_container"><div class="mediaTitle">Videos <span id="video-desc"></span></div><ul></ul></div>');
		// Show both the gallery and video containers
		$("#album_container, #video_container").show();
		// Add the li elements to both containers
		populateAlbums();
		populateVideos();
	});
}

function populateAlbums () {
	// Create the li elements inside the ul
	for (i in albums.data) {
		$("#album_container ul").append("<li><a href='javascript:;' onclick='showGallery("+i+"); return false;'><img src='http://graph.facebook.com/"+albums.data[i].id+"/picture' height='100px' title='"+albums.data[i].name+"' class='thumbnail' /></a></li>");
	}
	// Bind the mouseover events.
	$("#album_container ul li img").each(function() {
		$(this).bind('mouseenter', function() {
			$("#album-desc").html(": "+$(this).attr("title"));
			$(this).animate({opacity:0.65},200);
		}).bind('mouseleave',function() {
			$("#album-desc").html("");
			$(this).animate({opacity:1},200);
		});
	});
	// Reflect the images
	$(".thumbnail").load(function() {
		$("#album_container img").reflect({height:20});
	});
}

function populateVideos () {
	// Create the li elements inside the ul
	for (i in videos) {
		$("#video_container ul").append("<li><a href='javascript:;' onclick='playVideo(\""+i+"\"); return false;'><img src='"+videos[i].thumbnail_medium+"' title='"+videos[i].title+"' width='150px' height='100px' /></a></li>");
	}
	// Bind the mouseover events.
	$("#video_container ul li img").each(function() {
		$(this).bind('mouseenter', function() {
			$("#video-desc").html(": "+$(this).attr("title"));
			$(this).animate({opacity:0.65},200);
		}).bind('mouseleave',function() {
			$("#video-desc").html("");
			$(this).animate({opacity:1},200);
		});
	});
	// Reflect the images
	$("#video_container img").reflect({height:20});
}

function showGallery(i) {
	h = Math.ceil(albums.data[i].count/4)*135+70+"px";
	$("#mediaHeader").animate({height:h},"fast");
	$("#video_container").fadeOut("fast", function() {
		$("#album_container ul").prepend("<div id='loading'>Loading...</div>");
		$("#album_container li").each(function() {
			$(this).fadeOut("fast",function() {
				$(this).remove();
				$("#album_container .mediaTitle").fadeOut("fast",function() {
					$(this).html("<a href='javascript:;' onclick='launchMedia();'>&gt; Click here to go back</a>").fadeIn("fast");
				});
			});
		});
	});
	$.getScript("http://graph.facebook.com/"+albums.data[i].id+"/photos?callback=populateAlbum&limit=9999");
}

function populateAlbum(photos) {
	$("#loading").remove();
	$("#album_container ul").html("");
	for (i in photos.data) {
		$("#album_container ul").append("<li><a href='"+photos.data[i].source+"'><img src='"+photos.data[i].images[1].source+"' class='thumbnail' height='100px' /></a></li>");
	}
	
	$('#album_container ul li a').lightBox({imagePathPrefix:PATHPREFIX});
	$("#album_container ul li a img").each(function() {

		$(this).bind('mouseenter', function() {
			$(this).animate({opacity:0.65},200);
		}).bind('mouseleave',function() {
			$(this).animate({opacity:1},200);
		});
	});
	$("#album_container img").reflect({height:15});
}

function playVideo(i) {
	$("#album_container, #video_container").css("display","none");
	var h = videos[i].height/videos[i].width*780;
	$("#mediaHeader").animate({height:h}, "fast", function() {
		$("#media_container").append('<div id="video"></div>');
		makeBackButton();
		$("#video").flash({
			swf:'http://vimeo.com/moogaloop.swf?autoplay=1',
			width: 780,
			height: h,
			wmode: "transparent",
			flashvars: {
		        clip_id: videos[i].id,
		        portrait: 0,
		        byline: 0,
		        title: 0,
				js_api: 1, // required in order to use the Javascript API
				width: 780,
				height: h
			}
		}).css("display","block");
	});
}

function makeBackButton () {
	$("#mediaHeader").append('<div id="backbutton"><a href="javascript:;">Back to videos<img width="20" style="z-index:9999; position: relative; padding-left: 4px; top: 4px; border: 0" src="'+PATHPREFIX+'/images/back-button.png"/></a></div>');
	
	$("#backbutton").corner({
		tl: { radius: 0 },
		tr: { radius: 6 },
		bl: { radius: 0 },
		br: { radius: 6 },
		antiAlias: true,
		autoPad: true,
		validTags: ["div"]
	});
	
	$("#backbutton").bind("mouseenter", function() {
		$(this).stop(true, false).animate({ left: "0px" }, "fast");
	}).bind("mouseleave", function() {
		$(this).stop(true, false).animate({ left: "-116px" }, "fast");
	}).bind("click", function() {
		$(this).fadeOut("fast", function() {
			$(this).remove();
		});
		$("#video").fadeOut("fast", function() {
			$(this).remove();
			launchMedia();
		});
	});	
	
	$("#backbutton").animate({ left: "-116px" }, 400); 
}

function twitterCallback(twitters) {	
  	var statusHTML = [];
  	for (var i=0; i<twitters.length; i++){
    	var username = twitters[i].user.screen_name;
    	var status = twitters[i].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(url) {
      		return '<a href="'+url+'">'+url+'</a>';
	    }).replace(/\B@([_a-z0-9]+)/ig, function(reply) {
			return  reply.charAt(0)+'<a href="http://twitter.com/'+reply.substring(1)+'" target="_blank">'+reply.substring(1)+'</a>';
	    });
    	statusHTML.push('<li><span>'+status+'</span> <a style="font-size:85%" href="http://twitter.com/'+username+'/statuses/'+twitters[i].id_str+'">'+relative_time(twitters[i].created_at)+'</a></li>');
  	}
	document.getElementById('twitter_update_list').innerHTML = statusHTML.join('');
	tweets = twitters;
}

function relative_time(time_value) {
	var values = time_value.split(" ");
	time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
	var parsed_date = Date.parse(time_value);
	var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	delta = delta + (relative_to.getTimezoneOffset() * 60);

	if (delta < 60) return 'less than a minute ago';
	else if(delta < 120) return 'about a minute ago';
	else if(delta < (60*60)) return (parseInt(delta / 60)).toString() + ' minutes ago';
	else if(delta < (120*60)) return 'about an hour ago';
	else if(delta < (24*60*60)) return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
	else if(delta < (48*60*60)) return '1 day ago';
	else return (parseInt(delta / 86400)).toString() + ' days ago';
}

/*
*	LIVE Code
*/

function initialize () {
	switch (REALTIME) {
		case 'Realtime':
			startRealTime();
			break;
		case 'Socket':
			connectToSocketServer();
			break;
		case 'Replay':
			$.getScript("http://49.156.18.20/api/events.json?callback=initEvents")
			
			break;
	}	
}

function stopLive () {
	switch (REALTIME) {
		case 'Realtime':
			clearInterval(iv);	
			for (i in updateIv) clearInterval(updateIv[i]);		
			break;
		case 'Socket':
			// kill server code
			break;
		case 'Replay':
			clearInterval(iv);
			for (i in updateIv) clearInterval(updateIv[i]);
			break;
	}	
}

function startRealTime() {
	$.getJSON('/live/cloud/api.php?do=time', function(server) {
		setInternalTime(server.time);
		var since = current_time-BATCHLENGTH;
		$.getJSON('/live/cloud/api.php?do=lastbatch&time='+since, function(data) {
			if (data==null) {
				$.getJSON('/live/cloud/api.php?do=lastupdate', function(data) {
					allData=data
					updateValues();
				});
				standby();
			}
			else {
				allData = data;
				iv = setInterval("updateRealTime()", LIVEDURATION); // TODO: 2000				
			}
		
		});
	});
}

function standby () {
	if (online) {
		clearInterval(iv);
		for (i in updateIv) clearInterval(updateIv[i]);		
		online = false;
		switch (REALTIME) {
			case "Realtime":
				makeLostConnectionOverlay();
				getNewestBatch();
				sb = setInterval("getNewestBatch()",30000); // TODO 60000 ?
			break;
			case "Replay":
				makeEndOfDataOverlay();
			break;
		}
	}
}



function changeState(state) {
	REALTIME = state;
	stopLive();
	switch(REALTIME) {
		case "Replay":
			$("#offline").fadeOut("fast");
			$("#live_container").animate({opacity:"1"}, "fast");
			$("#slider,#toolbar").fadeIn("fast");
			break;
		case "Realtime":
			$("#slider,#toolbar").fadeOut("fast");
			break;
	}
	initialize();
	updateValues();
}

function exitStandby() {
	curkey=1;
	REALTIME = "Replay";
	getReplayValues();
	$("#offline").fadeOut("fast");
	$("#live_container").animate({opacity:"1"}, "fast");
	clearTimeout(lostconniv);
	//alert ("Solar car is online");
};

function setInternalTime(time) {
	var now = new Date();
	timeOffset = time - now.getTime()/1000;
	current_time = time;
};

function getInternalTime() {
	var now = new Date();
	return now.getTime() + timeOffset;
};

function getNewestBatch() {
	var time = getInternalTime()-60;
	$.getJSON('/live/cloud/api.php?do=lastbatch&time='+time, function(data) {
		if (allData !== data && data !== null) {
			appendNewData(data);
			clearInterval(sb);
			if (online == false) {
				exitStandby();
			}
			clearInterval(iv);
			iv = setInterval("updateRealTime()", 1000);
		}
		else {
			//
		}
	});
}

function appendNewData (data) {
	var out = [];
	var record = false;
	// Get the last set of data from the array to find out where it ends.
	var lasttime = allData[allData.length-1].timestamp;
	var tmp = [];
	// Cut off the data we've already displayed
	for (i in allData) {
		if (i>= curkey) tmp.push(allData[i]);
	}
	// Only take new data
	for (j in data) {
		if (data[j].timestamp == lasttime) record = true;
		if (record)	out.push(data[j]);
	}
	record = false;
	// Combined the above to arrays together
	tmp.concat(out);
	// Reset the data to play
	allData = tmp;
	curkey = 1;
	nextupdate = allData.length/2;
}

function updateRealTime() {
	if (curkey == Math.floor(allData.length/2) || curkey==1) getNewestBatch();
	updateValues();
}

// Socket Code
function connectToSocketServer () {
	var socket = new io.Socket("localhost", {port: 8125, rememberTransport: false});
    socket.connect();
    socket.on('message', function(obj) {
		alert(dump(obj));
		for (var i in obj.buffer) updateSocketValues(obj.buffer[i]);
	});
}

function updateSocketValues(json) {
	try { 
		data = $.parseJSON(json); 
	}
	catch (err) { 
		alert("Bad data:" + err.message); 
	}
	for (var i in dataTypes) $("#"+dataTypes[i].label).html(data[dataTypes[i].label]+" "+dataTypes[i].suffix);
}

function initEvents(events) {
	$("#replay_events").html("");
	var options = "";
	var len = events.length;
	for (i=0;i<len;i++) {
		options += "<option onclick='getReplayValues("+events[i].timestamp_from+","+events[i].timestamp_to+")'>"+events[i].title+"</option>";
	}
	$("#replay_events").html(options);
	getReplayValues(events[len-1].timestamp_from,events[len-1].timestamp_to);
}


function getReplayValues(from,to) {
	curkey = 1;
	clearInterval(iv);
	$.ajax({
		url: 'http://49.156.18.20/api/replay.json?callback=initReplay&from='+from+'&to='+to,
		dataType: 'script',
		statusCode:{
			400:function() {
				
			}
		}
	});

}
function initReplay (data) {
	try {
		allData = data;
		iv = setInterval("updateValues()", LIVEDURATION);
	}
	catch (error) {
		alert ("Error retrieving data");
	}

}

function resetUpdateTimer (delay) {
	clearInterval(iv);
	for (i in updateIv) clearInterval(updateIv[i]);
	LIVEDURATION = delay*-1;
	iv = setInterval("updateValues()", LIVEDURATION);
}

function updateValues() {
	if (curkey < allData.length && curkey > 0) {
		online = true;
		if (curlat == 0 && curlong == 0) { 
			try { 
				map.setZoom(15); 
				marker.setMap(map);
			} catch (err) { }
		}		
		// Map calculations
		var oldlat = allData[curkey-1]["latitude"];
		var oldlong = allData[curkey-1]["longitude"];
		curlat = (allData[curkey]["latitude"] == 0) ? curlat : allData[curkey]["latitude"]/60;
		curlong = (allData[curkey]["longitude"] == 0) ? curlong : allData[curkey]["longitude"]/60;
		var iconDirn = (curlong < allData[curkey-1]["longitude"]) ? "left" : "right";
		//var angle = Math.round(heading(longDiff, latDiff, newlat, oldlat)*10)/10;
		//allData[curkey]['heading'] = ((allData % 90) == 0 && allData[curkey-1]['heading']!=="undefined") ? allData[curkey-1]['heading'] : angle;
		allData[curkey]['arraypower'] = allData[curkey]['arraypower']*-1;
		// Speed calculations
		var oldspeed = Math.round(allData[curkey-1]["speed"]*100)/100;
		var speed = Math.round(allData[curkey]["speed"]*100)/100;
	
		// Add photo if one exists
		if (allData[curkey]["photo"]) addPhotoToMap();
		
		// Change the flash dials
		try {
			$('#speedo object').flash(function(){ this.changeSpeed(allData[curkey]['speed']); });
			$('#motortemp object').flash(function(){ this.changeTemperature(allData[curkey]['heatsinktemp']); });
			$('#heatsinktemp object').flash(function(){ this.changeTemperature(allData[curkey]['motortemp']); });	
		}
		catch (error) {
			// No flash installed. We try canvas first, then flash, but maybe throw in just HTML?
			//alert("Cannot adjust dials");
		}
 
		// Distance/Time
		switch (REALTIME) {
			case "Realtime":
				allData[curkey]['distance'] = Math.round(distance(curlat, curlong, "-34.927165", "138.599691", "K")*ROUND)/ROUND;
				$("#distancetime").html('Distance to Destination<br /><span class="temp-data">'+allData[curkey]["distance"]+'</span><span class="data-unit">Kilometres</span>')
			break;
			
			case "Replay":
				var datatime = getFormattedDate(allData[curkey]["timestamp"]);
				$("#distancetime").html('Time<br /><span class="time-data">'+datatime+'</span><span class="data-unit">(of data)</span>');
			break;
		}
		// Set the array power
		var arraypower = allData[curkey]['arraypower']/MAXARRAY*100+"%";
		$("#array-inner-progress").animate({height:arraypower},LIVEDURATION);	
		// Update the data age div
		$('#data-age').html("Data is "+relative_live_time(allData[curkey]['timestamp']));
		// Update everything else
		for (var i in dataTypes) {
			updateItem(dataTypes[i].label, allData[curkey-1][dataTypes[i].label], allData[curkey][dataTypes[i].label], LIVEDURATION, ' '+dataTypes[i].suffix);
		}
		
		if (map_loaded) updateMap(iconDirn, speed+" km/h");
		else if (map3D_loaded) update3DMap(newlat, newlong, iconDirn, speed+" km/h", allData[curkey]['heading']);
	}
	else {
		switch (REALTIME) {
			case "Realtime": 
				standby();
				break;
			case "Replay":
				//pauseReplay();
				standby();
				break;
		}
		return false;
	}
	curkey++;
}

function addPhotoToMap () {
	//alert("adding "+allData[curkey]["photo"]+"at lat: "+curlat+" long:"+curlong);
	var photolatlng = new google.maps.LatLng(curlat,curlong);
	var photomarker = new google.maps.Marker({
		position: photolatlng,
		animation: google.maps.Animation.DROP,
		title:'Photo',
		icon:PATHPREFIX+"/images/photoicon.png",
		html:"<div class='map_tweet'><a title='' target='_blank' href='/"+PATHPREFIX+"/images/live/"+allData[curkey]["photo"]+"'><img src='/"+PATHPREFIX+"/images/live/"+allData[curkey]["photo"]+"' height='229px' width='344px' /></a></div>"
	});
	photomarker.setMap(map);
	photoinfo = new google.maps.InfoWindow();
	// Bind the click event to open the info window
	google.maps.event.addListener(photomarker, 'click', function() {
		photoinfo.setContent(this.html);	
	    photoinfo.open(map,this);
		$("div.map_tweet a").lightBox({imagePathPrefix:PATHPREFIX});
		if ($("#followmap").attr("checked")=="checked") $("#followmap").click();
	});	
}

function relative_live_time (timestamp) {
	var delta = parseInt((replay_since.getTime()/1000 - timestamp));
	//delta = delta + (replay_since.getTimezoneOffset() * 60);
	if (delta < 60) return 'less than a minute old';
	else if(delta < 120) return 'about a minute old';
	else if(delta < (60*60)) return (parseInt(delta / 60)).toString() + ' minutes old';
	else if(delta < (120*60)) return 'about an hour old';
	else if(delta < (24*60*60)) return 'about ' + (parseInt(delta / 3600)).toString() + ' hours old';
	else if(delta < (48*60*60)) return '1 day old';
	else return (parseInt(delta / 86400)).toString() + ' days old';
}

function getFormattedDate (timestamp) {
	var date = new Date(timestamp*1000);
	var day = date.getDate();
	var month="";
	switch (date.getMonth().toString()) {
		case "0":
			month = "Jan";
		break;
		case "1":
			month = "Feb";
		break;
		case "2":
			month = "Mar";
		break;
		case "3":
			month = "Apr";
		break;
		case "4":
			month = "May";
		break;
		case "5":
			month = "Jun";
		break;
		case "6":
			month = "Jul";
		break;
		case "7":
			month = "Aug";
		break;
		case "8":
			month = "Sep";
		break;
		case "9":
			month = "Oct";
		break;
		case "10":
			month = "Nov";
		break;
		case "11":
			month = "Dec";
		break;
	}
	var year = date.getFullYear();
	// hours part from the timestamp
	var hours = date.getHours();
	// minutes part from the timestamp
	var minutes = date.getMinutes();
	// seconds part from the timestamp
	var seconds = date.getSeconds();
	// will display time in 10:30:23 format
	var formattedTime = hours + ':' + minutes + ':' + seconds + '<br /> ' + day+' '+month+' '+year;
	return formattedTime;
}

function updateItem (htmlID, u, v, t, suffix) {
	clearInterval(updateIv[htmlID]);
	time[htmlID]=0;
	var a = ((v-u)/t);	//Fix this
	updateIv[htmlID] = setInterval('burstUpdate("'+htmlID+'",'+a+','+u+');', LIVEDURATION/2);	
}

function burstUpdate (id, a, u) {
	try { 
		$("#"+id).html(Math.round(((a*time[id])+u)*ROUND)/ROUND);
		time[id]+=LIVEDURATION/2;
	}
	catch(err) { }
}

function makeLostConnectionOverlay() {
	$("#live_container").animate({opacity:"0.5"}, "slow");
	$("#mediaHeader").prepend("<div id='offline'><span id='offline_text'>Connection lost. Trying to reestablish connection.</span></div>");
	
	$("#offline")
	$("#offline").fadeIn("slow");
	lostconniv = setInterval('lostConnOverlayDots();',1000);
}

function makeEndOfDataOverlay() {
	$("#live_container").animate({opacity:"0.5"}, "slow");
	$("#mediaHeader").append("<div id='offline'><span id='offline_text'>End of replay. Click to restart.</span></div>");
	$("#offline").fadeIn("slow").click(function() {
		exitStandby();
	});
}

function lostConnOverlayDots () {
	if (dots==3) {
		$("#offline_text").html("Connection lost. Trying to reestablish connection.");
		dots=1;
	}
	else {
		$("#offline_text").append(".");
		dots++;
	}
}

/*
*	Maps specific code
*/

function loadMaps() {
	switch (MAPTYPE) {
		case 'Earth':
			google.load("earth","1", {"callback":loadEarth});
			break;
		case 'Maps':
			google.load("maps", "3.x", {"callback" : initializeMap, "other_params": "sensor=false"});
			break;
	}
}

function initializeMap () {
	curlat = 0;
	curlong = 0
	// Set the initial parameters for the map
	var latlng = new google.maps.LatLng(curlat, curlong);
	var params = {
     	zoom: 2,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.SATELLITE
	};
	// Create the map
    map = new google.maps.Map(document.getElementById("map_canvas"), params);
	// Create the solar car marker
	marker = new google.maps.Marker({
		position: latlng,
		title:"Sunswift IV"
	});
	// Setup the info window
	infowindow = new google.maps.InfoWindow();
	// Bind the click event to open the info window
	google.maps.event.addListener(marker, 'click', function() {
	    infowindow.open(map,marker);
	});
	// Map has been loaded, so we can start updating the coordinates in updateValues();
	map_loaded = true;
	// Load Twitter markers we get from our twitter feed while on the road.
	loadTwitterMarkers();
}

function updateMap(direction, speed) {
	// Create the new position as a maps lat/long
	var newPoint = new google.maps.LatLng(curlat, curlong);
	// Center the map on the new location if the button is pressed.
	if ($("#followmap").attr("checked")=="checked") map.panTo(newPoint);
	// Set the marker to the new position
	marker.setPosition(newPoint);
    // Change the icon depending on the location
	icon = (direction=="left") ? PATHPREFIX+"/images/left-icon.png" : PATHPREFIX+"/images/right-icon.png";
	marker.setIcon(icon);
	// Update the HTML for the info window
	html = "Speed: "+speed;
	infowindow.setContent(html);
}

function loadTwitterMarkers () {
	var varhtml;
	// Some temp code here
	for (i=0; i<0; i++) {
		var twitpos = new google.maps.LatLng(-34.948375,(150.53657+(i/1000)));
		twitterm = new google.maps.Marker({
			position: twitpos,
			title:'tweet',
			icon:PATHPREFIX+"/images/alt-tweet-bubble.png",
			html: "<div class='map_tweet'><a title='Luke running back into the car (Tweeted at 12:02pm EST with roughly 1,023km to go)' target='_blank' href='"+PATHPREFIX+"/images/tweetpic.jpg'><img src='"+PATHPREFIX+"/images/tweetpic.jpg' height='229px' /></a></div>"
		});
		twitterm.setMap(map);
		tinfowindow = new google.maps.InfoWindow();

		google.maps.event.addListener(twitterm, 'click', function() {
			tinfowindow.setContent(this.html);	
		    tinfowindow.open(map,this);
			$("div.map_tweet a").lightBox({imagePathPrefix:PATHPREFIX});
			if ($("#followmap").attr("checked")=="checked") $("#followmap").click();
		});
	}
}

/*
*	Earth specific code
*/

function loadEarth() {
   google.earth.createInstance('map_canvas', earthCallback, postError);
}

function earthCallback(instance) {
   	ge = instance;
   	ge.getWindow().setVisibility(true);
	map3D_loaded = true;
}

function update3DMap (latitude, longitude, direction, speed, heading) {
	// Create the placemark.	
	placemark = ge.createPlacemark('');
	//ge.getFeatures().removeChild(placemark);
	// Set the placemark's location.  
	var point = ge.createPoint('');
	point.setLatitude(latitude);
	point.setLongitude(longitude);
	placemark.setGeometry(point);
	// Add the placemark to Earth.
	ge.getFeatures().appendChild(placemark);
	// Create a new LookAt
	var lookAt = ge.createLookAt('');
	// Set the position values
	lookAt.setLatitude(latitude);
	lookAt.setLongitude(longitude);
	lookAt.setRange(1000.0); //default is 0.0
	if ((heading % 90) !== 0 && heading !== 0) {
		lookAt.setHeading(heading);
		$("#debug").html(heading);
	} 
	// Update the view in Google Earth	
	ge.getView().setAbstractView(lookAt);
}

/*
*	General lat/long functions
*/

function heading (xDiff, yDiff, oldlat, newlat) {
	var R = 6371; // km
	var dLat = toRad(yDiff);
	var dLon = toRad(xDiff); 
	var y = Math.sin(dLon) * Math.cos(newlat);
	var x = Math.cos(oldlat)*Math.sin(newlat) -
	        Math.sin(oldlat)*Math.cos(newlat)*Math.cos(dLon);
	var angle = Math.atan2(yDiff,xDiff)*180 / Math.PI;
	angle = (angle+360) % 360;
	return angle;
}

function distance(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1/180,
		radlat2 = Math.PI * lat2/180,
		radlon1 = Math.PI * lon1/180,
		radlon2 = Math.PI * lon2/180,
		theta = lon1-lon2,
		radtheta = Math.PI * theta/180,
		dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist;
}

function toRad(deg) {
	return deg * Math.PI/180;
}

function toDeg (rad) {
	return rad/Math.PI*180;
}

function postError(errorCode) {
	alert(errorCode);
}

function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if (typeof(arr) == 'object') { //Array/Hashes/Objects
		for(var item in arr) {
			var value = arr[item];
	  		if (typeof(value) == 'object') { //If it is an array,
	   			dumped_text += level_padding + "'" + item + "' ...\n";
	   			dumped_text += dump(value,level+1);
	  		} 
			else dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
	 	}
	} 
	else dumped_text = "===>"+arr+"<===("+typeof(arr)+")";	//Stings/Chars/Numbers etc.
	return dumped_text;
}
