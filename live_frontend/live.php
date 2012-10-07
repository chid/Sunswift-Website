<div id="map_canvas"></div>
<div id="live_logo">Sponsored by UNSW</div>
<div id="controls">
	<div id="toolbar" class="ui-widget-header ui-corner-all">
		<button id="beginning">go to beginning</button>
		<button id="play">pause</button>
		<?php get_live_replay_events(); ?>
		<div id="slider"></div>
	</div>	
		<div id="livestate">
		<input class="live-state-class" type="radio" name="radio" id="realtime"  title="realtime" value="Realtime" /><label for="realtime">Realtime</label>
		<input class="live-state-class" checked="checked" type="radio" name="radio" id="replay" title="replay" value="Replay" /><label for="replay">Replay</label>
	</div>
	<input id="followmap" type="checkbox" checked="checked" alt="live" checked="checked" title="Click to follow our solar car in realtime."/><label for="followmap" id="followmaplabel">Follow Solar Car</label>
</div>


<div id="speedo"></div>
<div id="arraypower-container" class="data-item">
	<div id="array-text-container">	
		Array Power<br />
		<div id="array-outer-container">
		    <div id="array-inner-progress">
				<div></div>
			</div>
		</div>
	</div>	
</div>		
<div id="dashboard">
	<div id="live-dash-line1">
		<div class="data-item">Motor Temperature<br /><div id="motortemp" class="temp-data"></div></div>
		<div class="data-item data-text">Motor Power<br /><span id="motorpower" class="temp-data"></span><span class="data-unit">Watts</span></div>
		<img src="<?php echo PATHPREFIX; ?>/images/YourLogoHere.gif" width="100" alt="YourLogoHere" class="live-sponsor-logo">
		
		
	</div>
	<div id="live-dash-line2">
		<div class="data-item">Heatsink Temperature<br /><div id="heatsinktemp" class="temp-data"></div></div>
		<div class="data-item data-text">Battery Power<br /><span id="batterypower" class="temp-data"></span><span class="data-unit">Watts</span></div>
		<div class="data-item data-text" id="distancetime"></div>
	</div>
</div>
<div id="data-age-container"><span id="data-age">Data is - days old</span> | Data hosted by <a href="http://www.orionvm.com.au" target="_blank">OrionVM</a></div>
