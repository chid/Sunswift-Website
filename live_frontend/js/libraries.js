// jQuery SWFObject v1.1.1 MIT/GPL @jon_neal
// http://jquery.thewikies.com/swfobject

(function($, flash, Plugin) {
	var OBJECT = 'object',
		ENCODE = true;

	function _compareArrayIntegers(a, b) {
		var x = (a[0] || 0) - (b[0] || 0);

		return x > 0 || (
			!x &&
			a.length > 0 &&
			_compareArrayIntegers(a.slice(1), b.slice(1))
		);
	}

	function _objectToArguments(obj) {
		if (typeof obj != OBJECT) {
			return obj;
		}

		var arr = [],
			str = '';

		for (var i in obj) {
			if (typeof obj[i] == OBJECT) {
				str = _objectToArguments(obj[i]);
			}
			else {
				str = [i, (ENCODE) ? encodeURI(obj[i]) : obj[i]].join('=');
			}

			arr.push(str);
		}

		return arr.join('&');
	}

	function _objectFromObject(obj) {
		var arr = [];

		for (var i in obj) {
			if (obj[i]) {
				arr.push([i, '="', obj[i], '"'].join(''));
			}
		}

		return arr.join(' ');
	}

	function _paramsFromObject(obj) {
		var arr = [];

		for (var i in obj) {
			arr.push([
				'<param name="', i,
				'" value="', _objectToArguments(obj[i]), '" />'
			].join(''));
		}

		return arr.join('');
	}

	try {
		var flashVersion = Plugin.description || (function () {
			return (
				new Plugin('ShockwaveFlash.ShockwaveFlash')
			).GetVariable('$version');
		}())
	}
	catch (e) {
		flashVersion = 'Unavailable';
	}

	var flashVersionMatchVersionNumbers = flashVersion.match(/\d+/g) || [0];

	$[flash] = {
		available: flashVersionMatchVersionNumbers[0] > 0,

		activeX: Plugin && !Plugin.name,

		version: {
			original: flashVersion,
			array: flashVersionMatchVersionNumbers,
			string: flashVersionMatchVersionNumbers.join('.'),
			major: parseInt(flashVersionMatchVersionNumbers[0], 10) || 0,
			minor: parseInt(flashVersionMatchVersionNumbers[1], 10) || 0,
			release: parseInt(flashVersionMatchVersionNumbers[2], 10) || 0
		},

		hasVersion: function (version) {
			var versionArray = (/string|number/.test(typeof version))
				? version.toString().split('.')
				: (/object/.test(typeof version))
					? [version.major, version.minor]
					: version || [0, 0];

			return _compareArrayIntegers(
				flashVersionMatchVersionNumbers,
				versionArray
			);
		},

		encodeParams: true,

		expressInstall: 'expressInstall.swf',
		expressInstallIsActive: false,

		create: function (obj) {
			var instance = this;

			if (
				!obj.swf ||
				instance.expressInstallIsActive ||
				(!instance.available && !obj.hasVersionFail)
			) {
				return false;
			}

			if (!instance.hasVersion(obj.hasVersion || 1)) {
				instance.expressInstallIsActive = true;

				if (typeof obj.hasVersionFail == 'function') {
					if (!obj.hasVersionFail.apply(obj)) {
						return false;
					}
				}

				obj = {
					swf: obj.expressInstall || instance.expressInstall,
					height: 137,
					width: 214,
					flashvars: {
						MMredirectURL: location.href,
						MMplayerType: (instance.activeX)
							? 'ActiveX' : 'PlugIn',
						MMdoctitle: document.title.slice(0, 47) +
							' - Flash Player Installation'
					}
				};
			}

			attrs = {
				data: obj.swf,
				type: 'application/x-shockwave-flash',
				id: obj.id || 'flash_' + Math.floor(Math.random() * 999999999),
				width: obj.width || 320,
				height: obj.height || 180,
				style: obj.style || ''
			};

			ENCODE = typeof obj.useEncode !== 'undefined' ? obj.useEncode : instance.encodeParams;

			obj.movie = obj.swf;
			obj.wmode = obj.wmode || 'opaque';

			delete obj.fallback;
			delete obj.hasVersion;
			delete obj.hasVersionFail;
			delete obj.height;
			delete obj.id;
			delete obj.swf;
			delete obj.useEncode;
			delete obj.width;

			var flashContainer = document.createElement('div');

			flashContainer.innerHTML = [
				'<object ', _objectFromObject(attrs), '>',
				_paramsFromObject(obj),
				'</object>'
			].join('');

			return flashContainer.firstChild;
		}
	};

	$.fn[flash] = function (options) {
		var $this = this.find(OBJECT).andSelf().filter(OBJECT);

		if (/string|object/.test(typeof options)) {
			this.each(
				function () {
					var $this = $(this),
						flashObject;

					options = (typeof options == OBJECT) ? options : {
						swf: options
					};

					options.fallback = this;

					flashObject = $[flash].create(options);

					if (flashObject) {
						$this.children().remove();

						$this.html(flashObject);
					}
				}
			);
		}

		if (typeof options == 'function') {
			$this.each(
				function () {
					var instance = this,
					jsInteractionTimeoutMs = 'jsInteractionTimeoutMs';

					instance[jsInteractionTimeoutMs] =
						instance[jsInteractionTimeoutMs] || 0;

					if (instance[jsInteractionTimeoutMs] < 660) {
						if (instance.clientWidth || instance.clientHeight) {
							options.call(instance);
						}
						else {
							setTimeout(
								function () {
									$(instance)[flash](options);
								},
								instance[jsInteractionTimeoutMs] + 66
							);
						}
					}
				}
			);
		}

		return $this;
	};
}(
	jQuery,
	'flash',
	navigator.plugins['Shockwave Flash'] || window.ActiveXObject
));

/****************************************************************
 *                                                              *
 *  JQuery Curvy Corners by Mike Jolley                         *
 *  http://blue-anvil.com                                       *
 *  http://code.google.com/p/jquerycurvycorners/                *
 *  ==========================================================  *
 *                                                              *
 *  Version 2.1.1 (Based on CC 2.1 beta)                          *
 *                                                              *
 *  Original by: Terry Riegel, Cameron Cooke and Tim Hutchison  *
 *  Website: http://www.curvycorners.net                        *
 *                                                              *
 *  This library is free software; you can redistribute         *
 *  it and/or modify it under the terms of the GNU              *
 *  Lesser General Public License as published by the           *
 *  Free Software Foundation; either version 2.1 of the         *
 *  License, or (at your option) any later version.             *
 *                                                              *
 *  This library is distributed in the hope that it will        *
 *  be useful, but WITHOUT ANY WARRANTY; without even the       *
 *  implied warranty of MERCHANTABILITY or FITNESS FOR A        *
 *  PARTICULAR PURPOSE. See the GNU Lesser General Public       *
 *  License for more details.                                   *
 *                                                              *
 *  You should have received a copy of the GNU Lesser           *
 *  General Public License along with this library;             *
 *  Inc., 59 Temple Place, Suite 330, Boston,                   *
 *  MA 02111-1307 USA                                           *
 *                                                              *
 ****************************************************************/

/*
Usage:
	To use this plugin just apply borders via CSS Rules and include this plugin - it will automatically detect styles and apply corners.
	
	Opera and Chrome support rounded corners via border-radius
	
	Safari and Mozilla support rounded borders via -webkit-border-radius and -moz-border-radius
		
	IE (any version) does not support border-radius - this is all we need to support.
		
	So to make curvycorners work with any major browser simply add the following CSS declarations:
	
	.round { 
		border-radius: 3px;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
	}
	
	----
	
	If you don't want to use the above method, you can still use the direct syntax if you want:

		$('.myBox').corner();
		
	The script will still use border-radius for those which support it.
*/  
(function($) { 

	// object that parses border-radius properties for a box
	function curvyCnrSpec(selText) {
		this.selectorText = selText;
		this.tlR = this.trR = this.blR = this.brR = 0;
		this.tlu = this.tru = this.blu = this.bru = "";
		this.antiAlias = true; // default true
	};
	curvyCnrSpec.prototype.setcorner = function(tb, lr, radius, unit) {
		if (!tb) { // no corner specified
			this.tlR = this.trR = this.blR = this.brR = parseInt(radius);
			this.tlu = this.tru = this.blu = this.bru = unit;
		} else { // corner specified
			propname = tb.charAt(0) + lr.charAt(0);
			this[propname + 'R'] = parseInt(radius);
			this[propname + 'u'] = unit;
		}
	};
	curvyCnrSpec.prototype.get = function(prop) {
		if (/^(t|b)(l|r)(R|u)$/.test(prop)) return this[prop];
		if (/^(t|b)(l|r)Ru$/.test(prop)) {
			var pname = prop.charAt(0) + prop.charAt(1);
			return this[pname + 'R'] + this[pname + 'u'];
		}
		if (/^(t|b)Ru?$/.test(prop)) {
			var tb = prop.charAt(0);
			tb += this[tb + 'lR'] > this[tb + 'rR'] ? 'l' : 'r';
			var retval = this[tb + 'R'];
			if (prop.length === 3 && prop.charAt(2) === 'u')
		  		retval += this[tb = 'u'];
			return retval;
		}
		throw new Error('Don\'t recognize property ' + prop);
	};
	curvyCnrSpec.prototype.radiusdiff = function(tb) {
		if (tb !== 't' && tb !== 'b') throw new Error("Param must be 't' or 'b'");
		return Math.abs(this[tb + 'lR'] - this[tb + 'rR']);
	};
	curvyCnrSpec.prototype.setfrom = function(obj) {
		this.tlu = this.tru = this.blu = this.bru = 'px'; // default to px
		if ('tl' in obj) this.tlR = obj.tl.radius;
		if ('tr' in obj) this.trR = obj.tr.radius;
		if ('bl' in obj) this.blR = obj.bl.radius;
		if ('br' in obj) this.brR = obj.br.radius;
		if ('antiAlias' in obj) this.antiAlias = obj.antiAlias;
	};
	curvyCnrSpec.prototype.cloneOn = function(box) { // not needed by IE
		var props = ['tl', 'tr', 'bl', 'br'];
		var converted = 0;
		var i, propu;	
		for (i in props) if (!isNaN(i)) {
			propu = this[props[i] + 'u'];
			if (propu !== '' && propu !== 'px') {
				converted = new curvyCnrSpec;
				break;
			}
		}
		if (!converted)
			converted = this; // no need to clone
		else {
			var propi, propR, save = curvyBrowser.get_style(box, 'left');
			for (i in props) if (!isNaN(i)) {
				propi = props[i];
				propu = this[propi + 'u'];
				propR = this[propi + 'R'];
				if (propu !== 'px') {
					var save = box.style.left;
					box.style.left = propR + propu;
					propR = box.style.pixelLeft;
					box.style.left = save;
				}
				converted[propi + 'R'] = propR;
				converted[propi + 'u'] = 'px';
			}
			box.style.left = save;
		}
		return converted;
	};
	curvyCnrSpec.prototype.radiusSum = function(tb) {
		if (tb !== 't' && tb !== 'b') throw new Error("Param must be 't' or 'b'");
		return this[tb + 'lR'] + this[tb + 'rR'];
	};
	curvyCnrSpec.prototype.radiusCount = function(tb) {
		var count = 0;
		if (this[tb + 'lR']) ++count;
		if (this[tb + 'rR']) ++count;
		return count;
	};
	curvyCnrSpec.prototype.cornerNames = function() {
		var ret = [];
		if (this.tlR) ret.push('tl');
		if (this.trR) ret.push('tr');
		if (this.blR) ret.push('bl');
		if (this.brR) ret.push('br');
		return ret;
	};
	
	if (typeof redrawList === 'undefined') redrawList = new Array;
	
	$.fn.corner = function(options) {
		
		// Check for Native Round Corners
		var nativeCornersSupported = false;
		var checkWebkit, checkMozilla, checkStandard;
		try {	checkWebkit = (document.body.style.WebkitBorderRadius !== undefined);	} catch(err) {}
		try {	checkMozilla = (document.body.style.MozBorderRadius !== undefined);	} catch(err) {}
		try {	checkStandard = (document.body.style.BorderRadius !== undefined);	} catch(err) {}		
		if (checkWebkit || checkMozilla || checkStandard) nativeCornersSupported = true;
		
		if (options instanceof curvyCnrSpec) {
			settings = options;
		}
		else {
		
			var options = jQuery.extend({
				tl: { radius: 8 },
				tr: { radius: 8 },
				bl: { radius: 8 },
				br: { radius: 8 },
				antiAlias: true
			}, options);
			
			var settings = new curvyCnrSpec(this);
			settings.setfrom(options);
		
		}
		
  		// Apply the corners to the passed object!
		function curvyObject()
		{				
			// Setup Globals
			this.box              = arguments[1];
			this.settings         = arguments[0];
			var $$ 						= $(this.box);
			var boxDisp;
			
			this.masterCorners 			= new Array();
			//this.contentDIV 				= null;			
			this.topContainer = this.bottomContainer = this.shell = boxDisp = null;
		
			// Get CSS of box and define vars
			var boxWidth = $$.innerWidth(); // Does not include border width

			if ($$.is('table'))
				throw new Error("You cannot apply corners to " + this.box.tagName + " elements.", "Error");
			
			// try to handle attempts to style inline elements
			if ($$.css('display') === 'inline') {
				$$.css('display', 'inline-block');
			}
			
			// all attempts have failed
			
			if (!boxWidth) {
				this.applyCorners = function() {}; // make the error harmless
				return;
			}
			if (arguments[0] instanceof curvyCnrSpec) {
				this.spec = arguments[0].cloneOn(this.box); // convert non-pixel units
			} else {
				this.spec = new curvyCnrSpec('');
				this.spec.setfrom(this.settings); // no need for unit conversion, use settings param. directly
			}
			
			// Get box formatting details
			var borderWidth     = $$.css("borderTopWidth") ? $$.css("borderTopWidth") : 0;
			var borderWidthB    = $$.css("borderBottomWidth") ? $$.css("borderBottomWidth") : 0;
			var borderWidthL    = $$.css("borderLeftWidth") ? $$.css("borderLeftWidth") : 0;
			var borderWidthR    = $$.css("borderRightWidth") ? $$.css("borderRightWidth") : 0;
			var borderColour    = $$.css("borderTopColor");
			var borderColourB   = $$.css("borderBottomColor"); 
			var borderColourL   = $$.css("borderLeftColor"); 
			var borderColourR   = $$.css("borderRightColor"); 
			var borderStyle     = $$.css("borderTopStyle");
			var borderStyleB    = $$.css("borderBottomStyle");
			var borderStyleL    = $$.css("borderLeftStyle");
			var borderStyleR    = $$.css("borderRightStyle");
			
			var boxColour       = $$.css("backgroundColor");
			var backgroundImage = $$.css("backgroundImage");		
			var backgroundRepeat= $$.css("backgroundRepeat");
				
			var backgroundPosX, backgroundPosY;
			
			backgroundPosX  = $$.css("backgroundPositionX") ? $$.css("backgroundPositionX") : 0;
			backgroundPosY  = $$.css("backgroundPositionY") ? $$.css("backgroundPositionY") : 0;

			var boxPosition     = $$.css("position");
			var topPadding      = $$.css("paddingTop");
			var bottomPadding   = $$.css("paddingBottom");
			var leftPadding     = $$.css("paddingLeft");
			var rightPadding    = $$.css("paddingRight");
			var border          = $$.css("border");
			var filter = jQuery.browser.version > 7 && $.browser.msie ? $$.css("filter") : null; // IE8 bug fix
			
			var topMaxRadius    = this.spec.get('tR');
			var botMaxRadius    = this.spec.get('bR');
			
			var styleToNPx = function(val) {
				if (typeof val === 'number') return val;
				if (typeof val !== 'string') throw new Error('unexpected styleToNPx type ' + typeof val);
				var matches = /^[-\d.]([a-z]+)$/.exec(val);
				if (matches && matches[1] != 'px') throw new Error('Unexpected unit ' + matches[1]);
				if (isNaN(val = parseInt(val))) val = 0;
				return val;
			};
			var min0Px = function(val) {
				return val <= 0 ? "0" : val + "px";
			};
			
			// Set formatting properties
			try {
				this.borderWidth     = styleToNPx(borderWidth);
				this.borderWidthB    = styleToNPx(borderWidthB);
				this.borderWidthL    = styleToNPx(borderWidthL);
				this.borderWidthR    = styleToNPx(borderWidthR);
				this.boxColour       = curvyObject.format_colour(boxColour);
				this.topPadding      = styleToNPx(topPadding);
				this.bottomPadding   = styleToNPx(bottomPadding);
				this.leftPadding     = styleToNPx(leftPadding);
				this.rightPadding    = styleToNPx(rightPadding);
				this.boxWidth        = boxWidth;
				this.boxHeight       = $$.innerHeight(); // No border
				this.borderColour    = curvyObject.format_colour(borderColour);
				this.borderColourB   = curvyObject.format_colour(borderColourB);
				this.borderColourL   = curvyObject.format_colour(borderColourL);
				this.borderColourR   = curvyObject.format_colour(borderColourR);
				this.borderString    = this.borderWidth + "px" + " " + borderStyle + " " + this.borderColour;
				this.borderStringB   = this.borderWidthB + "px" + " " + borderStyleB + " " + this.borderColourB;
				this.borderStringL   = this.borderWidthL + "px" + " " + borderStyleL + " " + this.borderColourL;
				this.borderStringR   = this.borderWidthR + "px" + " " + borderStyleR + " " + this.borderColourR;
				this.backgroundImage = (backgroundImage != "none" && backgroundImage!="initial") ? backgroundImage : "";
				this.backgroundRepeat= backgroundRepeat;
			}
			catch(e) {}
			
			var clientHeight = this.boxHeight;
			var clientWidth = boxWidth; // save it as it gets trampled on later
			if ($.browser.opera) {
				backgroundPosX = styleToNPx(backgroundPosX);
				backgroundPosY = styleToNPx(backgroundPosY);
				if (backgroundPosX) {
					var t = clientWidth + this.borderWidthL + this.borderWidthR;
					if (backgroundPosX > t) backgroundPosX = t;
					backgroundPosX = (t / backgroundPosX * 100) + '%'; // convert to percentage
				}
				if (backgroundPosY) {
					var t = clientHeight + this.borderWidth + this.borderWidthB;
					if (backgroundPosY > t) backgroundPosY = t;
					backgroundPosY = (t / backgroundPosY * 100) + '%'; // convert to percentage
				}
			}

			// Create content container
			this.contentContainer = document.createElement("div");
			if (filter) this.contentContainer.style.filter = filter; // IE8 bug fix
			while (this.box.firstChild) this.contentContainer.appendChild(this.box.removeChild(this.box.firstChild));
			
			if (boxPosition != "absolute") $$.css("position", "relative");
			this.box.style.padding = '0';
			this.box.style.border = this.box.style.backgroundImage = 'none';
			this.box.style.backgroundColor = 'transparent';
			
			this.box.style.width   = (clientWidth + this.borderWidthL + this.borderWidthR) + 'px';
			this.box.style.height  = (clientHeight + this.borderWidth + this.borderWidthB) + 'px';
			
			// Ok we add an inner div to actually put things into this will allow us to keep the height
			
			var newMainContainer = document.createElement("div");
			$(newMainContainer).css({
				width: clientWidth + 'px',
				'padding':			"0",
				position:			"absolute", 
				height:				min0Px(clientHeight + this.borderWidth + this.borderWidthB - topMaxRadius - botMaxRadius),
				top:				topMaxRadius + "px",
				left:				"0",
				'backgroundColor':	boxColour,
				'backgroundImage':	this.backgroundImage,
				'backgroundRepeat':	this.backgroundRepeat,
				'direction':		'ltr'
			});
			
			if (filter) $(newMainContainer).css('filter', 'filter'); // IE8 bug fix

			if (this.borderWidthL)
				$(newMainContainer).css('borderLeft', this.borderStringL);
			if (this.borderWidth && !topMaxRadius)
				$(newMainContainer).css('borderTop', this.borderString);
			if (this.borderWidthR)
				$(newMainContainer).css('borderRight', this.borderStringR);
			if (this.borderWidthB && !botMaxRadius)
				$(newMainContainer).css('borderBottom', this.borderStringB);
				
			this.shell = this.box.appendChild(newMainContainer);
			
			boxWidth = $(this.shell).css("width");
			
			if (boxWidth === "" || boxWidth === "auto" || boxWidth.indexOf("%") !== -1) throw Error('Shell width is ' + boxWidth);
			
			this.boxWidth = (boxWidth != "" && boxWidth != "auto" && boxWidth.indexOf("%") == -1) ? parseInt(boxWidth) : $(this.shell).width();
			
			this.applyCorners = function() {
				/*
				Set up background offsets. This may need to be delayed until
				the background image is loaded.
				*/
				this.backgroundPosX = this.backgroundPosY = 0;
				if (this.backgroundObject) {
					var bgOffset = function(style, imglen, boxlen) {
						if (style === 0) return 0;
						var retval;
						if (style === 'right' || style === 'bottom') return boxlen - imglen;
						if (style === 'center') return (boxlen - imglen) / 2;
						if (style.indexOf('%') > 0) return (boxlen - imglen) / (100 / parseInt(style));
						return styleToNPx(style);
					};
					this.backgroundPosX  = bgOffset(backgroundPosX, this.backgroundObject.width, clientWidth);
					this.backgroundPosY  = bgOffset(backgroundPosY, this.backgroundObject.height, clientHeight);
				}
				else if (this.backgroundImage) {
					this.backgroundPosX = styleToNPx(backgroundPosX);
					this.backgroundPosY = styleToNPx(backgroundPosY);
				}
				/*
				Create top and bottom containers.
				These will be used as a parent for the corners and bars.
				*/
				// Build top bar only if a top corner is to be drawn
				if (topMaxRadius) {
					newMainContainer = document.createElement("div");
					
					$(newMainContainer).css({
						width: 				this.boxWidth + "px",
						'fontSize':			"1px",
						overflow:			"hidden", 
						position:			"absolute", 
						'paddingLeft':		this.borderWidth + "px",
						'paddingRight':		this.borderWidth + "px",						
						height:				topMaxRadius + "px",
						top:				-topMaxRadius + "px",
						left:				-this.borderWidthL + "px"
					});					
					this.topContainer = this.shell.appendChild(newMainContainer);
				}
				// Build bottom bar only if a bottom corner is to be drawn
				if (botMaxRadius) {
					var newMainContainer = document.createElement("div");
					
					$(newMainContainer).css({
						width: 				this.boxWidth + "px",
						'fontSize':			"1px",
						overflow:			"hidden", 
						position:			"absolute", 
						'paddingLeft':		this.borderWidthB + "px",
						'paddingRight':		this.borderWidthB + "px",					
						height:				botMaxRadius + "px",
						bottom:				-botMaxRadius + "px",
						left:				-this.borderWidthL + "px"
					});
					this.bottomContainer = this.shell.appendChild(newMainContainer);
				}
			
				var corners = this.spec.cornerNames();  // array of available corners
			
				/*
				Loop for each corner
				*/
				for (var i in corners) if (!isNaN(i)) {
					// Get current corner type from array
					var cc = corners[i];
					var specRadius = this.spec[cc + 'R'];
					// Has the user requested the currentCorner be round?
					// Code to apply correct color to top or bottom
					var bwidth, bcolor, borderRadius, borderWidthTB;
					if (cc == "tr" || cc == "tl") {
						bwidth = this.borderWidth;
						bcolor = this.borderColour;
						borderWidthTB = this.borderWidth;
					} else {
						bwidth = this.borderWidthB;
						bcolor = this.borderColourB;
						borderWidthTB = this.borderWidthB;
					}
					borderRadius = specRadius - borderWidthTB;
					
					var newCorner = document.createElement("div");
					
					$(newCorner).css({
						position:"absolute",
						"font-size":"1px", 
						overflow:"hidden"
					}).height(this.spec.get(cc + 'Ru')).width(this.spec.get(cc + 'Ru'));
					
					// THE FOLLOWING BLOCK OF CODE CREATES A ROUNDED CORNER
					// ---------------------------------------------------- TOP
					var intx, inty, outsideColour;
					var regExpFilter = /alpha\(opacity.(\d+)\)/;
					var trans = regExpFilter.test(filter)[1] ? parseInt(regExpFilter.exec(filter)[1]) : 100; // IE8 bug fix					// Cycle the x-axis
					for (intx = 0; intx < specRadius; ++intx) {
						// Calculate the value of y1 which identifies the pixels inside the border
						var y1 = (intx + 1 >= borderRadius) ? -1 : Math.floor(Math.sqrt(Math.pow(borderRadius, 2) - Math.pow(intx + 1, 2))) - 1;
						// Calculate y2 and y3 only if there is a border defined
						if (borderRadius != specRadius) {
							var y2 = (intx >= borderRadius) ? -1 : Math.ceil(Math.sqrt(Math.pow(borderRadius, 2) - Math.pow(intx, 2)));
							var y3 = (intx + 1 >= specRadius) ? -1 : Math.floor(Math.sqrt(Math.pow(specRadius, 2) - Math.pow((intx+1), 2))) - 1;
						}
						// Calculate y4
						var y4 = (intx >= specRadius) ? -1 : Math.ceil(Math.sqrt(Math.pow(specRadius, 2) - Math.pow(intx, 2)));
						// Draw bar on inside of the border with foreground colour
						if (y1 > -1) this.drawPixel(intx, 0, this.boxColour, trans, (y1 + 1), newCorner, true, specRadius);
						// Draw border/foreground antialiased pixels and border only if there is a border defined
						if (borderRadius != specRadius) {
							// Cycle the y-axis
							if (this.spec.antiAlias) {
								for (inty = y1 + 1; inty < y2; ++inty) {
									// For each of the pixels that need anti aliasing between the foreground and border colour draw single pixel divs
									if (this.backgroundImage != "") {
										var borderFract = curvyObject.pixelFraction(intx, inty, borderRadius) * 100;
										this.drawPixel(intx, inty, bcolor, trans, 1, newCorner, borderFract >= 30, specRadius);
									}
									else if (this.boxColour !== 'transparent') {
										var pixelcolour = curvyObject.BlendColour(this.boxColour, bcolor, curvyObject.pixelFraction(intx, inty, borderRadius));
										this.drawPixel(intx, inty, pixelcolour, trans, 1, newCorner, false, specRadius);
									}
									else this.drawPixel(intx, inty, bcolor, trans >> 1, 1, newCorner, false, specRadius);
								}
								// Draw bar for the border
								if (y3 >= y2) {
									if (y2 == -1) y2 = 0;
									this.drawPixel(intx, y2, bcolor, trans, (y3 - y2 + 1), newCorner, false, 0);
								}
								outsideColour = bcolor;  // Set the colour for the outside AA curve
								inty = y3;               // start_pos - 1 for y-axis AA pixels
							}
							else { // no antiAlias
								if (y3 > y1) { // NB condition was >=, changed to avoid zero-height divs
									this.drawPixel(intx, (y1 + 1), bcolor, trans, (y3 - y1), newCorner, false, 0);
								}
							}
						}
						else {
							outsideColour = this.boxColour;  // Set the colour for the outside curve
							inty = y1;               // start_pos - 1 for y-axis AA pixels
						}
						// Draw aa pixels?
						if (this.spec.antiAlias && this.boxColour !== 'transparent') {
							// Cycle the y-axis and draw the anti aliased pixels on the outside of the curve
							while (++inty < y4) {
								// For each of the pixels that need anti aliasing between the foreground/border colour & background draw single pixel divs
								this.drawPixel(intx, inty, outsideColour, (curvyObject.pixelFraction(intx, inty , specRadius) * trans), 1, newCorner, borderWidthTB <= 0, specRadius);
							}
						}
					}
					// END OF CORNER CREATION
					// ---------------------------------------------------- END
				
					/*
					Now we have a new corner we need to reposition all the pixels unless
					the current corner is the bottom right.
					*/
					// Loop through all children (pixel bars)
					for (var t = 0, k = newCorner.childNodes.length; t < k; ++t) {
						// Get current pixel bar
						var pixelBar = newCorner.childNodes[t];
						// Get current top and left properties
						var pixelBarTop    = parseInt($(pixelBar).css('top'));
						var pixelBarLeft   = parseInt($(pixelBar).css('left'));
						var pixelBarHeight = parseInt($(pixelBar).css('height'));
						// Reposition pixels
						if (cc == "tl" || cc == "bl") {
							$(pixelBar).css('left', (specRadius - pixelBarLeft - 1) + "px"); // Left
						}
						if (cc == "tr" || cc == "tl"){
							$(pixelBar).css('top', (specRadius - pixelBarHeight - pixelBarTop) + "px"); // Top
						}
						$(pixelBar).css('backgroundRepeat', this.backgroundRepeat);
	
						if (this.backgroundImage) switch(cc) {
							case "tr":
								$(pixelBar).css('backgroundPosition',(this.backgroundPosX - this.borderWidthL + specRadius - clientWidth - pixelBarLeft) + "px " + (this.backgroundPosY + pixelBarHeight + pixelBarTop + this.borderWidth - specRadius) + "px");
							break;
							case "tl":
								$(pixelBar).css('backgroundPosition',(this.backgroundPosX - specRadius + pixelBarLeft + 1 + this.borderWidthL) + "px " + (this.backgroundPosY - specRadius + pixelBarHeight + pixelBarTop + this.borderWidth) + "px");
							break;
							case "bl":
								$(pixelBar).css('backgroundPosition',(this.backgroundPosX - specRadius + pixelBarLeft + 1 + this.borderWidthL) + "px " + (this.backgroundPosY - clientHeight - this.borderWidth + (!jQuery.support.boxModel ? pixelBarTop : -pixelBarTop) + specRadius) + "px");
							break;
							case "br":
								// Quirks mode on?
								if (!jQuery.support.boxModel) {
									$(pixelBar).css('backgroundPosition',(this.backgroundPosX - this.borderWidthL - clientWidth + specRadius - pixelBarLeft) + "px " + (this.backgroundPosY - clientHeight - this.borderWidth + pixelBarTop + specRadius) + "px");
								} else {
									$(pixelBar).css('backgroundPosition',(this.backgroundPosX - this.borderWidthL - clientWidth + specRadius - pixelBarLeft) + "px " + (this.backgroundPosY - clientHeight - this.borderWidth + specRadius - pixelBarTop) + "px");
								}
							//break;
						}
					}
				
					// Position the container
					switch (cc) {
						case "tl":
							$(newCorner).css('top', newCorner.style.left = "0");
							this.topContainer.appendChild(newCorner);
						break;
						case "tr":
							$(newCorner).css('top', newCorner.style.right = "0");
							this.topContainer.appendChild(newCorner);
						break;
						case "bl":
							$(newCorner).css('bottom', newCorner.style.left = "0");
							this.bottomContainer.appendChild(newCorner);
						break;
						case "br":
							$(newCorner).css('bottom', newCorner.style.right = "0");
							this.bottomContainer.appendChild(newCorner);
						//break;
					}
				}
			
				/*
				The last thing to do is draw the rest of the filler DIVs.
				*/
				
				// Find out which corner has the bigger radius and get the difference amount
				var radiusDiff = {
					t : this.spec.radiusdiff('t'),
					b : this.spec.radiusdiff('b')
				};
				
				for (z in radiusDiff) {
					if (typeof z === 'function') continue; // for prototype, mootools frameworks
					if (!this.spec.get(z + 'R')) continue; // no need if no corners
					if (radiusDiff[z]) {
						// Get the type of corner that is the smaller one
						var smallerCornerType = (this.spec[z + "lR"] < this.spec[z + "rR"]) ? z + "l" : z + "r";
				
						// First we need to create a DIV for the space under the smaller corner
						var newFiller = document.createElement("div");	
						
						$(newFiller).css({
							'height':			radiusDiff[z] + "px",
							'width':			this.spec.get(smallerCornerType + 'Ru'),
							'position':			"absolute",
							'fontSize':			"1px",
							'overflow':			"hidden",
							'backgroundColor':	this.boxColour,
							'backgroundImage':	this.backgroundImage,
							'backgroundRepeat':	this.backgroundRepeat
						});					
						
						if (filter) $(newFiller).css('filter', 'filter'); // IE8 bug fix

						// Position filler
						switch (smallerCornerType) {
							case "tl":
								$(newFiller).css({
									'bottom':				'',
									'left':					'0',
									'borderLeft':			this.borderStringL,
									'backgroundPosition':	this.backgroundPosX + "px " + (this.borderWidth + this.backgroundPosY - this.spec.tlR) + "px"
								});
								this.topContainer.appendChild(newFiller);
							break;
							case "tr":
								$(newFiller).css({
									'bottom':				'',
									'right':					'0',
									'borderRight':			this.borderStringR,
									'backgroundPosition':	(this.backgroundPosX - this.boxWidth + this.spec.trR) + "px " + (this.borderWidth + this.backgroundPosY - this.spec.trR) + "px"
								});
								this.topContainer.appendChild(newFiller);
							break;
							case "bl":
								$(newFiller).css({
									'top':					'',
									'left':					'0',
									'borderLeft':			this.borderStringL,
									'backgroundPosition':	this.backgroundPosX + "px " + (this.backgroundPosY - this.borderWidth - this.boxHeight + radiusDiff[z] + this.spec.blR) + "px"
								});
								this.bottomContainer.appendChild(newFiller);
							break;
							case "br":
								$(newFiller).css({
									'top':					'',
									'right':				'0',
									'borderRight':			this.borderStringR,
									'backgroundPosition':	(this.borderWidthL + this.backgroundPosX - this.boxWidth + this.spec.brR) + "px " + (this.backgroundPosY - this.borderWidth - this.boxHeight + radiusDiff[z] + this.spec.brR) + "px"
								});
								this.bottomContainer.appendChild(newFiller);
							//break;
						}
					}
				
					// Create the bar to fill the gap between each corner horizontally
					var newFillerBar = document.createElement("div");
					if (filter) $(newFillerBar).css('filter', 'filter'); // IE8 bug fix
					$(newFillerBar).css({
						'position':					"relative",
						'fontSize':					"1px",
						'overflow':					"hidden",
						'width':					this.fillerWidth(z),
						'backgroundColor':			this.boxColour,
						'backgroundImage':			this.backgroundImage,
						'backgroundRepeat':			this.backgroundRepeat
					});
				
					switch (z) {
						case "t":
							// Top Bar
							if (this.topContainer) {
								if (!jQuery.support.boxModel) {
									$(newFillerBar).css('height', 100 + topMaxRadius + "px");
								} else {
									$(newFillerBar).css('height', 100 + topMaxRadius - this.borderWidth + "px");
								}
								$(newFillerBar).css('marginLeft', this.spec.tlR ? (this.spec.tlR - this.borderWidthL) + "px" : "0");
								$(newFillerBar).css('borderTop', this.borderString);
								if (this.backgroundImage) {
									var x_offset = this.spec.tlR ?
										(this.borderWidthL + this.backgroundPosX - this.spec.tlR) + "px " : this.backgroundPosX + "px ";
									
									$(newFillerBar).css('backgroundPosition', x_offset + this.backgroundPosY + "px");
				
									// Reposition the box's background image
									$(this.shell).css('backgroundPosition', this.backgroundPosX + "px " + (this.backgroundPosY - topMaxRadius + this.borderWidthL) + "px");
								}
								this.topContainer.appendChild(newFillerBar);
							}
						break;
						case "b":
							if (this.bottomContainer) {
								// Bottom Bar
								if (!jQuery.support.boxModel) {
									$(newFillerBar).css('height', botMaxRadius + "px");
								} else {
									$(newFillerBar).css('height', botMaxRadius - this.borderWidthB + "px");
								}
								$(newFillerBar).css('marginLeft', this.spec.blR ? (this.spec.blR - this.borderWidthL) + "px" : "0");
								$(newFillerBar).css('borderBottom', this.borderStringB);
								if (this.backgroundImage) {
									var x_offset = this.spec.blR ?
										(this.backgroundPosX + this.borderWidthL - this.spec.blR) + "px " : this.backgroundPosX + "px ";
									$(newFillerBar).css('backgroundPosition', x_offset + (this.backgroundPosY - clientHeight - this.borderWidth + botMaxRadius) + "px");
								}
								this.bottomContainer.appendChild(newFillerBar);
							}
						//break;
					}
				}			
			
				// style content container
				z = clientWidth;				
				if (jQuery.support.boxModel) z -= this.leftPadding + this.rightPadding;
				
				$(this.contentContainer).css({
					'position':			'absolute',
					'left':				this.borderWidthL + "px",
					'paddingTop':		this.topPadding + "px",
					'top':				this.borderWidth + "px",
					'paddingLeft':		this.leftPadding + "px",
					'paddingRight':		this.rightPadding + "px",
					'width':			z + "px",
					'textAlign':		$$.css('textAlign')
				}).addClass('autoPadDiv');
				
				$$.css('textAlign', 'left').addClass('hasCorners');
	
				this.box.appendChild(this.contentContainer);
				if (boxDisp) $(boxDisp).css('display', boxDispSave);
			};
			
			if (this.backgroundImage) {				
				backgroundPosX = this.backgroundCheck(backgroundPosX);
				backgroundPosY = this.backgroundCheck(backgroundPosY);
				if (this.backgroundObject) {
					this.backgroundObject.holdingElement = this;
					this.dispatch = this.applyCorners;
					this.applyCorners = function() {
						if (this.backgroundObject.complete) this.dispatch();
						else this.backgroundObject.onload = new Function('$(this.holdingElement).dispatch();');
					};
				}
			}
		};
		
		curvyObject.prototype.backgroundCheck = function(style) {
		  if (style === 'top' || style === 'left' || parseInt(style) === 0) return 0;
		  if (!(/^[-\d.]+px$/.test(style))  && !this.backgroundObject) {
		    this.backgroundObject = new Image;
		    var imgName = function(str) {
		      var matches = /url\("?([^'"]+)"?\)/.exec(str);
		      return (matches ? matches[1] : str);
		    };
		    this.backgroundObject.src = imgName(this.backgroundImage);
		  }
		  return style;
		};		
		
		/*curvyObject.dispatch = function(obj) {
		  if ('dispatch' in obj) obj.dispatch();
		  else throw Error('No dispatch function');
		};*/
		
		/*
		This function draws the pixels
		*/	
		curvyObject.prototype.drawPixel = function( intx, inty, colour, transAmount, height, newCorner, image, cornerRadius ) {			
			//var $$ = $(box);			
		    var pixel = document.createElement("div");
		    
		    $(pixel).css({	
		    	"height" :			height + "px",
		    	"width" :			"1px", 
		    	"position" :		"absolute", 
		    	"font-size" :		"1px", 
		    	"overflow" :		"hidden",
		    	"top" :				inty + "px",
		    	"left" :			intx + "px",
		    	"background-color" :colour
		    });
		    
		    var topMaxRadius = this.spec.get('tR');
		    
		    // Dont apply background image to border pixels
			if(image && this.backgroundImage != "")
			{
				$(pixel).css({
					"background-position":"-" + (this.boxWidth - (cornerRadius - intx) + this.borderWidth) + "px -" + ((this.boxHeight + topMaxRadius + inty) - this.borderWidth) + "px",
					"background-image":this.backgroundImage				 
				});
			}		    
		    if (transAmount != 100)
		    	$(pixel).css({opacity: (transAmount/100) });

		    newCorner.appendChild(pixel);
		};
		
		curvyObject.prototype.fillerWidth = function(tb) {
			var b_width, f_width;
			b_width = !jQuery.support.boxModel ? 0 : this.spec.radiusCount(tb) * this.borderWidthL;
			
			if ((f_width = this.boxWidth - this.spec.radiusSum(tb) + b_width) < 0)
				throw Error("Radius exceeds box width");
			return f_width + 'px';
		};			
		
		// Gets the computed colour.
		curvyObject.getComputedColour = function(colour) {
		  var d = document.createElement('DIV');
		  d.style.backgroundColor = colour;
		  document.body.appendChild(d);
		
		  if (window.getComputedStyle) { // Mozilla, Opera, Chrome, Safari
		    var rtn = document.defaultView.getComputedStyle(d, null).getPropertyValue('background-color');
		    d.parentNode.removeChild(d);
		    if (rtn.substr(0, 3) === "rgb") rtn = curvyObject.rgb2Hex(rtn);
		    return rtn;
		  }
		  else { // IE
		    var rng = document.body.createTextRange();
		    rng.moveToElementText(d);
		    rng.execCommand('ForeColor', false, colour);
		    var iClr = rng.queryCommandValue('ForeColor');
		    var rgb = "rgb("+(iClr & 0xFF)+", "+((iClr & 0xFF00)>>8)+", "+((iClr & 0xFF0000)>>16)+")";
		    d.parentNode.removeChild(d);
		    rng = null;
		    return curvyObject.rgb2Hex(rgb);
		  }
		};
				
		curvyObject.BlendColour = function(Col1, Col2, Col1Fraction) 
		{
			
			if (Col1 === 'transparent' || Col2 === 'transparent') throw Error('Cannot blend with transparent');
			if (Col1.charAt(0) !== '#') {
				Col1 = curvyObject.format_colour(Col1);
			}
			if (Col2.charAt(0) !== '#') {
				Col2 = curvyObject.format_colour(Col2);
			}
			var red1 = parseInt(Col1.substr(1, 2), 16);
			var green1 = parseInt(Col1.substr(3, 2), 16);
			var blue1 = parseInt(Col1.substr(5, 2), 16);
			var red2 = parseInt(Col2.substr(1, 2), 16);
			var green2 = parseInt(Col2.substr(3, 2), 16);
			var blue2 = parseInt(Col2.substr(5, 2), 16);
			
			if (Col1Fraction > 1 || Col1Fraction < 0) Col1Fraction = 1;
			
			var endRed = Math.round((red1 * Col1Fraction) + (red2 * (1 - Col1Fraction)));
			if (endRed > 255) endRed = 255;
			if (endRed < 0) endRed = 0;
			
			var endGreen = Math.round((green1 * Col1Fraction) + (green2 * (1 - Col1Fraction)));
			if (endGreen > 255) endGreen = 255;
			if (endGreen < 0) endGreen = 0;
			
			var endBlue = Math.round((blue1 * Col1Fraction) + (blue2 * (1 - Col1Fraction)));
			if (endBlue > 255) endBlue = 255;
			if (endBlue < 0) endBlue = 0;
			
			return "#" + curvyObject.IntToHex(endRed) + curvyObject.IntToHex(endGreen)+ curvyObject.IntToHex(endBlue);
			
		};
	
		curvyObject.IntToHex = function(strNum)
		{			
			var hexdig = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' ];
			return hexdig[strNum >>> 4] + '' + hexdig[strNum & 15];
		};
	
		/*
		For a pixel cut by the line determines the fraction of the pixel on the 'inside' of the
		line.  Returns a number between 0 and 1
		*/
		curvyObject.pixelFraction = function(x, y, r) 
		{
  			var fraction;
 			var rsquared = r * r;

			/*
			determine the co-ordinates of the two points on the perimeter of the pixel that the
			circle crosses
			*/
			var xvalues = new Array(2);
			var yvalues = new Array(2);
			var point = 0;
			var whatsides = "";

			// x + 0 = Left
			var intersect = Math.sqrt(rsquared - Math.pow(x, 2));
			
			if (intersect >= y && intersect < (y + 1)) {
				whatsides = "Left";
				xvalues[point] = 0;
				yvalues[point] = intersect - y;
				++point;
			}
			// y + 1 = Top
			intersect = Math.sqrt(rsquared - Math.pow(y + 1, 2));
			
			if (intersect >= x && intersect < (x + 1)) {
				whatsides += "Top";
				xvalues[point] = intersect - x;
				yvalues[point] = 1;
				++point;
			}
			// x + 1 = Right
			intersect = Math.sqrt(rsquared - Math.pow(x + 1, 2));
			
			if (intersect >= y && intersect < (y + 1)) {
				whatsides += "Right";
				xvalues[point] = 1;
				yvalues[point] = intersect - y;
				++point;
			}
			// y + 0 = Bottom
			intersect = Math.sqrt(rsquared - Math.pow(y, 2));
			
			if (intersect >= x && intersect < (x + 1)) {
				whatsides += "Bottom";
				xvalues[point] = intersect - x;
				yvalues[point] = 0;
			}

			/*
			depending on which sides of the perimeter of the pixel the circle crosses calculate the
			fraction of the pixel inside the circle
			*/
			switch (whatsides) {
				case "LeftRight":
					fraction = Math.min(yvalues[0], yvalues[1]) + ((Math.max(yvalues[0], yvalues[1]) - Math.min(yvalues[0], yvalues[1])) / 2);
				break;
				
				case "TopRight":
					fraction = 1 - (((1 - xvalues[0]) * (1 - yvalues[1])) / 2);
				break;
				
				case "TopBottom":
					fraction = Math.min(xvalues[0], xvalues[1]) + ((Math.max(xvalues[0], xvalues[1]) - Math.min(xvalues[0], xvalues[1])) / 2);
				break;
				
				case "LeftBottom":
					fraction = yvalues[0] * xvalues[1] / 2;
				break;
				
				default:
					fraction = 1;
			}			
			return fraction;
		};
  
  
		// This function converts CSS rgb(x, x, x) to hexadecimal
		curvyObject.rgb2Hex = function(rgbColour) 
		{
			try{
			
				// Get array of RGB values
				var rgbArray = curvyObject.rgb2Array(rgbColour);
				
				// Get RGB values
				var red   = parseInt(rgbArray[0]);
				var green = parseInt(rgbArray[1]);
				var blue  = parseInt(rgbArray[2]);
				
				// Build hex colour code
				var hexColour = "#" + curvyObject.IntToHex(red) + curvyObject.IntToHex(green) + curvyObject.IntToHex(blue);
			}
			catch(e){			
				alert("There was an error converting the RGB value to Hexadecimal in function rgb2Hex");
			}
			
			return hexColour;
		};
		
		// Returns an array of rbg values
		curvyObject.rgb2Array = function(rgbColour) 
		{
			// Remove rgb()
			var rgbValues = rgbColour.substring(4, rgbColour.indexOf(")"));

			// Split RGB into array
			return rgbValues.split(", ");
		};

		// Formats colours
		curvyObject.format_colour = function(colour) 
		{
			// Make sure colour is set and not transparent
			if (colour != "" && colour != "transparent") {
			  // RGB Value?
			  if (colour.substr(0, 3) === "rgb") {
			    // Get HEX aquiv.
			    colour = curvyObject.rgb2Hex(colour);
			  }
			  else if (colour.charAt(0) !== '#') {
			    // Convert colour name to hex value
			    colour = getComputedColour(colour);
			  }
			  else if (colour.length === 4) {
			    // 3 chr colour code add remainder
			    colour = "#" + colour.charAt(1) + colour.charAt(1) + colour.charAt(2) + colour.charAt(2) + colour.charAt(3) + colour.charAt(3);
			  }
			}
			return colour;
		};	
		  
		return this.each(function() {
			if (!$(this).is('.hasCorners')) {
				if (nativeCornersSupported) {
					if (settings.get('tlR')) {
						$(this).css({
							'border-top-left-radius' : settings.get('tlR') + 'px',
							'-moz-border-radius-topleft' : settings.get('tlR') + 'px',
							'-webkit-border-top-left-radius' : settings.get('tlR') + 'px'
						});
					}
					if (settings.get('trR')) {
						$(this).css({
							'border-top-right-radius' : settings.get('trR') + 'px',
							'-moz-border-radius-topright' : settings.get('trR') + 'px',
							'-webkit-border-top-right-radius' : settings.get('trR') + 'px'
						});
					}
					if (settings.get('blR')) {
						$(this).css({
							'border-bottom-left-radius' : settings.get('blR') + 'px',
							'-moz-border-radius-bottomleft' : settings.get('blR') + 'px',
							'-webkit-border-bottom-left-radius' : settings.get('blR') + 'px'
						});
					}
					if (settings.get('brR')) {
						$(this).css({
							'border-bottom-right-radius' : settings.get('brR') + 'px',
							'-moz-border-radius-bottomright' : settings.get('brR') + 'px',
							'-webkit-border-bottom-right-radius' : settings.get('brR') + 'px'
						});
					}
				} else {
					if (!$(this).is('.drawn')) {						
						$(this).addClass('drawn');
						
						thestyles = $(this).attr('style');
						if (thestyles == 'undefined') {
							thestyles = '';
						}
						
						redrawList.push({
						  node : this,
						  spec : settings,
						  style : thestyles,
						  copy : $(this).clone(true)
						});
					}
					var obj = new curvyObject(settings, this);
					obj.applyCorners();
				}			
			}			
		});
			
	};
	
	$.fn.removeCorners = function() { 
		return this.each(function(i, e) {
			thisdiv = e;
			$.each(
				redrawList,
				function( intIndex, list ){	
					if (list.node==thisdiv && $('.autoPadDiv', thisdiv).size()>0) {
						//$('div:not(.autoPadDiv)', thisdiv).remove();
						//$('.autoPadDiv', thisdiv).replaceWith( $('.autoPadDiv', thisdiv).contents() );							
						$(thisdiv).html($(thisdiv).children('.autoPadDiv:first').contents());						
						style = list.style == 'undefined' ? list.style : ''; 
						$(thisdiv).removeClass('hasCorners').attr('style', style );						
						return false;
					}
				}
			);
		});
	};
	
	$.fn.redrawCorners = function() { 
		return this.each(function(i, e) {
			thisdiv = e;
			$.each(
				redrawList,				
				function( intIndex, list ){	
					if (list.node==thisdiv) {
						//$('div:not(.autoPadDiv)', thisdiv).remove();
						//$('.autoPadDiv', thisdiv).replaceWith( $('.autoPadDiv', thisdiv).contents() );	
						//style = list.style == 'undefined' ? list.style : ''; 
						//$(thisdiv).removeClass('hasCorners').attr('style', style );	
						$(thisdiv).corner(list.spec);
						return false;
					}
				}
			);
		});
	};
	
	$.fn.dispatch = function() { 
		return this.each(function(i, e) {
			obj = e;
			if ('dispatch' in obj) obj.dispatch();
			else throw Error('No dispatch function')
		});			
	};
	
	$(function(){
		
		// Detect styles and apply corners in browsers with no native border-radius support
		if ($.browser.msie) {	
			/* Force caching of bg images in IE6 */
			try {	document.execCommand("BackgroundImageCache", false, true);	}	catch(e) {};
			
			function units(num) {
				if (!parseInt(num)) return 'px'; // '0' becomes '0px' for simplicity's sake
				var matches = /^[\d.]+(\w+)$/.exec(num);
				return matches[1];
			};
			
			/* Detect and Apply Corners */
			var t, i, j;
			
			function procIEStyles(rule) {
				var style = rule.style;
			
				if (jQuery.browser.version > 6.0) {
					var allR = style['-moz-border-radius'] || 0;
					var tR   = style['-moz-border-radius-topright'] || 0;
					var tL   = style['-moz-border-radius-topleft'] || 0;
					var bR   = style['-moz-border-radius-bottomright'] || 0;
					var bL   = style['-moz-border-radius-bottomleft'] || 0;
				}
				else {
					var allR = style['moz-border-radius'] || 0;
					var tR   = style['moz-border-radius-topright'] || 0;
					var tL   = style['moz-border-radius-topleft'] || 0;
					var bR   = style['moz-border-radius-bottomright'] || 0;
					var bL   = style['moz-border-radius-bottomleft'] || 0;
				}
				if (allR) {
					var t = allR.split('/'); // ignore elliptical spec.
					t = t[0].split(/\s+/);
					if (t[t.length - 1] === '') t.pop();
					switch (t.length) {
						case 3:
							tL = t[0];
							tR = bL = t[1];
							bR = t[2];
							allR = false;
						break;
						case 2:
							tL = bR = t[0];
							tR = bL = t[1];
							allR = false;
						case 1:
						break;
						case 4:
							tL = t[0];
							tR = t[1];
							bR = t[2];
							bL = t[3];
							allR = false;
						break;
						default:
							alert('Illegal corners specification: ' + allR);
					}
				}
				if (allR || tL || tR || bR || bL) {
					var settings = new curvyCnrSpec(rule.selectorText);
					if (allR)
						settings.setcorner(null, null, parseInt(allR), units(allR));
					else {
						if (tR) settings.setcorner('t', 'r', parseInt(tR), units(tR));
						if (tL) settings.setcorner('t', 'l', parseInt(tL), units(tL));
						if (bL) settings.setcorner('b', 'l', parseInt(bL), units(bL));
						if (bR) settings.setcorner('b', 'r', parseInt(bR), units(bR));
					}
					$(rule.selectorText).corner(settings);
				}
			}
			for (t = 0; t < document.styleSheets.length; ++t) {
				try {
					if (document.styleSheets[t].imports) {
						for (i = 0; i < document.styleSheets[t].imports.length; ++i) {
							for (j = 0; j < document.styleSheets[t].imports[i].rules.length; ++j) {
								procIEStyles(document.styleSheets[t].imports[i].rules[j]);
							}
						}
					}
					for (i = 0; i < document.styleSheets[t].rules.length; ++i)
						procIEStyles(document.styleSheets[t].rules[i]);
				}
				catch (e) {} 
			}
		} else if ($.browser.opera) {
			
			// Apply if border radius is not supported
			try {	checkStandard = (document.body.style.BorderRadius !== undefined);	} catch(err) {}
			
			if (!checkStandard) {
		
				function opera_contains_border_radius(sheetnumber) {
					return /border-((top|bottom)-(left|right)-)?radius/.test(document.styleSheets.item(sheetnumber).ownerNode.text);
				};
				
				rules = [];
			
				for (t = 0; t < document.styleSheets.length; ++t) {
					if (opera_contains_border_radius(t)) {
				   	
				   		var txt = document.styleSheets.item(sheetnumber).ownerNode.text;
				   		txt = txt.replace(/\/\*(\n|\r|.)*?\*\//g, ''); // strip comments
				   		
				   		var pat = new RegExp("^\\s*([\\w.#][-\\w.#, ]+)[\\n\\s]*\\{([^}]+border-((top|bottom)-(left|right)-)?radius[^}]*)\\}", "mg");
				   		var matches;				   		
				   		while ((matches = pat.exec(txt)) !== null) {
				   			var pat2 = new RegExp("(..)border-((top|bottom)-(left|right)-)?radius:\\s*([\\d.]+)(in|em|px|ex|pt)", "g");
				   			var submatches, cornerspec = new curvyCnrSpec(matches[1]);
				   			while ((submatches = pat2.exec(matches[2])) !== null) {
				   				if (submatches[1] !== "z-")
				   				    cornerspec.setcorner(submatches[3], submatches[4], submatches[5], submatches[6]);
				   				rules.push(cornerspec);
				   			}
				   		}
				   	}
				}				
				for (i in rules) if (!isNaN(i))
					$(rules[i].selectorText).corner(rules[i]);
					
					
			}
		}
	});		
	
})(jQuery);


/**
 * jQuery lightBox plugin
 * This jQuery plugin was inspired and based on Lightbox 2 by Lokesh Dhakar (http://www.huddletogether.com/projects/lightbox2/)
 * and adapted to me for use like a plugin from jQuery.
 * @name jquery-lightbox-0.5.js
 * @author Leandro Vieira Pinho - http://leandrovieira.com
 * @version 0.5
 * @date April 11, 2008
 * @category jQuery plugin
 * @copyright (c) 2008 Leandro Vieira Pinho (leandrovieira.com)
 * @license CCAttribution-ShareAlike 2.5 Brazil - http://creativecommons.org/licenses/by-sa/2.5/br/deed.en_US
 * @example Visit http://leandrovieira.com/projects/jquery/lightbox/ for more informations about this jQuery plugin
 */

// Offering a Custom Alias suport - More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
(function($) {
	/**
	 * $ is an alias to jQuery object
	 *
	 */
	$.fn.lightBox = function(settings) {
		// Settings to configure the jQuery lightBox plugin how you like
		settings = jQuery.extend({
			// Configuration related to overlay
			overlayBgColor: 		'#000',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
			overlayOpacity:			0.8,		// (integer) Opacity value to overlay; inform: 0.X. Where X are number from 0 to 9
			// Configuration related to navigation
			fixedNavigation:		false,		// (boolean) Boolean that informs if the navigation (next and prev button) will be fixed or not in the interface.
			// Configuration related to images
			imagePathPrefix: 		'',
			imageLoading:			settings.imagePathPrefix+'/images/lightbox-ico-loading.gif',		// (string) Path and the name of the loading icon
			imageBtnPrev:			settings.imagePathPrefix+'/images/lightbox-btn-prev.gif',			// (string) Path and the name of the prev button image
			imageBtnNext:			settings.imagePathPrefix+'/images/lightbox-btn-next.gif',			// (string) Path and the name of the next button image
			imageBtnClose:			settings.imagePathPrefix+'/images/lightbox-btn-close.gif',		// (string) Path and the name of the close btn
			imageBlank:				settings.imagePathPrefix+'/images/lightbox-blank.gif',			// (string) Path and the name of a blank image (one pixel)
			// Configuration related to container image box
			containerBorderSize:	10,			// (integer) If you adjust the padding in the CSS for the container, #lightbox-container-image-box, you will need to update this value
			containerResizeSpeed:	400,		// (integer) Specify the resize duration of container image. These number are miliseconds. 400 is default.
			// Configuration related to texts in caption. For example: Image 2 of 8. You can alter either "Image" and "of" texts.
			txtImage:				'Image',	// (string) Specify text "Image"
			txtOf:					'of',		// (string) Specify text "of"
			// Configuration related to keyboard navigation
			keyToClose:				'c',		// (string) (c = close) Letter to close the jQuery lightBox interface. Beyond this letter, the letter X and the SCAPE key is used to.
			keyToPrev:				'p',		// (string) (p = previous) Letter to show the previous image
			keyToNext:				'n',		// (string) (n = next) Letter to show the next image.
			// Don´t alter these variables in any way
			imageArray:				[],
			activeImage:			0,
			maxwidth: 				780
		},settings);
		// Caching the jQuery object with all elements matched
		var jQueryMatchedObj = this; // This, in this context, refer to jQuery object
		/**
		 * Initializing the plugin calling the start function
		 *
		 * @return boolean false
		 */
		function _initialize() {
			_start(this,jQueryMatchedObj); // This, in this context, refer to object (link) which the user have clicked
			return false; // Avoid the browser following the link
		}
		/**
		 * Start the jQuery lightBox plugin
		 *
		 * @param object objClicked The object (link) whick the user have clicked
		 * @param object jQueryMatchedObj The jQuery object with all elements matched
		 */
		function _start(objClicked,jQueryMatchedObj) {
			// Hime some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'hidden' });
			// Call the function to create the markup structure; style some elements; assign events in some elements.
			_set_interface();
			// Unset total images in imageArray
			settings.imageArray.length = 0;
			// Unset image active information
			settings.activeImage = 0;
			// We have an image set? Or just an image? Let´s see it.
			if ( jQueryMatchedObj.length == 1 ) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
			} else {
				// Add an Array (as many as we have), with href and title atributes, inside the Array that storage the images references		
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
				}
			}
			while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
			// Call the function that prepares image exibition
			_set_image_to_view();
		}
		/**
		 * Create the jQuery lightBox plugin interface
		 *
		 * The HTML markup will be like that:
			<div id="jquery-overlay"></div>
			<div id="jquery-lightbox">
				<div id="lightbox-container-image-box">
					<div id="lightbox-container-image">
						<img src="../fotos/XX.jpg" id="lightbox-image">
						<div id="lightbox-nav">
							<a href="#" id="lightbox-nav-btnPrev"></a>
							<a href="#" id="lightbox-nav-btnNext"></a>
						</div>
						<div id="lightbox-loading">
							<a href="#" id="lightbox-loading-link">
								<img src="../images/lightbox-ico-loading.gif">
							</a>
						</div>
					</div>
				</div>
				<div id="lightbox-container-image-data-box">
					<div id="lightbox-container-image-data">
						<div id="lightbox-image-details">
							<span id="lightbox-image-details-caption"></span>
							<span id="lightbox-image-details-currentNumber"></span>
						</div>
						<div id="lightbox-secNav">
							<a href="#" id="lightbox-secNav-btnClose">
								<img src="../images/lightbox-btn-close.gif">
							</a>
						</div>
					</div>
				</div>
			</div>
		 *
		 */
		function _set_interface() {
			// Apply the HTML markup into body tag
			$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');	
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			// Style overlay and show it
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			// Get page scroll
			var arrPageScroll = ___getPageScroll();
			// Calculate top and left offset for the jquery-lightbox div object and show it
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
			// Assigning click events in elements to close overlay
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
			// Assign the _finish function to lightbox-loading-link and lightbox-secNav-btnClose objects
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
			// If window was resized, calculate the new overlay dimensions
			$(window).resize(function() {
				// Get page sizes
				var arrPageSizes = ___getPageSize();
				// Style overlay and show it
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				// Get page scroll
				var arrPageScroll = ___getPageScroll();
				// Calculate top and left offset for the jquery-lightbox div object and show it
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
			});
		}
		/**
		 * Prepares image exibition; doing a image´s preloader to calculate it´s size
		 *
		 */
		function _set_image_to_view() { // show the loading
			// Show the loading
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				// Hide some elements
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
			// Image preload process
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
				if (objImagePreloader.width > settings.maxwidth) {
					var newheight = objImagePreloader.height/objImagePreloader.width*(settings.maxwidth-2*settings.containerBorderSize);
					objImagePreloader.height = newheight;
					objImagePreloader.width = settings.maxwidth-2*settings.containerBorderSize;
					$('#lightbox-image').attr({'width':objImagePreloader.width, 'height':objImagePreloader.height })
				}
				// Perfomance an effect in the image container resizing it
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);
				//	clear onLoad, IE behaves irratically with animated gifs otherwise
				objImagePreloader.onload=function(){};
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		/**
		 * Perfomance an effect in the image container resizing it
		 *
		 * @param integer intImageWidth The image´s width that will be showed
		 * @param integer intImageHeight The image´s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight) {
			// Get current width and height
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			// Get the width and height of the selected image plus the padding
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); // Plus the image´s width and the left and right padding value
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); // Plus the image´s height and the left and right padding value
			// Diferences
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			// Perfomance the effect
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },settings.containerResizeSpeed,function() { _show_image(); });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		/**
		 * Show the prepared image
		 *
		 */
		function _show_image() {
			$('#lightbox-loading').hide();
			$('#lightbox-image').fadeIn(function() {
				_show_image_data();
				_set_navigation();
			});
			_preload_neighbor_images();
		};
		/**
		 * Show the image information
		 *
		 */
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			// If we have a image set, display 'Image X of X'
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}		
		}
		/**
		 * Display the button navigations
		 *
		 */
		function _set_navigation() {
			$('#lightbox-nav').show();

			// Instead to define this configuration in CSS file, we define here. And it´s need to IE. Just.
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
			
			// Show the prev button, if not the first image in set
			if ( settings.activeImage != 0 ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnPrev').css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage - 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			
			// Show the next button, if not the last image in set
			if ( settings.activeImage != ( settings.imageArray.length -1 ) ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnNext').css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage + 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			// Enable keyboard navigation
			_enable_keyboard_navigation();
		}
		/**
		 * Enable a support to keyboard navigation
		 *
		 */
		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent);
			});
		}
		/**
		 * Disable the support to keyboard navigation
		 *
		 */
		function _disable_keyboard_navigation() {
			$(document).unbind();
		}
		/**
		 * Perform the keyboard actions
		 *
		 */
		function _keyboard_action(objEvent) {
			// To ie
			if ( objEvent == null ) {
				keycode = event.keyCode;
				escapeKey = 27;
			// To Mozilla
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE;
			}
			// Get the key in lower case form
			key = String.fromCharCode(keycode).toLowerCase();
			// Verify the keys to close the ligthBox
			if ( ( key == settings.keyToClose ) || ( key == 'x' ) || ( keycode == escapeKey ) ) {
				_finish();
			}
			// Verify the key to show the previous image
			if ( ( key == settings.keyToPrev ) || ( keycode == 37 ) ) {
				// If we´re not showing the first image, call the previous
				if ( settings.activeImage != 0 ) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
			// Verify the key to show the next image
			if ( ( key == settings.keyToNext ) || ( keycode == 39 ) ) {
				// If we´re not showing the last image, call the next
				if ( settings.activeImage != ( settings.imageArray.length - 1 ) ) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
		}
		/**
		 * Preload prev and next images being showed
		 *
		 */
		function _preload_neighbor_images() {
			if ( (settings.imageArray.length -1) > settings.activeImage ) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage + 1][0];
			}
			if ( settings.activeImage > 0 ) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage -1][0];
			}
		}
		/**
		 * Remove jQuery lightBox plugin HTML markup
		 *
		 */
		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() { $('#jquery-overlay').remove(); });
			// Show some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'visible' });
		}
		/**
		 / THIRD FUNCTION
		 * getPageSize() by quirksmode.com
		 *
		 * @return Array Return an array with page width, height and window width, height
		 */
		function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		};
		/**
		 / THIRD FUNCTION
		 * getPageScroll() by quirksmode.com
		 *
		 * @return Array Return an array with x,y page scroll values.
		 */
		function ___getPageScroll() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft;
			} else if (document.body) {// all other Explorers
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft;	
			}
			arrayPageScroll = new Array(xScroll,yScroll);
			return arrayPageScroll;
		};
		 /**
		  * Stop the code execution from a escified time in milisecond
		  *
		  */
		 function ___pause(ms) {
			var date = new Date(); 
			curDate = null;
			do { var curDate = new Date(); }
			while ( curDate - date < ms);
		 };
		// Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
		return this.unbind('click').click(_initialize);
	};
})(jQuery); // Call and execute the function immediately passing the jQuery object



/*!
	reflection.js for jQuery v1.03
	(c) 2006-2009 Christophe Beyls <http://www.digitalia.be>
	MIT-style license.
*/

(function($) {

$.fn.extend({
	reflect: function(options) {
		options = $.extend({
			height: 1/3,
			opacity: 0.5
		}, options);

		return this.unreflect().each(function() {
			var img = this;
			if (/^img$/i.test(img.tagName)) {
				function doReflect() {
					var imageWidth = img.width, imageHeight = img.height, reflection, reflectionHeight, wrapper, context, gradient;
					reflectionHeight = Math.floor((options.height > 1) ? Math.min(imageHeight, options.height) : imageHeight * options.height);

					if ($.browser.msie) {
						reflection = $("<img />").attr("src", img.src).css({
							width: imageWidth,
							height: imageHeight,
							marginBottom: reflectionHeight - imageHeight,
							filter: "flipv progid:DXImageTransform.Microsoft.Alpha(opacity=" + (options.opacity * 100) + ", style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=" + (reflectionHeight / imageHeight * 100) + ")"
						})[0];
					} else {
						reflection = $("<canvas />")[0];
						if (!reflection.getContext) return;
						context = reflection.getContext("2d");
						try {
							$(reflection).attr({width: imageWidth, height: reflectionHeight});
							context.save();
							context.translate(0, imageHeight-1);
							context.scale(1, -1);
							context.drawImage(img, 0, 0, imageWidth, imageHeight);
							context.restore();
							context.globalCompositeOperation = "destination-out";

							gradient = context.createLinearGradient(0, 0, 0, reflectionHeight);
							gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - options.opacity) + ")");
							gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
							context.fillStyle = gradient;
							context.rect(0, 0, imageWidth, reflectionHeight);
							context.fill();
						} catch(e) {
							return;
						}
					}
					$(reflection).css({display: "block", border: 0});

					wrapper = $(/^a$/i.test(img.parentNode.tagName) ? "<span />" : "<div />").insertAfter(img).append([img, reflection])[0];
					wrapper.className = img.className;
					$.data(img, "reflected", wrapper.style.cssText = img.style.cssText);
					$(wrapper).css({width: imageWidth, height: imageHeight + reflectionHeight, overflow: "hidden"});
					img.style.cssText = "display: block; border: 0px";
					img.className = "reflected";
				}

				if (img.complete) doReflect();
				else $(img).load(doReflect);
			}
		});
	},

	unreflect: function() {
		return this.unbind("load").each(function() {
			var img = this, reflected = $.data(this, "reflected"), wrapper;

			if (reflected !== undefined) {
				wrapper = img.parentNode;
				img.className = wrapper.className;
				img.style.cssText = reflected;
				$.removeData(img, "reflected");
				wrapper.parentNode.replaceChild(img, wrapper);
			}
		});
	}
});

})(jQuery);



(function($) {
	/*
		jquery.twitter.js v1.5
		Last updated: 08 July 2009

		Created by Damien du Toit
		http://coda.co.za/blog/2008/10/26/jquery-plugin-for-twitter

		Licensed under a Creative Commons Attribution-Non-Commercial 3.0 Unported License
		http://creativecommons.org/licenses/by-nc/3.0/
	*/

	$.fn.getTwitter = function(options) {

		$.fn.getTwitter.defaults = {
			userName: null,
			numTweets: 5,
			loaderText: "Loading tweets...",
			slideIn: true,
			slideDuration: 750,
			showHeading: true,
			headingText: "Latest Tweets",
			showProfileLink: true,
			showTimestamp: true
		};

		var o = $.extend({}, $.fn.getTwitter.defaults, options);

		return this.each(function() {
			var c = $(this);

			// hide container element, remove alternative content, and add class
			c.hide().empty().addClass("twitted");

			// add heading to container element
			if (o.showHeading) {
				c.append("<h2>"+o.headingText+"</h2>");
			}

			// add twitter list to container element
			var twitterListHTML = "<ul id=\"twitter_update_list\"><li></li></ul>";
			c.append(twitterListHTML);

			var tl = $("#twitter_update_list");

			// hide twitter list
			tl.hide();

			// add preLoader to container element
			var preLoaderHTML = $("<p class=\"preLoader\">"+o.loaderText+"</p>");
			c.append(preLoaderHTML);

			// add Twitter profile link to container element
			if (o.showProfileLink) {
				var profileLinkHTML = "<p class=\"profileLink\"><a href=\"http://twitter.com/"+o.userName+"\">http://twitter.com/"+o.userName+"</a></p>";
				c.append(profileLinkHTML);
			}

			// show container element
			c.show();

			$.getScript("http://twitter.com/statuses/user_timeline/"+o.userName+".json?callback=twitterCallback&count="+o.numTweets, function() {
				// remove preLoader from container element
				$(preLoaderHTML).remove();

				// remove timestamp and move to title of list item
				if (!o.showTimestamp) {
					tl.find("li").each(function() {
						var timestampHTML = $(this).children("a");
						var timestamp = timestampHTML.html();
						timestampHTML.remove();
						$(this).attr("title", timestamp);
					});
				}

				// show twitter list
				if (o.slideIn) {
					// a fix for the jQuery slide effect
					// Hat-tip: http://blog.pengoworks.com/index.cfm/2009/4/21/Fixing-jQuerys-slideDown-effect-ie-Jumpy-Animation
					var tlHeight = tl.data("originalHeight");

					// get the original height
					if (!tlHeight) {
						tlHeight = tl.show().height();
						tl.data("originalHeight", tlHeight);
						tl.hide().css({height: 0});
					}
				
					tl.show().animate({height: tlHeight}, o.slideDuration);
				}
				else {
					tl.show();
				}

				// add unique class to first list item
				tl.find("li:first").addClass("firstTweet");

				// add unique class to last list item
				tl.find("li:last").addClass("lastTweet");
			});
		});
	};
})(jQuery);


/* Copyright (c) 2009 Swizec Teller (swizec AT swizec DOT com || http://www.swizec.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * See http://swizec.com/code/styledButton/
 */

$.fn.styledButton = function ( params )
{
	return $(this).each( function ()
	{
		var tempParams = $.extend( {}, params );
		var button = new styledButton( $(this), tempParams );
	} );
}

function styledButton( element, params )
{
	this.element = element;
	this.oldFirefox = ( $.browser.mozilla && parseFloat( $.browser.version ) < 1.9 );
	this.safari3 = ( $.browser.safari && parseFloat( $.browser.version ) < 526 ) ? true : false;
	this.inlineBlock = ( this.oldFirefox ) ? '-moz-inline-block' : 'inline-block';
	this.inParams = params;
	this.params = this.setupDefaultParams( params );

	if ( !this.element.hasClass( this.params.cssClass ) )
	{
		this.info = this.init();
		this.bordersAndBackground();
		this.setupRole();
	}
}

styledButton.prototype.setupDefaultParams = function ( params )
{
	if ( typeof( params ) == "undefined" )
	{
		params = {};
	}
	if ( typeof( params.orientation ) == "undefined" )
	{
		params.orientation = 'alone';
	}
	if ( typeof( params.action ) == "undefined" )
	{
		params.action = function () {};
		params.onclick = function () {};
	}else
	{
		params.onclick = params.action;
	}
	if ( typeof( params.cssClass ) == "undefined" )
	{
		params.cssClass = "button";
	}
	if ( typeof( params.role ) == "undefined" )
	{
		params.role = 'button';
	}
	if ( typeof( params.defaultValue ) == "undefined" )
	{
		params.defaultValue = '';
	}
	if ( params.role == "checkbox" )
	{
		if ( typeof( params.checkboxValue ) != "object" )
		{
			if ( params.defaultValue != '' )
			{
				var tmp = params.defaultValue;
			}else
			{
				var tmp = 'on';
			}
			params.checkboxValue = {};
			params.checkboxValue.on = tmp;
			params.checkboxValue.off = 'off';
		}
		if ( typeof( params.checked ) == "undefined" )
		{
			params.defaultValue = params.checkboxValue.off;
			params.checked = false;
		}else
		{
			params.checked = true;
			params.defaultValue = params.checkboxValue.on;
		}
		params.toggle = true;
		params.action = {};
		params.action.on = function ( calledOn ) { $(calledOn).styledButtonSetValue( params.checkboxValue.on ) };
		params.action.off = function ( calledOn ) { $(calledOn).styledButtonSetValue( params.checkboxValue.off ) };
	}
	if ( params.toggle )
	{
		if ( typeof( params.action ) != "object" )
		{
			var tmp = params.action;
			params.action = {};
			params.action.on = tmp;
			params.action.off = tmp;
		}


		params.onclick = {};
		params.onclick.on = function ( event ) {
						$(this).styledButtonActivate( event );
						params.action.on( $(this) )
					};
		params.onclick.off = function ( event ) {
						$(this).styledButtonDeactivate( event );
						params.action.off( $(this) )
					};
	}
	if ( typeof( params.dropdown ) == "undefined" )
	{
		params.hasDropdown = false;
		params.dropdown = {};
	}else
	{
		params.hasDropdown = true;
		if ( typeof( params.dropdown ) != 'object' )
		{
			params.dropdown = {};
		}
		if ( typeof( params.dropdown.element ) == "undefined" )
		{
			params.dropdown.element = 'ul';
		}
		if ( typeof( params.action ) != "object" )
		{
			var tmp = params.action;
			params.action = {};
			params.action.on = tmp;
			params.action.off = tmp;
		}

		params.toggle = true;
		params.onclick = {};
		params.onclick.on = function ( event ) {
						$(this).styledButtonActivate();
						$(this).styledButtonDropDownActivate();
					};
		params.onclick.off = function ( event ) {
						$(this).styledButtonDeactivate();
						$(this).styledButtonDropDownDeactivate();
					};
	}
	if ( typeof( params.display ) == "undefined" )
	{
		params.display = this.inlineBlock;
	}
	if ( typeof( params.border ) == "undefined" )
	{
		params.border = 1;
	}

	return params;
}

styledButton.prototype.init = function ( )
{
	var element = this.element;
	var params = this.params;

	if ( !$(this).is( '.'+params.cssClass ) )
	{
		element.addClass( params.cssClass );
	}
	element.addClass( "parent" );
	element.val( params.defaultValue );

	// this is here because otherwise sizes get calculated wrongly
	if ( params.hasDropdown )
	{
		this.hideDropdown();
	}

	var oldContent = element.html();
	var width = element.outerWidth();
	var height = element.outerHeight();
	var padding = {
			top: (element.outerHeight()-element.height())/2,
			left: (element.outerWidth()-element.width())/2
		}
	var innerLeft = 0;

	if ( this.safari3 )
	{
		innerLeft = -4;
	}else if ( $.browser.safari && params.hasDropdown )
	{
		if ( params.hasDropdown )
		{
			width += padding.left;
		}
	}

	if ( $.browser.msie )
	{
		if ( params.orientation == 'right' || params.orientation == 'center' )
		{
			innerLeft = -1;
		}
		if ( params.hasDropdown )
		{
			height -= 1;
		}
	}

	element.wrapInner( $('<span></span>').css({
							'padding' : padding.top+'px 0px '+padding.top+'px '+padding.left+'px',
							'margin' : 0,
							'z-index' : 1,
							'position' : 'absolute',
							'left' : innerLeft+'px',
							'display' : this.inlineBlock,
							'-moz-user-select' : 'none'
						})
		 			);

	var widthDelta = 0;
	if ( this.oldFirefox && params.orientation == 'right' )
	{
		widthDelta = 4;
	}

	element.css( {
		'cursor' : 'pointer',
		'padding-right': 0,
		'margin-left' : '-1px',
		'display' : params.display,
		'width' : width-padding.left+1+widthDelta
	} )
	.hover( function () {
			if ( !$(this).hasClass( 'hover' ) )
			{
				$(this).addClass( 'hover' );
				$(this).contents().styledButtonHover();
			}
		},
		function () {
			$(this).removeClass( 'hover' );
			$(this).removeClass( 'down' );
			$(this).contents().styledButtonUnhover();
		})
	.mousedown( function () {
			if ( !$(this).hasClass( 'down' ) )
			{
				$(this).addClass( 'down' );
				$(this).contents().styledButtonMouseDown();
			}
		})
	.mouseup( function () {
			$(this).removeClass( 'down' );
			$(this).contents().styledButtonMouseUp();
		});

	if ( this.oldFirefox && params.display != 'block' )
	{
		element.css({
			'float' : 'left',
			'clear' : ( params.clear ) ? params.orientation : 'none',
			'margin-top' : ( params.clear ) ? '1em' : 0
		});
	}

	if ( !params.toggle )
	{
		element.click( params.onclick );
	}else
	{
		if ( params.checked )
		{
			element.toggle( params.onclick.off, params.onclick.on );
		}else
		{
			element.toggle( params.onclick.on, params.onclick.off );
		}
	}

	var info = { 'oldContent' : oldContent, 'width' : width, 'height' : height, 'padding' : padding, 'border' : params.border };

	return info;
}

styledButton.prototype.bordersAndBackground = function ()
{
	var element = this.element;
	var params = this.params;
	var info = this.info;

	info.sizeDelta = 0;
	if ( $.browser.msie )
	{
		info.sizeDelta = info.border*2;
	}

	if ( params.orientation == 'left' )
	{
		this.background( {
				'width' : (info.width-info.border),
				'height' : info.height,
				'border' : info.border,
				'sizeDelta' : info.sizeDelta
			});
		this.bordersLeft( info );
	}else if ( params.orientation == 'center' )
	{
		this.background( {
				'width' : (info.width-info.border*2),
				'height' : info.height,
				'marginLeft' : info.border,
				'border' : info.border,
				'sizeDelta' : info.sizeDelta
			});
		this.bordersCenter( info );
	}else if ( params.orientation == 'right' )
	{
		this.background( {
				'width' : (info.width-info.border),
				'height' : info.height,
				'marginLeft' : info.border,
				'border' : info.border,
				'sizeDelta' : info.sizeDelta
			});
		this.bordersRight( info );
	}else if ( params.orientation == 'alone' )
	{
		this.background( info );
		this.bordersAlone( info );
	}
}

styledButton.prototype.background = function ( info )
{
	var element = this.element;
	var marginLeft = ( typeof( info.marginLeft ) != "undefined" ) ? info.marginLeft : 0;

	element.append( $('<span></span>').css({
							'width' : info.width,
							'height' : info.height,
							'z-index' : 0,
							'position' : 'absolute',
							'display' : this.inlineBlock,
							'margin-left' : marginLeft,
							'padding' : 0
						})
						.attr( 'class', 'background main' )
					);
	element.append( $('<span></span>').css({
							'width' : info.width,
							'height' : Math.floor( 4*info.height/10 )-info.sizeDelta,
							'font-size' : Math.floor( 4*info.height/10 )-info.sizeDelta,
							'z-index' : 0,
							'position' : 'absolute',
							'top' : 0,
							'display' : this.inlineBlock,
							'margin-left' : marginLeft
						})
						.attr( 'class', 'background top' )
					);
	element.append( $('<span></span>').css({
							'width' : info.width,
							'height' : Math.floor( 5*info.height/10 )-info.sizeDelta,
							'font-size' : Math.floor( 5*info.height/10 )-info.sizeDelta,
							'z-index' : 0,
							'position' : 'absolute',
							'bottom' : 0,
							'margin-top' : Math.floor( 5*info.height/10 )-info.sizeDelta,
							'margin-left' : marginLeft,
							'display' : this.inlineBlock
						})
						.attr( 'class', 'background bottom' )
					);
}

styledButton.prototype.bordersAlone = function ( info )
{
	var element = this.element;

	element.wrapInner( $('<span></span>').css({
							'width' : info.width,
							'height' : info.height+info.sizeDelta,
							'margin' : (-info.border)+'px 0 0 0',
							'display' : this.inlineBlock,
							'position' : 'absolute',
							'background' : 0,
							'border-left' : '0px',
							'border-right' : '0px'
						})
						.attr( 'class', 'border top' )
					);
	element.wrapInner( $('<span></span>').css({
							'width' : info.width+info.sizeDelta,
							'height' : info.height,
							'margin' : (-info.padding.top+1)+'px 0px 0px '+(-info.padding.left)+'px',
							'display' : this.inlineBlock,
							'border-top' : '0px',
							'border-bottom' : '0px'
						})
						.attr( 'class', 'border side' )
					);
}

styledButton.prototype.bordersLeft = function ( info )
{
	var element = this.element;

	element.wrapInner( $('<span></span>').css({
							'width' : info.width,
							'height' : info.height+info.sizeDelta,
							'margin' : (-info.border)+'px 0 0 0',
							'display' : this.inlineBlock,
							'position' : 'absolute',
							'background' : 0,
							'border-left' : '0px',
							'border-right' : '0px'
						})
						.attr( 'class', 'border top' )
					);
	element.wrapInner( $('<span></span>').css({
							'width' : info.width-info.border+info.sizeDelta,
							'height' : info.height,
							'margin' : (-info.padding.top+info.border)+'px 0px 0px '+(-info.padding.left)+'px',
							'display' : this.inlineBlock,
							'border-top' : '0px',
							'border-bottom' : '0px'
						})
						.attr( 'class', 'border side left' )
					);
}

styledButton.prototype.bordersCenter = function ( info )
{
	var element = this.element;

	element.wrapInner( $('<span></span>').css({
							'width' : info.width,
							'height' : info.height+info.sizeDelta,
							'margin' : (-info.border)+'px 0 0 '+(-info.border)+'px',
							'display' : this.inlineBlock,
							'position' : 'absolute',
							'background' : 0,
							'border-left' : '0px',
							'border-right' : '0px'
						})
						.attr( 'class', 'border top' )
					);
	element.wrapInner( $('<span></span>').css({
							'width' : info.width-info.border*2+info.sizeDelta,
							'height' : info.height,
							'margin' : (-info.padding.top+info.border)+'px 0px 0px '+(-info.padding.left+info.border)+'px',
							'display' : this.inlineBlock,
							'border-top' : '0px',
							'border-bottom' : '0px'
						})
						.attr( 'class', 'border side center' )
					);
}

styledButton.prototype.bordersRight = function ( info )
{
	var element = this.element;

	element.wrapInner( $('<span></span>').css({
							'width' : info.width,
							'height' : info.height+info.sizeDelta,
							'margin' : (-info.border)+'px 0 0 '+(-info.border)+'px',
							'display' : this.inlineBlock,
							'position' : 'absolute',
							'background' : 0,
							'border-left' : '0px',
							'border-right' : '0px'
						})
						.attr( 'class', 'border top' )
					);
	element.wrapInner( $('<span></span>').css({
							'width' : info.width-info.border+info.sizeDelta,
							'height' : info.height,
							'margin' : (-info.padding.top+info.border)+'px 0px 0px '+(-info.padding.left+info.border)+'px',
							'display' : this.inlineBlock,
							'border-top' : '0px',
							'border-bottom' : '0px'
						})
						.attr( 'class', 'border side right' )
					);
}

styledButton.prototype.hideDropdown = function ()
{
	var element = this.element;

	while ( !element.is( this.params.dropdown.element ) && element.contents().size() > 0 )
	{
		element = element.contents();
	}
	if ( element.is( this.params.dropdown.element ) )
	{
		for ( var i = 0; i < element.size(); i += 1 )
		{
			if ( element.eq( i ).is( this.params.dropdown.element ) )
			{
				element.eq( i ).css({ "display" : "none" });
			}
		}
	}
}

styledButton.prototype.setupRole = function ()
{
	var element = this.element;
	var params = this.params;

	element.attr( "role", params.role);

	if ( params.role != "button" )
	{
		element.append( '<input type="hidden" value="'+params.defaultValue+'" name="'+params.name+'"/>' );
	}

	if ( params.hasDropdown )
	{
		this.setupDropDown();
	}
	if ( params.role == "select" )
	{
		this.setupRoleSelect();
	}
	if ( params.role == "checkbox" && params.checked )
	{
		element.styledButtonActivate();
	}
}

styledButton.prototype.setupDropDown = function ()
{
	var element = this.element;
	var params = this.params;
	var info = this.info;

	while ( !element.is( params.dropdown.element ) && element.contents().size() > 0 )
	{
		element = element.contents();
	}

	var marginDelta = -1;
	if ( this.safari3 )
	{
		marginDelta = 3;
	}

	var topDelta = 0;
	var widthDelta = -4;
	if ( $.browser.msie )
	{
		topDelta = info.padding.top*3+params.border;
		widthDelta = 1;
	}

	if ( element.is( params.dropdown.element ) )
	{
		for ( var i = 0; i < $(element).size(); i += 1 )
		{
			if ( element.eq( i ).is( this.params.dropdown.element ) )
			{
				element.eq( i ).addClass( "dropdown" )
				.css( {
					'display' : 'none',
					'position' : 'absolute',
					'left' : '0px',
					'margin' : (info.padding.top+topDelta)+'px 0px 0px '+marginDelta+'px',
					'width' : info.width+widthDelta,
					'padding-right' : 0,
					'z-index' : 3
				});
			}
		}
	}
}

styledButton.prototype.setupRoleSelect = function ()
{
	var element = this.element;
	var params = this.params;
	var info = this.info;

	while ( !element.is( params.dropdown.element ) && element.contents().size() > 0 )
	{
		element = element.contents();
	}

	if ( element.is( params.dropdown.element ) )
	{
		for ( var i = 0; i < element.size(); i += 1 )
		{
			if ( element.eq( i ).is( this.params.dropdown.element ) )
			{
				element.eq( i ).children().click( function () {
						var value = $(this).attr( "value" );
						if ( typeof( value ) != "string" )
						{
							value = $(this).html();
						}
						$(this).styledButtonSetValue( value );
					} );
			}
		}
	}
}

//
// behaviour functions
//

$.fn.styledButtonSetValue = function ( value )
{
	var element = $(this);

	while ( !element.is( ".parent" ) && element.parent().size() > 0 )
	{
		element = element.parent();
	}

	$(element).val( value );
	if ( !$.browser.msie )
	{
		$(element).change();
	}

	while ( !element.is( "input" ) && element.contents().size() > 0 )
	{
		element = element.contents();
	}

	$(element).val( value )
}

$.fn.styledButtonHover = function ()
{
	$(this).addClass( 'hover' );

	if ( $(this).children().size() > 0 )
	{
		$(this).children().styledButtonHover();
	}
}

$.fn.styledButtonUnhover = function ()
{
	$(this).removeClass( 'hover' );
	$(this).removeClass( 'down' );

	if ( $(this).contents().size() > 0 )
	{
		$(this).contents().styledButtonUnhover();
	}
}

$.fn.styledButtonMouseDown = function ()
{
	$(this).addClass( 'down' );

	if ( $(this).contents().size() > 0 )
	{
		$(this).contents().styledButtonMouseDown();
	}
}

$.fn.styledButtonMouseUp = function ()
{
	$(this).removeClass( 'down' );

	if ( $(this).contents().size() > 0 )
	{
		$(this).contents().styledButtonMouseUp();
	}
}

$.fn.styledButtonActivate = function ()
{
	$(this).addClass( 'active' );

	if ( $(this).contents().size() > 0 )
	{
		$(this).contents().styledButtonActivate();
	}
}

$.fn.styledButtonDeactivate = function ()
{
	$(this).removeClass( 'active' );

	if ( $(this).contents().size() > 0 )
	{
		$(this).contents().styledButtonDeactivate();
	}
}

$.fn.styledButtonDropDownActivate = function ()
{
	if ( !$(this).is( '.dropdown' ) )
	{
		$(this).children().styledButtonDropDownActivate();
	}else
	{
		for ( var i = 0; i < $(this).size(); i += 1 )
		{
			if ( $(this).eq( i ).is( ".dropdown" ) )
			{
				if ( $.browser.msie )
				{
					$(this).eq( i ).css( "display", "block" );
				}else
				{
					$(this).eq( i ).slideDown( 60 );
				}
			}
		}
	}
}

$.fn.styledButtonDropDownDeactivate = function ()
{
	if ( !$(this).is( '.dropdown' ) )
	{
		$(this).contents().styledButtonDropDownDeactivate();
	}else
	{
		for ( var i = 0; i < $(this).size(); i += 1 )
		{
			if ( $(this).eq( i ).is( ".dropdown" ) )
			{
				if ( $.browser.msie )
				{
					$(this).eq( i ).css( "display", "none" );
				}else
				{
					$(this).eq( i ).slideUp( 20 );
				}
			}
		}
	}
}

/** Socket.IO 0.6 - Built with build.js */
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

this.io = {
	version: '0.6',
	
	setPath: function(path){
		if (window.console && console.error) console.error('io.setPath will be removed. Please set the variable WEB_SOCKET_SWF_LOCATION pointing to WebSocketMain.swf');
		this.path = /\/$/.test(path) ? path : path + '/';
		WEB_SOCKET_SWF_LOCATION = path + 'lib/vendor/web-socket-js/WebSocketMain.swf';
	}
};

if ('jQuery' in this) jQuery.io = this.io;

if (typeof window != 'undefined'){
  // WEB_SOCKET_SWF_LOCATION = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//cdn.socket.io/' + this.io.version + '/WebSocketMain.swf';
  WEB_SOCKET_SWF_LOCATION = '/socket.io/lib/vendor/web-socket-js/WebSocketMain.swf';
}
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){

	var _pageLoaded = false;

	io.util = {

		ios: false,

		load: function(fn){
			if (document.readyState == 'complete' || _pageLoaded) return fn();
			if ('attachEvent' in window){
				window.attachEvent('onload', fn);
			} else {
				window.addEventListener('load', fn, false);
			}
		},

		inherit: function(ctor, superCtor){
			// no support for `instanceof` for now
			for (var i in superCtor.prototype){
				ctor.prototype[i] = superCtor.prototype[i];
			}
		},

		indexOf: function(arr, item, from){
			for (var l = arr.length, i = (from < 0) ? Math.max(0, l + from) : from || 0; i < l; i++){
				if (arr[i] === item) return i;
			}
			return -1;
		},

		isArray: function(obj){
			return Object.prototype.toString.call(obj) === '[object Array]';
		},
		
    merge: function(target, additional){
      for (var i in additional)
        if (additional.hasOwnProperty(i))
          target[i] = additional[i];
    }

	};

	io.util.ios = /iphone|ipad/i.test(navigator.userAgent);
	io.util.android = /android/i.test(navigator.userAgent);
	io.util.opera = /opera/i.test(navigator.userAgent);

	io.util.load(function(){
		_pageLoaded = true;
	});

})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

// abstract

(function(){
	
	var frame = '~m~',
	
	stringify = function(message){
		if (Object.prototype.toString.call(message) == '[object Object]'){
			if (!('JSON' in window)){
				if ('console' in window && console.error) console.error('Trying to encode as JSON, but JSON.stringify is missing.');
				return '{ "$error": "Invalid message" }';
			}
			return '~j~' + JSON.stringify(message);
		} else {
			return String(message);
		}
	};
	
	Transport = io.Transport = function(base, options){
		this.base = base;
		this.options = {
			timeout: 15000 // based on heartbeat interval default
		};
		io.util.merge(this.options, options);
	};

	Transport.prototype.send = function(){
		throw new Error('Missing send() implementation');
	};

	Transport.prototype.connect = function(){
		throw new Error('Missing connect() implementation');
	};

	Transport.prototype.disconnect = function(){
		throw new Error('Missing disconnect() implementation');
	};
	
	Transport.prototype._encode = function(messages){
		var ret = '', message,
				messages = io.util.isArray(messages) ? messages : [messages];
		for (var i = 0, l = messages.length; i < l; i++){
			message = messages[i] === null || messages[i] === undefined ? '' : stringify(messages[i]);
			ret += frame + message.length + frame + message;
		}
		return ret;
	};
	
	Transport.prototype._decode = function(data){
		var messages = [], number, n;
		do {
			if (data.substr(0, 3) !== frame) return messages;
			data = data.substr(3);
			number = '', n = '';
			for (var i = 0, l = data.length; i < l; i++){
				n = Number(data.substr(i, 1));
				if (data.substr(i, 1) == n){
					number += n;
				} else {	
					data = data.substr(number.length + frame.length);
					number = Number(number);
					break;
				} 
			}
			messages.push(data.substr(0, number)); // here
			data = data.substr(number);
		} while(data !== '');
		return messages;
	};
	
	Transport.prototype._onData = function(data){
		this._setTimeout();
		var msgs = this._decode(data);
		if (msgs && msgs.length){
			for (var i = 0, l = msgs.length; i < l; i++){
				this._onMessage(msgs[i]);
			}
		}
	};
	
	Transport.prototype._setTimeout = function(){
		var self = this;
		if (this._timeout) clearTimeout(this._timeout);
		this._timeout = setTimeout(function(){
			self._onTimeout();
		}, this.options.timeout);
	};
	
	Transport.prototype._onTimeout = function(){
		this._onDisconnect();
	};
	
	Transport.prototype._onMessage = function(message){
		if (!this.sessionid){
			this.sessionid = message;
			this._onConnect();
		} else if (message.substr(0, 3) == '~h~'){
			this._onHeartbeat(message.substr(3));
		} else if (message.substr(0, 3) == '~j~'){
			this.base._onMessage(JSON.parse(message.substr(3)));
		} else {
			this.base._onMessage(message);
		}
	},
	
	Transport.prototype._onHeartbeat = function(heartbeat){
		this.send('~h~' + heartbeat); // echo
	};
	
	Transport.prototype._onConnect = function(){
		this.connected = true;
		this.connecting = false;
		this.base._onConnect();
		this._setTimeout();
	};

	Transport.prototype._onDisconnect = function(){
		this.connecting = false;
		this.connected = false;
		this.sessionid = null;
		this.base._onDisconnect();
	};

	Transport.prototype._prepareUrl = function(){
		return (this.base.options.secure ? 'https' : 'http') 
			+ '://' + this.base.host 
			+ ':' + this.base.options.port
			+ '/' + this.base.options.resource
			+ '/' + this.type
			+ (this.sessionid ? ('/' + this.sessionid) : '/');
	};

})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){
	
	var empty = new Function,
	    
	XMLHttpRequestCORS = (function(){
		if (!('XMLHttpRequest' in window)) return false;
		// CORS feature detection
		var a = new XMLHttpRequest();
		return a.withCredentials != undefined;
	})(),
	
	request = function(xdomain){
		if ('XDomainRequest' in window && xdomain) return new XDomainRequest();
		if ('XMLHttpRequest' in window && (!xdomain || XMLHttpRequestCORS)) return new XMLHttpRequest();
		if (!xdomain){
			try {
				var a = new ActiveXObject('MSXML2.XMLHTTP');
				return a;
			} catch(e){}
		
			try {
				var b = new ActiveXObject('Microsoft.XMLHTTP');
				return b;
			} catch(e){}
		}
		return false;
	},
	
	XHR = io.Transport.XHR = function(){
		io.Transport.apply(this, arguments);
		this._sendBuffer = [];
	};
	
	io.util.inherit(XHR, io.Transport);
	
	XHR.prototype.connect = function(){
		this._get();
		return this;
	};
	
	XHR.prototype._checkSend = function(){
		if (!this._posting && this._sendBuffer.length){
			var encoded = this._encode(this._sendBuffer);
			this._sendBuffer = [];
			this._send(encoded);
		}
	};
	
	XHR.prototype.send = function(data){
		if (io.util.isArray(data)){
			this._sendBuffer.push.apply(this._sendBuffer, data);
		} else {
			this._sendBuffer.push(data);
		}
		this._checkSend();
		return this;
	};
	
	XHR.prototype._send = function(data){
		var self = this;
		this._posting = true;
		this._sendXhr = this._request('send', 'POST');
		this._sendXhr.onreadystatechange = function(){
			var status;
			if (self._sendXhr.readyState == 4){
				self._sendXhr.onreadystatechange = empty;
				try { status = self._sendXhr.status; } catch(e){}
				self._posting = false;
				if (status == 200){
					self._checkSend();
				} else {
					self._onDisconnect();
				}
			}
		};
		this._sendXhr.send('data=' + encodeURIComponent(data));
	};
	
	XHR.prototype.disconnect = function(){
		// send disconnection signal
		this._onDisconnect();
		return this;
	};
	
	XHR.prototype._onDisconnect = function(){
		if (this._xhr){
			this._xhr.onreadystatechange = this._xhr.onload = empty;
			this._xhr.abort();
			this._xhr = null;
		}
		if (this._sendXhr){
			this._sendXhr.onreadystatechange = this._sendXhr.onload = empty;
			this._sendXhr.abort();
			this._sendXhr = null;
		}
		this._sendBuffer = [];
		io.Transport.prototype._onDisconnect.call(this);
	};
	
	XHR.prototype._request = function(url, method, multipart){
		var req = request(this.base._isXDomain());
		if (multipart) req.multipart = true;
		req.open(method || 'GET', this._prepareUrl() + (url ? '/' + url : ''));
		if (method == 'POST' && 'setRequestHeader' in req){
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');
		}
		return req;
	};
	
	XHR.check = function(xdomain){
		try {
			if (request(xdomain)) return true;
		} catch(e){}
		return false;
	};
	
	XHR.xdomainCheck = function(){
		return XHR.check(true);
	};
	
	XHR.request = request;
	
})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){
	
	var WS = io.Transport.websocket = function(){
		io.Transport.apply(this, arguments);
	};
	
	io.util.inherit(WS, io.Transport);
	
	WS.prototype.type = 'websocket';
	
	WS.prototype.connect = function(){
		var self = this;
		this.socket = new WebSocket(this._prepareUrl());
		this.socket.onmessage = function(ev){ self._onData(ev.data); };
		this.socket.onclose = function(ev){ self._onClose(); };
		return this;
	};
	
	WS.prototype.send = function(data){
		if (this.socket) this.socket.send(this._encode(data));
		return this;
	};
	
	WS.prototype.disconnect = function(){
		if (this.socket) this.socket.close();
		return this;
	};
	
	WS.prototype._onClose = function(){
		this._onDisconnect();
		return this;
	};
	
	WS.prototype._prepareUrl = function(){
		return (this.base.options.secure ? 'wss' : 'ws') 
		+ '://' + this.base.host 
		+ ':' + this.base.options.port
		+ '/' + this.base.options.resource
		+ '/' + this.type
		+ (this.sessionid ? ('/' + this.sessionid) : '');
	};
	
	WS.check = function(){
		// we make sure WebSocket is not confounded with a previously loaded flash WebSocket
		return 'WebSocket' in window && WebSocket.prototype && ( WebSocket.prototype.send && !!WebSocket.prototype.send.toString().match(/native/i)) && typeof WebSocket !== "undefined";
	};

	WS.xdomainCheck = function(){
		return true;
	};
	
})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){
	
	var Flashsocket = io.Transport.flashsocket = function(){
		io.Transport.websocket.apply(this, arguments);
	};
	
	io.util.inherit(Flashsocket, io.Transport.websocket);
	
	Flashsocket.prototype.type = 'flashsocket';
	
	Flashsocket.prototype.connect = function(){
		var self = this, args = arguments;
		WebSocket.__addTask(function(){
			io.Transport.websocket.prototype.connect.apply(self, args);
		});
		return this;
	};
	
	Flashsocket.prototype.send = function(){
		var self = this, args = arguments;
		WebSocket.__addTask(function(){
			io.Transport.websocket.prototype.send.apply(self, args);
		});
		return this;
	};
	
	Flashsocket.check = function(){
		if (typeof WebSocket == 'undefined' || !('__addTask' in WebSocket)) return false;
		if (io.util.opera) return false; // opera is buggy with this transport
		if ('navigator' in window && 'plugins' in navigator && navigator.plugins['Shockwave Flash']){
			return !!navigator.plugins['Shockwave Flash'].description;
	  }
		if ('ActiveXObject' in window) {
			try {
				return !!new ActiveXObject('ShockwaveFlash.ShockwaveFlash').GetVariable('$version');
			} catch (e) {}
		}
		return false;
	};
	
	Flashsocket.xdomainCheck = function(){
		return true;
	};
	
})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){
	
	var HTMLFile = io.Transport.htmlfile = function(){
		io.Transport.XHR.apply(this, arguments);
	};
	
	io.util.inherit(HTMLFile, io.Transport.XHR);
	
	HTMLFile.prototype.type = 'htmlfile';
	
	HTMLFile.prototype._get = function(){
		var self = this;
		this._open();
		window.attachEvent('onunload', function(){ self._destroy(); });
	};
	
	HTMLFile.prototype._open = function(){
		this._doc = new ActiveXObject('htmlfile');
		this._doc.open();
		this._doc.write('<html></html>');
		this._doc.parentWindow.s = this;
		this._doc.close();

		var _iframeC = this._doc.createElement('div');
		this._doc.body.appendChild(_iframeC);
		this._iframe = this._doc.createElement('iframe');
		_iframeC.appendChild(this._iframe);
		this._iframe.src = this._prepareUrl() + '/' + (+ new Date);
	};
	
	HTMLFile.prototype._ = function(data, doc){
		this._onData(data);
		var script = doc.getElementsByTagName('script')[0];
		script.parentNode.removeChild(script);
	};

  HTMLFile.prototype._destroy = function(){
    if (this._iframe){
      this._iframe.src = 'about:blank';
      this._doc = null;
      CollectGarbage();
    }
  };
	
	HTMLFile.prototype.disconnect = function(){
		this._destroy();
		return io.Transport.XHR.prototype.disconnect.call(this);
	};
	
	HTMLFile.check = function(){
		if ('ActiveXObject' in window){
			try {
				var a = new ActiveXObject('htmlfile');
				return a && io.Transport.XHR.check();
			} catch(e){}
		}
		return false;
	};

	HTMLFile.xdomainCheck = function(){
		// we can probably do handling for sub-domains, we should test that it's cross domain but a subdomain here
		return false;
	};
	
})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){
	
	var XHRMultipart = io.Transport['xhr-multipart'] = function(){
		io.Transport.XHR.apply(this, arguments);
	};
	
	io.util.inherit(XHRMultipart, io.Transport.XHR);
	
	XHRMultipart.prototype.type = 'xhr-multipart';
	
	XHRMultipart.prototype._get = function(){
		var self = this;
		this._xhr = this._request('', 'GET', true);
		this._xhr.onreadystatechange = function(){
			if (self._xhr.readyState == 3) self._onData(self._xhr.responseText);
		};
		this._xhr.send();
	};
	
	XHRMultipart.check = function(){
		return 'XMLHttpRequest' in window && 'prototype' in XMLHttpRequest && 'multipart' in XMLHttpRequest.prototype;
	};

	XHRMultipart.xdomainCheck = function(){
		return true;
	};
	
})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){

	var empty = new Function(),

	XHRPolling = io.Transport['xhr-polling'] = function(){
		io.Transport.XHR.apply(this, arguments);
	};

	io.util.inherit(XHRPolling, io.Transport.XHR);

	XHRPolling.prototype.type = 'xhr-polling';

	XHRPolling.prototype.connect = function(){
		if (io.util.ios || io.util.android){
			var self = this;
			io.util.load(function(){
				setTimeout(function(){
					io.Transport.XHR.prototype.connect.call(self);
				}, 10);
			});
		} else {
			io.Transport.XHR.prototype.connect.call(this);
		}
	};

	XHRPolling.prototype._get = function(){
		var self = this;
		this._xhr = this._request(+ new Date, 'GET');
		if ('onload' in this._xhr){
			this._xhr.onload = function(){
				self._onData(this.responseText);
				self._get();
			};
		} else {
			this._xhr.onreadystatechange = function(){
				var status;
				if (self._xhr.readyState == 4){
					self._xhr.onreadystatechange = empty;
					try { status = self._xhr.status; } catch(e){}
					if (status == 200){
						self._onData(self._xhr.responseText);
						self._get();
					} else {
						self._onDisconnect();
					}
				}
			};
		}
		this._xhr.send();
	};

	XHRPolling.check = function(){
		return io.Transport.XHR.check();
	};

	XHRPolling.xdomainCheck = function(){
		return io.Transport.XHR.xdomainCheck();
	};

})();
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

io.JSONP = [];

JSONPPolling = io.Transport['jsonp-polling'] = function(){
	io.Transport.XHR.apply(this, arguments);
	this._insertAt = document.getElementsByTagName('script')[0];
	this._index = io.JSONP.length;
	io.JSONP.push(this);
};

io.util.inherit(JSONPPolling, io.Transport['xhr-polling']);

JSONPPolling.prototype.type = 'jsonp-polling';

JSONPPolling.prototype._send = function(data){
	var self = this;
	if (!('_form' in this)){
		var form = document.createElement('FORM'),
		    area = document.createElement('TEXTAREA'),
		    id = this._iframeId = 'socket_io_iframe_' + this._index,
		    iframe;

		form.style.position = 'absolute';
		form.style.top = '-1000px';
		form.style.left = '-1000px';
		form.target = id;
		form.method = 'POST';
		form.action = this._prepareUrl() + '/' + (+new Date) + '/' + this._index;
		area.name = 'data';
		form.appendChild(area);
		this._insertAt.parentNode.insertBefore(form, this._insertAt);
		document.body.appendChild(form);

		this._form = form;
		this._area = area;
	}

	function complete(){
		initIframe();
		self._posting = false;
		self._checkSend();
	};

	function initIframe(){
		if (self._iframe){
			self._form.removeChild(self._iframe);
		} 

		try {
			// ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
			iframe = document.createElement('<iframe name="'+ self._iframeId +'">');
		} catch(e){
			iframe = document.createElement('iframe');
			iframe.name = self._iframeId;
		}

		iframe.id = self._iframeId;

		self._form.appendChild(iframe);
		self._iframe = iframe;
	};

	initIframe();

	this._posting = true;
	this._area.value = data;

	try {
		this._form.submit();
	} catch(e){}

	if (this._iframe.attachEvent){
		iframe.onreadystatechange = function(){
			if (self._iframe.readyState == 'complete') complete();
		};
	} else {
		this._iframe.onload = complete;
	}
};

JSONPPolling.prototype._get = function(){
	var self = this,
			script = document.createElement('SCRIPT');
	if (this._script){
		this._script.parentNode.removeChild(this._script);
		this._script = null;
	}
	script.async = true;
	script.src = this._prepareUrl() + '/' + (+new Date) + '/' + this._index;
	script.onerror = function(){
		self._onDisconnect();
	};
	this._insertAt.parentNode.insertBefore(script, this._insertAt);
	this._script = script;
};

JSONPPolling.prototype._ = function(){
	this._onData.apply(this, arguments);
	this._get();
	return this;
};

JSONPPolling.check = function(){
	return true;
};

JSONPPolling.xdomainCheck = function(){
	return true;
};
/**
 * Socket.IO client
 * 
 * @author Guillermo Rauch <guillermo@learnboost.com>
 * @license The MIT license.
 * @copyright Copyright (c) 2010 LearnBoost <dev@learnboost.com>
 */

(function(){
	
	var Socket = io.Socket = function(host, options){
		this.host = host || document.domain;
		this.options = {
			secure: false,
			document: document,
			port: document.location.port || 80,
			resource: 'socket.io',
			transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'jsonp-polling'],
			transportOptions: {
				'xhr-polling': {
					timeout: 25000 // based on polling duration default
				},
				'jsonp-polling': {
					timeout: 25000
				}
			},
			connectTimeout: 5000,
			tryTransportsOnConnectTimeout: true,
			rememberTransport: true
		};
		io.util.merge(this.options, options);
		this.connected = false;
		this.connecting = false;
		this._events = {};
		this.transport = this.getTransport();
		if (!this.transport && 'console' in window) console.error('No transport available');
	};
	
	Socket.prototype.getTransport = function(override){
		var transports = override || this.options.transports, match;
		if (this.options.rememberTransport && !override){
			match = this.options.document.cookie.match('(?:^|;)\\s*socketio=([^;]*)');
			if (match){
				this._rememberedTransport = true;
				transports = [decodeURIComponent(match[1])];
			}
		} 
		for (var i = 0, transport; transport = transports[i]; i++){
			if (io.Transport[transport] 
				&& io.Transport[transport].check() 
				&& (!this._isXDomain() || io.Transport[transport].xdomainCheck())){
				return new io.Transport[transport](this, this.options.transportOptions[transport] || {});
			}
		}
		return null;
	};
	
	Socket.prototype.connect = function(){
		if (this.transport && !this.connected){
			if (this.connecting) this.disconnect();
			this.connecting = true;
			this.transport.connect();
			if (this.options.connectTimeout){
				var self = this;
				setTimeout(function(){
					if (!self.connected){
						self.disconnect();
						if (self.options.tryTransportsOnConnectTimeout && !self._rememberedTransport){
							var remainingTransports = [], transports = self.options.transports;
							for (var i = 0, transport; transport = transports[i]; i++){
								if (transport != self.transport.type) remainingTransports.push(transport);
							}
							if (remainingTransports.length){
								self.transport = self.getTransport(remainingTransports);
								self.connect();
							}
						}
					}
				}, this.options.connectTimeout);
			}
		}
		return this;
	};
	
	Socket.prototype.send = function(data){
		if (!this.transport || !this.transport.connected) return this._queue(data);
		this.transport.send(data);
		return this;
	};
	
	Socket.prototype.disconnect = function(){
		this.transport.disconnect();
		return this;
	};
	
	Socket.prototype.on = function(name, fn){
		if (!(name in this._events)) this._events[name] = [];
		this._events[name].push(fn);
		return this;
	};
	
	Socket.prototype.fire = function(name, args){
		if (name in this._events){
			for (var i = 0, ii = this._events[name].length; i < ii; i++) 
				this._events[name][i].apply(this, args === undefined ? [] : args);
		}
		return this;
	};
	
	Socket.prototype.removeEvent = function(name, fn){
		if (name in this._events){
			for (var a = 0, l = this._events[name].length; a < l; a++)
				if (this._events[name][a] == fn) this._events[name].splice(a, 1);		
		}
		return this;
	};
	
	Socket.prototype._queue = function(message){
		if (!('_queueStack' in this)) this._queueStack = [];
		this._queueStack.push(message);
		return this;
	};
	
	Socket.prototype._doQueue = function(){
		if (!('_queueStack' in this) || !this._queueStack.length) return this;
		this.transport.send(this._queueStack);
		this._queueStack = [];
		return this;
	};
	
	Socket.prototype._isXDomain = function(){
		return this.host !== document.domain;
	};
	
	Socket.prototype._onConnect = function(){
		this.connected = true;
		this.connecting = false;
		this._doQueue();
		if (this.options.rememberTransport) this.options.document.cookie = 'socketio=' + encodeURIComponent(this.transport.type);
		this.fire('connect');
	};
	
	Socket.prototype._onMessage = function(data){
		this.fire('message', [data]);
	};
	
	Socket.prototype._onDisconnect = function(){
		var wasConnected = this.connected;
		this.connected = false;
		this.connecting = false;
		this._queueStack = [];
		if (wasConnected) this.fire('disconnect');
	};
	
	Socket.prototype.addListener = Socket.prototype.addEvent = Socket.prototype.addEventListener = Socket.prototype.on;
	
})();
/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
var swfobject=function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();
/*
/*
Copyright 2006 Adobe Systems Incorporated

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


/*
 * The Bridge class, responsible for navigating AS instances
 */
function FABridge(target,bridgeName)
{
    this.target = target;
    this.remoteTypeCache = {};
    this.remoteInstanceCache = {};
    this.remoteFunctionCache = {};
    this.localFunctionCache = {};
    this.bridgeID = FABridge.nextBridgeID++;
    this.name = bridgeName;
    this.nextLocalFuncID = 0;
    FABridge.instances[this.name] = this;
    FABridge.idMap[this.bridgeID] = this;

    return this;
}

// type codes for packed values
FABridge.TYPE_ASINSTANCE =  1;
FABridge.TYPE_ASFUNCTION =  2;

FABridge.TYPE_JSFUNCTION =  3;
FABridge.TYPE_ANONYMOUS =   4;

FABridge.initCallbacks = {};
FABridge.userTypes = {};

FABridge.addToUserTypes = function()
{
	for (var i = 0; i < arguments.length; i++)
	{
		FABridge.userTypes[arguments[i]] = {
			'typeName': arguments[i], 
			'enriched': false
		};
	}
}

FABridge.argsToArray = function(args)
{
    var result = [];
    for (var i = 0; i < args.length; i++)
    {
        result[i] = args[i];
    }
    return result;
}

function instanceFactory(objID)
{
    this.fb_instance_id = objID;
    return this;
}

function FABridge__invokeJSFunction(args)
{  
    var funcID = args[0];
    var throughArgs = args.concat();//FABridge.argsToArray(arguments);
    throughArgs.shift();
   
    var bridge = FABridge.extractBridgeFromID(funcID);
    return bridge.invokeLocalFunction(funcID, throughArgs);
}

FABridge.addInitializationCallback = function(bridgeName, callback)
{
    var inst = FABridge.instances[bridgeName];
    if (inst != undefined)
    {
        callback.call(inst);
        return;
    }

    var callbackList = FABridge.initCallbacks[bridgeName];
    if(callbackList == null)
    {
        FABridge.initCallbacks[bridgeName] = callbackList = [];
    }

    callbackList.push(callback);
}

// updated for changes to SWFObject2
function FABridge__bridgeInitialized(bridgeName) {
    var objects = document.getElementsByTagName("object");
    var ol = objects.length;
    var activeObjects = [];
    if (ol > 0) {
		for (var i = 0; i < ol; i++) {
			if (typeof objects[i].SetVariable != "undefined") {
				activeObjects[activeObjects.length] = objects[i];
			}
		}
	}
    var embeds = document.getElementsByTagName("embed");
    var el = embeds.length;
    var activeEmbeds = [];
    if (el > 0) {
		for (var j = 0; j < el; j++) {
			if (typeof embeds[j].SetVariable != "undefined") {
            	activeEmbeds[activeEmbeds.length] = embeds[j];
            }
        }
    }
    var aol = activeObjects.length;
    var ael = activeEmbeds.length;
    var searchStr = "bridgeName="+ bridgeName;
    if ((aol == 1 && !ael) || (aol == 1 && ael == 1)) {
    	FABridge.attachBridge(activeObjects[0], bridgeName);	 
    }
    else if (ael == 1 && !aol) {
    	FABridge.attachBridge(activeEmbeds[0], bridgeName);
        }
    else {
                var flash_found = false;
		if (aol > 1) {
			for (var k = 0; k < aol; k++) {
				 var params = activeObjects[k].childNodes;
				 for (var l = 0; l < params.length; l++) {
					var param = params[l];
					if (param.nodeType == 1 && param.tagName.toLowerCase() == "param" && param["name"].toLowerCase() == "flashvars" && param["value"].indexOf(searchStr) >= 0) {
						FABridge.attachBridge(activeObjects[k], bridgeName);
                            flash_found = true;
                            break;
                        }
                    }
                if (flash_found) {
                    break;
                }
            }
        }
		if (!flash_found && ael > 1) {
			for (var m = 0; m < ael; m++) {
				var flashVars = activeEmbeds[m].attributes.getNamedItem("flashVars").nodeValue;
				if (flashVars.indexOf(searchStr) >= 0) {
					FABridge.attachBridge(activeEmbeds[m], bridgeName);
					break;
    }
            }
        }
    }
    return true;
}

// used to track multiple bridge instances, since callbacks from AS are global across the page.

FABridge.nextBridgeID = 0;
FABridge.instances = {};
FABridge.idMap = {};
FABridge.refCount = 0;

FABridge.extractBridgeFromID = function(id)
{
    var bridgeID = (id >> 16);
    return FABridge.idMap[bridgeID];
}

FABridge.attachBridge = function(instance, bridgeName)
{
    var newBridgeInstance = new FABridge(instance, bridgeName);

    FABridge[bridgeName] = newBridgeInstance;

/*  FABridge[bridgeName] = function() {
        return newBridgeInstance.root();
    }
*/
    var callbacks = FABridge.initCallbacks[bridgeName];
    if (callbacks == null)
    {
        return;
    }
    for (var i = 0; i < callbacks.length; i++)
    {
        callbacks[i].call(newBridgeInstance);
    }
    delete FABridge.initCallbacks[bridgeName]
}

// some methods can't be proxied.  You can use the explicit get,set, and call methods if necessary.

FABridge.blockedMethods =
{
    toString: true,
    get: true,
    set: true,
    call: true
};

FABridge.prototype =
{


// bootstrapping

    root: function()
    {
        return this.deserialize(this.target.getRoot());
    },
//clears all of the AS objects in the cache maps
    releaseASObjects: function()
    {
        return this.target.releaseASObjects();
    },
//clears a specific object in AS from the type maps
    releaseNamedASObject: function(value)
    {
        if(typeof(value) != "object")
        {
            return false;
        }
        else
        {
            var ret =  this.target.releaseNamedASObject(value.fb_instance_id);
            return ret;
        }
    },
//create a new AS Object
    create: function(className)
    {
        return this.deserialize(this.target.create(className));
    },


    // utilities

    makeID: function(token)
    {
        return (this.bridgeID << 16) + token;
    },


    // low level access to the flash object

//get a named property from an AS object
    getPropertyFromAS: function(objRef, propName)
    {
        if (FABridge.refCount > 0)
        {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        }
        else
        {
            FABridge.refCount++;
            retVal = this.target.getPropFromAS(objRef, propName);
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal;
        }
    },
//set a named property on an AS object
    setPropertyInAS: function(objRef,propName, value)
    {
        if (FABridge.refCount > 0)
        {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        }
        else
        {
            FABridge.refCount++;
            retVal = this.target.setPropInAS(objRef,propName, this.serialize(value));
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal;
        }
    },

//call an AS function
    callASFunction: function(funcID, args)
    {
        if (FABridge.refCount > 0)
        {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        }
        else
        {
            FABridge.refCount++;
            retVal = this.target.invokeASFunction(funcID, this.serialize(args));
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal;
        }
    },
//call a method on an AS object
    callASMethod: function(objID, funcName, args)
    {
        if (FABridge.refCount > 0)
        {
            throw new Error("You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.");
        }
        else
        {
            FABridge.refCount++;
            args = this.serialize(args);
            retVal = this.target.invokeASMethod(objID, funcName, args);
            retVal = this.handleError(retVal);
            FABridge.refCount--;
            return retVal;
        }
    },

    // responders to remote calls from flash

    //callback from flash that executes a local JS function
    //used mostly when setting js functions as callbacks on events
    invokeLocalFunction: function(funcID, args)
    {
        var result;
        var func = this.localFunctionCache[funcID];

        if(func != undefined)
        {
            result = this.serialize(func.apply(null, this.deserialize(args)));
        }

        return result;
    },

    // Object Types and Proxies
	
    // accepts an object reference, returns a type object matching the obj reference.
    getTypeFromName: function(objTypeName)
    {
        return this.remoteTypeCache[objTypeName];
    },
    //create an AS proxy for the given object ID and type
    createProxy: function(objID, typeName)
    {
        var objType = this.getTypeFromName(typeName);
	        instanceFactory.prototype = objType;
	        var instance = new instanceFactory(objID);
        this.remoteInstanceCache[objID] = instance;
        return instance;
    },
    //return the proxy associated with the given object ID
    getProxy: function(objID)
    {
        return this.remoteInstanceCache[objID];
    },

    // accepts a type structure, returns a constructed type
    addTypeDataToCache: function(typeData)
    {
        var newType = new ASProxy(this, typeData.name);
        var accessors = typeData.accessors;
        for (var i = 0; i < accessors.length; i++)
        {
            this.addPropertyToType(newType, accessors[i]);
        }

        var methods = typeData.methods;
        for (var i = 0; i < methods.length; i++)
        {
            if (FABridge.blockedMethods[methods[i]] == undefined)
            {
                this.addMethodToType(newType, methods[i]);
            }
        }


        this.remoteTypeCache[newType.typeName] = newType;
        return newType;
    },

    //add a property to a typename; used to define the properties that can be called on an AS proxied object
    addPropertyToType: function(ty, propName)
    {
        var c = propName.charAt(0);
        var setterName;
        var getterName;
        if(c >= "a" && c <= "z")
        {
            getterName = "get" + c.toUpperCase() + propName.substr(1);
            setterName = "set" + c.toUpperCase() + propName.substr(1);
        }
        else
        {
            getterName = "get" + propName;
            setterName = "set" + propName;
        }
        ty[setterName] = function(val)
        {
            this.bridge.setPropertyInAS(this.fb_instance_id, propName, val);
        }
        ty[getterName] = function()
        {
            return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.fb_instance_id, propName));
        }
    },

    //add a method to a typename; used to define the methods that can be callefd on an AS proxied object
    addMethodToType: function(ty, methodName)
    {
        ty[methodName] = function()
        {
            return this.bridge.deserialize(this.bridge.callASMethod(this.fb_instance_id, methodName, FABridge.argsToArray(arguments)));
        }
    },

    // Function Proxies

    //returns the AS proxy for the specified function ID
    getFunctionProxy: function(funcID)
    {
        var bridge = this;
        if (this.remoteFunctionCache[funcID] == null)
        {
            this.remoteFunctionCache[funcID] = function()
            {
                bridge.callASFunction(funcID, FABridge.argsToArray(arguments));
            }
        }
        return this.remoteFunctionCache[funcID];
    },
    
    //reutrns the ID of the given function; if it doesnt exist it is created and added to the local cache
    getFunctionID: function(func)
    {
        if (func.__bridge_id__ == undefined)
        {
            func.__bridge_id__ = this.makeID(this.nextLocalFuncID++);
            this.localFunctionCache[func.__bridge_id__] = func;
        }
        return func.__bridge_id__;
    },

    // serialization / deserialization

    serialize: function(value)
    {
        var result = {};

        var t = typeof(value);
        //primitives are kept as such
        if (t == "number" || t == "string" || t == "boolean" || t == null || t == undefined)
        {
            result = value;
        }
        else if (value instanceof Array)
        {
            //arrays are serializesd recursively
            result = [];
            for (var i = 0; i < value.length; i++)
            {
                result[i] = this.serialize(value[i]);
            }
        }
        else if (t == "function")
        {
            //js functions are assigned an ID and stored in the local cache 
            result.type = FABridge.TYPE_JSFUNCTION;
            result.value = this.getFunctionID(value);
        }
        else if (value instanceof ASProxy)
        {
            result.type = FABridge.TYPE_ASINSTANCE;
            result.value = value.fb_instance_id;
        }
        else
        {
            result.type = FABridge.TYPE_ANONYMOUS;
            result.value = value;
        }

        return result;
    },

    //on deserialization we always check the return for the specific error code that is used to marshall NPE's into JS errors
    // the unpacking is done by returning the value on each pachet for objects/arrays 
    deserialize: function(packedValue)
    {

        var result;

        var t = typeof(packedValue);
        if (t == "number" || t == "string" || t == "boolean" || packedValue == null || packedValue == undefined)
        {
            result = this.handleError(packedValue);
        }
        else if (packedValue instanceof Array)
        {
            result = [];
            for (var i = 0; i < packedValue.length; i++)
            {
                result[i] = this.deserialize(packedValue[i]);
            }
        }
        else if (t == "object")
        {
            for(var i = 0; i < packedValue.newTypes.length; i++)
            {
                this.addTypeDataToCache(packedValue.newTypes[i]);
            }
            for (var aRefID in packedValue.newRefs)
            {
                this.createProxy(aRefID, packedValue.newRefs[aRefID]);
            }
            if (packedValue.type == FABridge.TYPE_PRIMITIVE)
            {
                result = packedValue.value;
            }
            else if (packedValue.type == FABridge.TYPE_ASFUNCTION)
            {
                result = this.getFunctionProxy(packedValue.value);
            }
            else if (packedValue.type == FABridge.TYPE_ASINSTANCE)
            {
                result = this.getProxy(packedValue.value);
            }
            else if (packedValue.type == FABridge.TYPE_ANONYMOUS)
            {
                result = packedValue.value;
            }
        }
        return result;
    },
    //increases the reference count for the given object
    addRef: function(obj)
    {
        this.target.incRef(obj.fb_instance_id);
    },
    //decrease the reference count for the given object and release it if needed
    release:function(obj)
    {
        this.target.releaseRef(obj.fb_instance_id);
    },

    // check the given value for the components of the hard-coded error code : __FLASHERROR
    // used to marshall NPE's into flash
    
    handleError: function(value)
    {
        if (typeof(value)=="string" && value.indexOf("__FLASHERROR")==0)
        {
            var myErrorMessage = value.split("||");
            if(FABridge.refCount > 0 )
            {
                FABridge.refCount--;
            }
            throw new Error(myErrorMessage[1]);
            return value;
        }
        else
        {
            return value;
        }   
    }
};

// The root ASProxy class that facades a flash object

ASProxy = function(bridge, typeName)
{
    this.bridge = bridge;
    this.typeName = typeName;
    return this;
};
//methods available on each ASProxy object
ASProxy.prototype =
{
    get: function(propName)
    {
        return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.fb_instance_id, propName));
    },

    set: function(propName, value)
    {
        this.bridge.setPropertyInAS(this.fb_instance_id, propName, value);
    },

    call: function(funcName, args)
    {
        this.bridge.callASMethod(this.fb_instance_id, funcName, args);
    }, 
    
    addRef: function() {
        this.bridge.addRef(this);
    }, 
    
    release: function() {
        this.bridge.release(this);
    }
};

// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>
// License: New BSD License
// Reference: http://dev.w3.org/html5/websockets/
// Reference: http://tools.ietf.org/html/draft-hixie-thewebsocketprotocol

(function() {
  
  if (window.WebSocket) return;

  var console = window.console;
  if (!console) console = {log: function(){ }, error: function(){ }};

  if (!swfobject.hasFlashPlayerVersion("9.0.0")) {
    console.error("Flash Player is not installed.");
    return;
  }
  if (location.protocol == "file:") {
    console.error(
      "WARNING: web-socket-js doesn't work in file:///... URL " +
      "unless you set Flash Security Settings properly. " +
      "Open the page via Web server i.e. http://...");
  }

  WebSocket = function(url, protocol, proxyHost, proxyPort, headers) {
    var self = this;
    self.readyState = WebSocket.CONNECTING;
    self.bufferedAmount = 0;
    // Uses setTimeout() to make sure __createFlash() runs after the caller sets ws.onopen etc.
    // Otherwise, when onopen fires immediately, onopen is called before it is set.
    setTimeout(function() {
      WebSocket.__addTask(function() {
        self.__createFlash(url, protocol, proxyHost, proxyPort, headers);
      });
    }, 1);
  }
  
  WebSocket.prototype.__createFlash = function(url, protocol, proxyHost, proxyPort, headers) {
    var self = this;
    self.__flash =
      WebSocket.__flash.create(url, protocol, proxyHost || null, proxyPort || 0, headers || null);

    self.__flash.addEventListener("open", function(fe) {
      try {
        self.readyState = self.__flash.getReadyState();
        if (self.__timer) clearInterval(self.__timer);
        if (window.opera) {
          // Workaround for weird behavior of Opera which sometimes drops events.
          self.__timer = setInterval(function () {
            self.__handleMessages();
          }, 500);
        }
        if (self.onopen) self.onopen();
      } catch (e) {
        console.error(e.toString());
      }
    });

    self.__flash.addEventListener("close", function(fe) {
      try {
        self.readyState = self.__flash.getReadyState();
        if (self.__timer) clearInterval(self.__timer);
        if (self.onclose) self.onclose();
      } catch (e) {
        console.error(e.toString());
      }
    });

    self.__flash.addEventListener("message", function() {
      try {
        self.__handleMessages();
      } catch (e) {
        console.error(e.toString());
      }
    });

    self.__flash.addEventListener("error", function(fe) {
      try {
        if (self.__timer) clearInterval(self.__timer);
        if (self.onerror) self.onerror();
      } catch (e) {
        console.error(e.toString());
      }
    });

    self.__flash.addEventListener("stateChange", function(fe) {
      try {
        self.readyState = self.__flash.getReadyState();
        self.bufferedAmount = fe.getBufferedAmount();
      } catch (e) {
        console.error(e.toString());
      }
    });

    //console.log("[WebSocket] Flash object is ready");
  };

  WebSocket.prototype.send = function(data) {
    if (this.__flash) {
      this.readyState = this.__flash.getReadyState();
    }
    if (!this.__flash || this.readyState == WebSocket.CONNECTING) {
      throw "INVALID_STATE_ERR: Web Socket connection has not been established";
    }
    // We use encodeURIComponent() here, because FABridge doesn't work if
    // the argument includes some characters. We don't use escape() here
    // because of this:
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Functions#escape_and_unescape_Functions
    // But it looks decodeURIComponent(encodeURIComponent(s)) doesn't
    // preserve all Unicode characters either e.g. "\uffff" in Firefox.
    var result = this.__flash.send(encodeURIComponent(data));
    if (result < 0) { // success
      return true;
    } else {
      this.bufferedAmount = result;
      return false;
    }
  };

  WebSocket.prototype.close = function() {
    var self = this;
    if (!self.__flash) return;
    self.readyState = self.__flash.getReadyState();
    if (self.readyState == WebSocket.CLOSED || self.readyState == WebSocket.CLOSING) return;
    self.__flash.close();
    // Sets/calls them manually here because Flash WebSocketConnection.close cannot fire events
    // which causes weird error:
    // > You are trying to call recursively into the Flash Player which is not allowed.
    self.readyState = WebSocket.CLOSED;
    if (self.__timer) clearInterval(self.__timer);
    if (self.onclose) {
       // Make it asynchronous so that it looks more like an actual
       // close event
       setTimeout(self.onclose, 1);
     }
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture !NB Not implemented yet
   * @return void
   */
  WebSocket.prototype.addEventListener = function(type, listener, useCapture) {
    if (!('__events' in this)) {
      this.__events = {};
    }
    if (!(type in this.__events)) {
      this.__events[type] = [];
      if ('function' == typeof this['on' + type]) {
        this.__events[type].defaultHandler = this['on' + type];
        this['on' + type] = this.__createEventHandler(this, type);
      }
    }
    this.__events[type].push(listener);
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {string} type
   * @param {function} listener
   * @param {boolean} useCapture NB! Not implemented yet
   * @return void
   */
  WebSocket.prototype.removeEventListener = function(type, listener, useCapture) {
    if (!('__events' in this)) {
      this.__events = {};
    }
    if (!(type in this.__events)) return;
    for (var i = this.__events.length; i > -1; --i) {
      if (listener === this.__events[type][i]) {
        this.__events[type].splice(i, 1);
        break;
      }
    }
  };

  /**
   * Implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-registration">DOM 2 EventTarget Interface</a>}
   *
   * @param {WebSocketEvent} event
   * @return void
   */
  WebSocket.prototype.dispatchEvent = function(event) {
    if (!('__events' in this)) throw 'UNSPECIFIED_EVENT_TYPE_ERR';
    if (!(event.type in this.__events)) throw 'UNSPECIFIED_EVENT_TYPE_ERR';

    for (var i = 0, l = this.__events[event.type].length; i < l; ++ i) {
      this.__events[event.type][i](event);
      if (event.cancelBubble) break;
    }

    if (false !== event.returnValue &&
        'function' == typeof this.__events[event.type].defaultHandler)
    {
      this.__events[event.type].defaultHandler(event);
    }
  };

  WebSocket.prototype.__handleMessages = function() {
    // Gets data using readSocketData() instead of getting it from event object
    // of Flash event. This is to make sure to keep message order.
    // It seems sometimes Flash events don't arrive in the same order as they are sent.
    var arr = this.__flash.readSocketData();
    for (var i = 0; i < arr.length; i++) {
      var data = decodeURIComponent(arr[i]);
      try {
        if (this.onmessage) {
          var e;
          if (window.MessageEvent) {
            e = document.createEvent("MessageEvent");
            e.initMessageEvent("message", false, false, data, null, null, window, null);
          } else { // IE
            e = {data: data};
          }
          this.onmessage(e);
        }
      } catch (e) {
        console.error(e.toString());
      }
    }
  };

  /**
   * @param {object} object
   * @param {string} type
   */
  WebSocket.prototype.__createEventHandler = function(object, type) {
    return function(data) {
      var event = new WebSocketEvent();
      event.initEvent(type, true, true);
      event.target = event.currentTarget = object;
      for (var key in data) {
        event[key] = data[key];
      }
      object.dispatchEvent(event, arguments);
    };
  }

  /**
   * Basic implementation of {@link <a href="http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface">DOM 2 EventInterface</a>}
   *
   * @class
   * @constructor
   */
  function WebSocketEvent(){}

  /**
   *
   * @type boolean
   */
  WebSocketEvent.prototype.cancelable = true;

  /**
   *
   * @type boolean
   */
  WebSocketEvent.prototype.cancelBubble = false;

  /**
   *
   * @return void
   */
  WebSocketEvent.prototype.preventDefault = function() {
    if (this.cancelable) {
      this.returnValue = false;
    }
  };

  /**
   *
   * @return void
   */
  WebSocketEvent.prototype.stopPropagation = function() {
    this.cancelBubble = true;
  };

  /**
   *
   * @param {string} eventTypeArg
   * @param {boolean} canBubbleArg
   * @param {boolean} cancelableArg
   * @return void
   */
  WebSocketEvent.prototype.initEvent = function(eventTypeArg, canBubbleArg, cancelableArg) {
    this.type = eventTypeArg;
    this.cancelable = cancelableArg;
    this.timeStamp = new Date();
  };


  WebSocket.CONNECTING = 0;
  WebSocket.OPEN = 1;
  WebSocket.CLOSING = 2;
  WebSocket.CLOSED = 3;

  WebSocket.__tasks = [];

  WebSocket.__initialize = function() {
    if (WebSocket.__swfLocation) {
      // For backword compatibility.
      window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation;
    }
    if (!window.WEB_SOCKET_SWF_LOCATION) {
      console.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf");
      return;
    }
    var container = document.createElement("div");
    container.id = "webSocketContainer";
    // Hides Flash box. We cannot use display: none or visibility: hidden because it prevents
    // Flash from loading at least in IE. So we move it out of the screen at (-100, -100).
    // But this even doesn't work with Flash Lite (e.g. in Droid Incredible). So with Flash
    // Lite, we put it at (0, 0). This shows 1x1 box visible at left-top corner but this is
    // the best we can do as far as we know now.
    container.style.position = "absolute";
    if (WebSocket.__isFlashLite()) {
      container.style.left = "0px";
      container.style.top = "0px";
    } else {
      container.style.left = "-100px";
      container.style.top = "-100px";
    }
    var holder = document.createElement("div");
    holder.id = "webSocketFlash";
    container.appendChild(holder);
    document.body.appendChild(container);
    // See this article for hasPriority:
    // http://help.adobe.com/en_US/as3/mobile/WS4bebcd66a74275c36cfb8137124318eebc6-7ffd.html
    swfobject.embedSWF(
      WEB_SOCKET_SWF_LOCATION, "webSocketFlash",
      "1" /* width */, "1" /* height */, "9.0.0" /* SWF version */,
      null, {bridgeName: "webSocket"}, {hasPriority: true, allowScriptAccess: "always"}, null,
      function(e) {
        if (!e.success) console.error("[WebSocket] swfobject.embedSWF failed");
      }
    );
    FABridge.addInitializationCallback("webSocket", function() {
      try {
        //console.log("[WebSocket] FABridge initializad");
        WebSocket.__flash = FABridge.webSocket.root();
        WebSocket.__flash.setCallerUrl(location.href);
        WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
        for (var i = 0; i < WebSocket.__tasks.length; ++i) {
          WebSocket.__tasks[i]();
        }
        WebSocket.__tasks = [];
      } catch (e) {
        console.error("[WebSocket] " + e.toString());
      }
    });
  };

  WebSocket.__addTask = function(task) {
    if (WebSocket.__flash) {
      task();
    } else {
      WebSocket.__tasks.push(task);
    }
  };
  
  WebSocket.__isFlashLite = function() {
    if (!window.navigator || !window.navigator.mimeTypes) return false;
    var mimeType = window.navigator.mimeTypes["application/x-shockwave-flash"];
    if (!mimeType || !mimeType.enabledPlugin || !mimeType.enabledPlugin.filename) return false;
    return mimeType.enabledPlugin.filename.match(/flashlite/i) ? true : false;
  };

  // called from Flash
  window.webSocketLog = function(message) {
    console.log(decodeURIComponent(message));
  };

  // called from Flash
  window.webSocketError = function(message) {
    console.error(decodeURIComponent(message));
  };

  if (!window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION) {
    if (window.addEventListener) {
      window.addEventListener("load", WebSocket.__initialize, false);
    } else {
      window.attachEvent("onload", WebSocket.__initialize);
    }
  }
  
})();



/**
 * @license 
 * jQuery Tools 1.2.5 Tooltip - UI essentials
 * 
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 * 
 * http://flowplayer.org/tools/tooltip/
 *
 * Since: November 2008
 * Date:    Wed Sep 22 06:02:10 2010 +0000 
 */
(function($) { 	
	// static constructs
	$.tools = $.tools || {version: '1.2.5'};
	
	$.tools.tooltip = {
		
		conf: { 
			
			// default effect variables
			effect: 'toggle',			
			fadeOutSpeed: "fast",
			predelay: 0,
			delay: 30,
			opacity: 1,			
			tip: 0,
			
			// 'top', 'bottom', 'right', 'left', 'center'
			position: ['top', 'center'], 
			offset: [0, 0],
			relative: false,
			cancelDefault: true,
			
			// type to event mapping 
			events: {
				def: 			"mouseenter,mouseleave",
				input: 		"focus,blur",
				widget:		"focus mouseenter,blur mouseleave",
				tooltip:		"mouseenter,mouseleave"
			},
			
			// 1.2
			layout: '<div/>',
			tipClass: 'tooltip'
		},
		
		addEffect: function(name, loadFn, hideFn) {
			effects[name] = [loadFn, hideFn];	
		} 
	};
	
	
	var effects = { 
		toggle: [ 
			function(done) { 
				var conf = this.getConf(), tip = this.getTip(), o = conf.opacity;
				if (o < 1) { tip.css({opacity: o}); }
				tip.show();
				done.call();
			},
			
			function(done) { 
				this.getTip().hide();
				done.call();
			} 
		],
		
		fade: [
			function(done) { 
				var conf = this.getConf();
				this.getTip().fadeTo(conf.fadeInSpeed, conf.opacity, done); 
			},  
			function(done) { 
				this.getTip().fadeOut(this.getConf().fadeOutSpeed, done); 
			} 
		]		
	};   

		
	/* calculate tip position relative to the trigger */  	
	function getPosition(trigger, tip, conf) {	

		
		// get origin top/left position 
		var top = conf.relative ? trigger.position().top : trigger.offset().top, 
			 left = conf.relative ? trigger.position().left : trigger.offset().left,
			 pos = conf.position[0];

		top  -= tip.outerHeight() - conf.offset[0];
		left += trigger.outerWidth() + conf.offset[1];
		
		// iPad position fix
		if (/iPad/i.test(navigator.userAgent)) {
			top -= $(window).scrollTop();
		}
		
		// adjust Y		
		var height = tip.outerHeight() + trigger.outerHeight();
		if (pos == 'center') 	{ top += height / 2; }
		if (pos == 'bottom') 	{ top += height; }
		
		
		// adjust X
		pos = conf.position[1]; 	
		var width = tip.outerWidth() + trigger.outerWidth();
		if (pos == 'center') 	{ left -= width / 2; }
		if (pos == 'left')   	{ left -= width; }	 
		
		return {top: top, left: left};
	}		

	
	
	function Tooltip(trigger, conf) {

		var self = this, 
			 fire = trigger.add(self),
			 tip,
			 timer = 0,
			 pretimer = 0, 
			 title = trigger.attr("title"),
			 tipAttr = trigger.attr("data-tooltip"),
			 effect = effects[conf.effect],
			 shown,
				 
			 // get show/hide configuration
			 isInput = trigger.is(":input"), 
			 isWidget = isInput && trigger.is(":checkbox, :radio, select, :button, :submit"),			
			 type = trigger.attr("type"),
			 evt = conf.events[type] || conf.events[isInput ? (isWidget ? 'widget' : 'input') : 'def']; 
		
		
		// check that configuration is sane
		if (!effect) { throw "Nonexistent effect \"" + conf.effect + "\""; }					
		
		evt = evt.split(/,\s*/); 
		if (evt.length != 2) { throw "Tooltip: bad events configuration for " + type; } 
		
		
		// trigger --> show  
		trigger.bind(evt[0], function(e) {

			clearTimeout(timer);
			if (conf.predelay) {
				pretimer = setTimeout(function() { self.show(e); }, conf.predelay);	
				
			} else {
				self.show(e);	
			}
			
		// trigger --> hide
		}).bind(evt[1], function(e)  {
			clearTimeout(pretimer);
			if (conf.delay)  {
				timer = setTimeout(function() { self.hide(e); }, conf.delay);	
				
			} else {
				self.hide(e);		
			}
			
		}); 
		
		
		// remove default title
		if (title && conf.cancelDefault) { 
			trigger.removeAttr("title");
			trigger.data("title", title);			
		}		
		
		$.extend(self, {
				
			show: function(e) {  

				// tip not initialized yet
				if (!tip) {
					
					// data-tooltip 
					if (tipAttr) {
						tip = $(tipAttr);

					// single tip element for all
					} else if (conf.tip) { 
						tip = $(conf.tip).eq(0);
						
					// autogenerated tooltip
					} else if (title) { 
						tip = $(conf.layout).addClass(conf.tipClass).appendTo(document.body)
							.hide().append(title);

					// manual tooltip
					} else {	
						tip = trigger.next();  
						if (!tip.length) { tip = trigger.parent().next(); } 	 
					}
					
					if (!tip.length) { throw "Cannot find tooltip for " + trigger;	}
				} 
			 	
			 	if (self.isShown()) { return self; }  
				
			 	// stop previous animation
			 	tip.stop(true, true); 			 	
			 	
				// get position
				var pos = getPosition(trigger, tip, conf);			
		
				// restore title for single tooltip element
				if (conf.tip) {
					tip.html(trigger.data("title"));
				}

				// onBeforeShow
				e = e || $.Event();
				e.type = "onBeforeShow";
				fire.trigger(e, [pos]);				
				if (e.isDefaultPrevented()) { return self; }
		
				
				// onBeforeShow may have altered the configuration
				pos = getPosition(trigger, tip, conf);
				
				// set position
				tip.css({position:'absolute', top: pos.top, left: pos.left});					
				
				shown = true;
				
				// invoke effect 
				effect[0].call(self, function() {
					e.type = "onShow";
					shown = 'full';
					fire.trigger(e);		 
				});					

	 	
				// tooltip events       
				var event = conf.events.tooltip.split(/,\s*/);

				if (!tip.data("__set")) {
					
					tip.bind(event[0], function() { 
						clearTimeout(timer);
						clearTimeout(pretimer);
					});
					
					if (event[1] && !trigger.is("input:not(:checkbox, :radio), textarea")) { 					
						tip.bind(event[1], function(e) {
	
							// being moved to the trigger element
							if (e.relatedTarget != trigger[0]) {
								trigger.trigger(evt[1].split(" ")[0]);
							}
						}); 
					} 
					
					tip.data("__set", true);
				}
				
				return self;
			},
			
			hide: function(e) {

				if (!tip || !self.isShown()) { return self; }
			
				// onBeforeHide
				e = e || $.Event();
				e.type = "onBeforeHide";
				fire.trigger(e);				
				if (e.isDefaultPrevented()) { return; }
	
				shown = false;
				
				effects[conf.effect][1].call(self, function() {
					e.type = "onHide";
					fire.trigger(e);		 
				});
				
				return self;
			},
			
			isShown: function(fully) {
				return fully ? shown == 'full' : shown;	
			},
				
			getConf: function() {
				return conf;	
			},
				
			getTip: function() {
				return tip;	
			},
			
			getTrigger: function() {
				return trigger;	
			}		

		});		

		// callbacks	
		$.each("onHide,onBeforeShow,onShow,onBeforeHide".split(","), function(i, name) {
				
			// configuration
			if ($.isFunction(conf[name])) { 
				$(self).bind(name, conf[name]); 
			}

			// API
			self[name] = function(fn) {
				if (fn) { $(self).bind(name, fn); }
				return self;
			};
		});
		
	}
		
	
	// jQuery plugin implementation
	$.fn.tooltip = function(conf) {
		
		// return existing instance
		var api = this.data("tooltip");
		if (api) { return api; }

		conf = $.extend(true, {}, $.tools.tooltip.conf, conf);
		
		// position can also be given as string
		if (typeof conf.position == 'string') {
			conf.position = conf.position.split(/,?\s/);	
		}
		
		// install tooltip for each entry in jQuery object
		this.each(function() {
			api = new Tooltip($(this), conf); 
			$(this).data("tooltip", api); 
		});
		
		return conf.api ? api: this;		 
	};
		
}) (jQuery);
/*!
 * jQuery UI 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function(c,j){function k(a){return!c(a).parents().andSelf().filter(function(){return c.curCSS(this,"visibility")==="hidden"||c.expr.filters.hidden(this)}).length}c.ui=c.ui||{};if(!c.ui.version){c.extend(c.ui,{version:"1.8.11",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,
NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}});c.fn.extend({_focus:c.fn.focus,focus:function(a,b){return typeof a==="number"?this.each(function(){var d=this;setTimeout(function(){c(d).focus();b&&b.call(d)},a)}):this._focus.apply(this,arguments)},scrollParent:function(){var a;a=c.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(c.curCSS(this,
"position",1))&&/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(c.curCSS(this,"overflow",1)+c.curCSS(this,"overflow-y",1)+c.curCSS(this,"overflow-x",1))}).eq(0);return/fixed/.test(this.css("position"))||!a.length?c(document):a},zIndex:function(a){if(a!==j)return this.css("zIndex",a);if(this.length){a=c(this[0]);for(var b;a.length&&a[0]!==document;){b=a.css("position");
if(b==="absolute"||b==="relative"||b==="fixed"){b=parseInt(a.css("zIndex"),10);if(!isNaN(b)&&b!==0)return b}a=a.parent()}}return 0},disableSelection:function(){return this.bind((c.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}});c.each(["Width","Height"],function(a,b){function d(f,g,l,m){c.each(e,function(){g-=parseFloat(c.curCSS(f,"padding"+this,true))||0;if(l)g-=parseFloat(c.curCSS(f,
"border"+this+"Width",true))||0;if(m)g-=parseFloat(c.curCSS(f,"margin"+this,true))||0});return g}var e=b==="Width"?["Left","Right"]:["Top","Bottom"],h=b.toLowerCase(),i={innerWidth:c.fn.innerWidth,innerHeight:c.fn.innerHeight,outerWidth:c.fn.outerWidth,outerHeight:c.fn.outerHeight};c.fn["inner"+b]=function(f){if(f===j)return i["inner"+b].call(this);return this.each(function(){c(this).css(h,d(this,f)+"px")})};c.fn["outer"+b]=function(f,g){if(typeof f!=="number")return i["outer"+b].call(this,f);return this.each(function(){c(this).css(h,
d(this,f,true,g)+"px")})}});c.extend(c.expr[":"],{data:function(a,b,d){return!!c.data(a,d[3])},focusable:function(a){var b=a.nodeName.toLowerCase(),d=c.attr(a,"tabindex");if("area"===b){b=a.parentNode;d=b.name;if(!a.href||!d||b.nodeName.toLowerCase()!=="map")return false;a=c("img[usemap=#"+d+"]")[0];return!!a&&k(a)}return(/input|select|textarea|button|object/.test(b)?!a.disabled:"a"==b?a.href||!isNaN(d):!isNaN(d))&&k(a)},tabbable:function(a){var b=c.attr(a,"tabindex");return(isNaN(b)||b>=0)&&c(a).is(":focusable")}});
c(function(){var a=document.body,b=a.appendChild(b=document.createElement("div"));c.extend(b.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0});c.support.minHeight=b.offsetHeight===100;c.support.selectstart="onselectstart"in b;a.removeChild(b).style.display="none"});c.extend(c.ui,{plugin:{add:function(a,b,d){a=c.ui[a].prototype;for(var e in d){a.plugins[e]=a.plugins[e]||[];a.plugins[e].push([b,d[e]])}},call:function(a,b,d){if((b=a.plugins[b])&&a.element[0].parentNode)for(var e=0;e<b.length;e++)a.options[b[e][0]]&&
b[e][1].apply(a.element,d)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(a,b){if(c(a).css("overflow")==="hidden")return false;b=b&&b==="left"?"scrollLeft":"scrollTop";var d=false;if(a[b]>0)return true;a[b]=1;d=a[b]>0;a[b]=0;return d},isOverAxis:function(a,b,d){return a>b&&a<b+d},isOver:function(a,b,d,e,h,i){return c.ui.isOverAxis(a,d,h)&&c.ui.isOverAxis(b,e,i)}})}})(jQuery);
;/*!
 * jQuery UI Widget 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function(b,j){if(b.cleanData){var k=b.cleanData;b.cleanData=function(a){for(var c=0,d;(d=a[c])!=null;c++)b(d).triggerHandler("remove");k(a)}}else{var l=b.fn.remove;b.fn.remove=function(a,c){return this.each(function(){if(!c)if(!a||b.filter(a,[this]).length)b("*",this).add([this]).each(function(){b(this).triggerHandler("remove")});return l.call(b(this),a,c)})}}b.widget=function(a,c,d){var e=a.split(".")[0],f;a=a.split(".")[1];f=e+"-"+a;if(!d){d=c;c=b.Widget}b.expr[":"][f]=function(h){return!!b.data(h,
a)};b[e]=b[e]||{};b[e][a]=function(h,g){arguments.length&&this._createWidget(h,g)};c=new c;c.options=b.extend(true,{},c.options);b[e][a].prototype=b.extend(true,c,{namespace:e,widgetName:a,widgetEventPrefix:b[e][a].prototype.widgetEventPrefix||a,widgetBaseClass:f},d);b.widget.bridge(a,b[e][a])};b.widget.bridge=function(a,c){b.fn[a]=function(d){var e=typeof d==="string",f=Array.prototype.slice.call(arguments,1),h=this;d=!e&&f.length?b.extend.apply(null,[true,d].concat(f)):d;if(e&&d.charAt(0)==="_")return h;
e?this.each(function(){var g=b.data(this,a),i=g&&b.isFunction(g[d])?g[d].apply(g,f):g;if(i!==g&&i!==j){h=i;return false}}):this.each(function(){var g=b.data(this,a);g?g.option(d||{})._init():b.data(this,a,new c(d,this))});return h}};b.Widget=function(a,c){arguments.length&&this._createWidget(a,c)};b.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:false},_createWidget:function(a,c){b.data(c,this.widgetName,this);this.element=b(c);this.options=b.extend(true,{},this.options,
this._getCreateOptions(),a);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()});this._create();this._trigger("create");this._init()},_getCreateOptions:function(){return b.metadata&&b.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName);this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled ui-state-disabled")},
widget:function(){return this.element},option:function(a,c){var d=a;if(arguments.length===0)return b.extend({},this.options);if(typeof a==="string"){if(c===j)return this.options[a];d={};d[a]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(d,e){c._setOption(d,e)});return this},_setOption:function(a,c){this.options[a]=c;if(a==="disabled")this.widget()[c?"addClass":"removeClass"](this.widgetBaseClass+"-disabled ui-state-disabled").attr("aria-disabled",c);return this},
enable:function(){return this._setOption("disabled",false)},disable:function(){return this._setOption("disabled",true)},_trigger:function(a,c,d){var e=this.options[a];c=b.Event(c);c.type=(a===this.widgetEventPrefix?a:this.widgetEventPrefix+a).toLowerCase();d=d||{};if(c.originalEvent){a=b.event.props.length;for(var f;a;){f=b.event.props[--a];c[f]=c.originalEvent[f]}}this.element.trigger(c,d);return!(b.isFunction(e)&&e.call(this.element[0],c,d)===false||c.isDefaultPrevented())}}})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function(b){b.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var a=this;this.element.bind("mousedown."+this.widgetName,function(c){return a._mouseDown(c)}).bind("click."+this.widgetName,function(c){if(true===b.data(c.target,a.widgetName+".preventClickEvent")){b.removeData(c.target,a.widgetName+".preventClickEvent");c.stopImmediatePropagation();return false}});this.started=false},_mouseDestroy:function(){this.element.unbind("."+this.widgetName)},_mouseDown:function(a){a.originalEvent=
a.originalEvent||{};if(!a.originalEvent.mouseHandled){this._mouseStarted&&this._mouseUp(a);this._mouseDownEvent=a;var c=this,e=a.which==1,f=typeof this.options.cancel=="string"?b(a.target).parents().add(a.target).filter(this.options.cancel).length:false;if(!e||f||!this._mouseCapture(a))return true;this.mouseDelayMet=!this.options.delay;if(!this.mouseDelayMet)this._mouseDelayTimer=setTimeout(function(){c.mouseDelayMet=true},this.options.delay);if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a)){this._mouseStarted=
this._mouseStart(a)!==false;if(!this._mouseStarted){a.preventDefault();return true}}true===b.data(a.target,this.widgetName+".preventClickEvent")&&b.removeData(a.target,this.widgetName+".preventClickEvent");this._mouseMoveDelegate=function(d){return c._mouseMove(d)};this._mouseUpDelegate=function(d){return c._mouseUp(d)};b(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate);a.preventDefault();return a.originalEvent.mouseHandled=
true}},_mouseMove:function(a){if(b.browser.msie&&!(document.documentMode>=9)&&!a.button)return this._mouseUp(a);if(this._mouseStarted){this._mouseDrag(a);return a.preventDefault()}if(this._mouseDistanceMet(a)&&this._mouseDelayMet(a))(this._mouseStarted=this._mouseStart(this._mouseDownEvent,a)!==false)?this._mouseDrag(a):this._mouseUp(a);return!this._mouseStarted},_mouseUp:function(a){b(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate);
if(this._mouseStarted){this._mouseStarted=false;a.target==this._mouseDownEvent.target&&b.data(a.target,this.widgetName+".preventClickEvent",true);this._mouseStop(a)}return false},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return true}})})(jQuery);
;/*
 * jQuery UI Button 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function(a){var g,i=function(b){a(":ui-button",b.target.form).each(function(){var c=a(this).data("button");setTimeout(function(){c.refresh()},1)})},h=function(b){var c=b.name,d=b.form,f=a([]);if(c)f=d?a(d).find("[name='"+c+"']"):a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form});return f};a.widget("ui.button",{options:{disabled:null,text:true,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",
i);if(typeof this.options.disabled!=="boolean")this.options.disabled=this.element.attr("disabled");this._determineButtonType();this.hasTitle=!!this.buttonElement.attr("title");var b=this,c=this.options,d=this.type==="checkbox"||this.type==="radio",f="ui-state-hover"+(!d?" ui-state-active":"");if(c.label===null)c.label=this.buttonElement.html();if(this.element.is(":disabled"))c.disabled=true;this.buttonElement.addClass("ui-button ui-widget ui-state-default ui-corner-all").attr("role","button").bind("mouseenter.button",
function(){if(!c.disabled){a(this).addClass("ui-state-hover");this===g&&a(this).addClass("ui-state-active")}}).bind("mouseleave.button",function(){c.disabled||a(this).removeClass(f)}).bind("focus.button",function(){a(this).addClass("ui-state-focus")}).bind("blur.button",function(){a(this).removeClass("ui-state-focus")});d&&this.element.bind("change.button",function(){b.refresh()});if(this.type==="checkbox")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).toggleClass("ui-state-active");
b.buttonElement.attr("aria-pressed",b.element[0].checked)});else if(this.type==="radio")this.buttonElement.bind("click.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");b.buttonElement.attr("aria-pressed",true);var e=b.element[0];h(e).not(e).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed",false)});else{this.buttonElement.bind("mousedown.button",function(){if(c.disabled)return false;a(this).addClass("ui-state-active");
g=this;a(document).one("mouseup",function(){g=null})}).bind("mouseup.button",function(){if(c.disabled)return false;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(e){if(c.disabled)return false;if(e.keyCode==a.ui.keyCode.SPACE||e.keyCode==a.ui.keyCode.ENTER)a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")});this.buttonElement.is("a")&&this.buttonElement.keyup(function(e){e.keyCode===a.ui.keyCode.SPACE&&a(this).click()})}this._setOption("disabled",
c.disabled)},_determineButtonType:function(){this.type=this.element.is(":checkbox")?"checkbox":this.element.is(":radio")?"radio":this.element.is("input")?"input":"button";if(this.type==="checkbox"||this.type==="radio"){var b=this.element.parents().filter(":last"),c="label[for="+this.element.attr("id")+"]";this.buttonElement=b.find(c);if(!this.buttonElement.length){b=b.length?b.siblings():this.element.siblings();this.buttonElement=b.filter(c);if(!this.buttonElement.length)this.buttonElement=b.find(c)}this.element.addClass("ui-helper-hidden-accessible");
(b=this.element.is(":checked"))&&this.buttonElement.addClass("ui-state-active");this.buttonElement.attr("aria-pressed",b)}else this.buttonElement=this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible");this.buttonElement.removeClass("ui-button ui-widget ui-state-default ui-corner-all ui-state-hover ui-state-active  ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only").removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
this.hasTitle||this.buttonElement.removeAttr("title");a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments);if(b==="disabled")c?this.element.attr("disabled",true):this.element.removeAttr("disabled");this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b);if(this.type==="radio")h(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed",
true):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed",false)});else if(this.type==="checkbox")this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed",true):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed",false)},_resetButton:function(){if(this.type==="input")this.options.label&&this.element.val(this.options.label);else{var b=this.buttonElement.removeClass("ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only"),
c=a("<span></span>").addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,f=d.primary&&d.secondary,e=[];if(d.primary||d.secondary){if(this.options.text)e.push("ui-button-text-icon"+(f?"s":d.primary?"-primary":"-secondary"));d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>");d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>");if(!this.options.text){e.push(f?"ui-button-icons-only":
"ui-button-icon-only");this.hasTitle||b.attr("title",c)}}else e.push("ui-button-text-only");b.addClass(e.join(" "))}}});a.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c);a.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass("ui-corner-left").end().filter(":last").addClass("ui-corner-right").end().end()},
destroy:function(){this.element.removeClass("ui-buttonset");this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy");a.Widget.prototype.destroy.call(this)}})})(jQuery);
;/*
 * jQuery UI Slider 1.8.11
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Slider
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function(d){d.widget("ui.slider",d.ui.mouse,{widgetEventPrefix:"slide",options:{animate:false,distance:0,max:100,min:0,orientation:"horizontal",range:false,step:1,value:0,values:null},_create:function(){var b=this,a=this.options;this._mouseSliding=this._keySliding=false;this._animateOff=true;this._handleIndex=null;this._detectOrientation();this._mouseInit();this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all");a.disabled&&this.element.addClass("ui-slider-disabled ui-disabled");
this.range=d([]);if(a.range){if(a.range===true){this.range=d("<div></div>");if(!a.values)a.values=[this._valueMin(),this._valueMin()];if(a.values.length&&a.values.length!==2)a.values=[a.values[0],a.values[0]]}else this.range=d("<div></div>");this.range.appendTo(this.element).addClass("ui-slider-range");if(a.range==="min"||a.range==="max")this.range.addClass("ui-slider-range-"+a.range);this.range.addClass("ui-widget-header")}d(".ui-slider-handle",this.element).length===0&&d("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");
if(a.values&&a.values.length)for(;d(".ui-slider-handle",this.element).length<a.values.length;)d("<a href='#'></a>").appendTo(this.element).addClass("ui-slider-handle");this.handles=d(".ui-slider-handle",this.element).addClass("ui-state-default ui-corner-all");this.handle=this.handles.eq(0);this.handles.add(this.range).filter("a").click(function(c){c.preventDefault()}).hover(function(){a.disabled||d(this).addClass("ui-state-hover")},function(){d(this).removeClass("ui-state-hover")}).focus(function(){if(a.disabled)d(this).blur();
else{d(".ui-slider .ui-state-focus").removeClass("ui-state-focus");d(this).addClass("ui-state-focus")}}).blur(function(){d(this).removeClass("ui-state-focus")});this.handles.each(function(c){d(this).data("index.ui-slider-handle",c)});this.handles.keydown(function(c){var e=true,f=d(this).data("index.ui-slider-handle"),h,g,i;if(!b.options.disabled){switch(c.keyCode){case d.ui.keyCode.HOME:case d.ui.keyCode.END:case d.ui.keyCode.PAGE_UP:case d.ui.keyCode.PAGE_DOWN:case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:e=
false;if(!b._keySliding){b._keySliding=true;d(this).addClass("ui-state-active");h=b._start(c,f);if(h===false)return}break}i=b.options.step;h=b.options.values&&b.options.values.length?(g=b.values(f)):(g=b.value());switch(c.keyCode){case d.ui.keyCode.HOME:g=b._valueMin();break;case d.ui.keyCode.END:g=b._valueMax();break;case d.ui.keyCode.PAGE_UP:g=b._trimAlignValue(h+(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.PAGE_DOWN:g=b._trimAlignValue(h-(b._valueMax()-b._valueMin())/5);break;case d.ui.keyCode.UP:case d.ui.keyCode.RIGHT:if(h===
b._valueMax())return;g=b._trimAlignValue(h+i);break;case d.ui.keyCode.DOWN:case d.ui.keyCode.LEFT:if(h===b._valueMin())return;g=b._trimAlignValue(h-i);break}b._slide(c,f,g);return e}}).keyup(function(c){var e=d(this).data("index.ui-slider-handle");if(b._keySliding){b._keySliding=false;b._stop(c,e);b._change(c,e);d(this).removeClass("ui-state-active")}});this._refreshValue();this._animateOff=false},destroy:function(){this.handles.remove();this.range.remove();this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider");
this._mouseDestroy();return this},_mouseCapture:function(b){var a=this.options,c,e,f,h,g;if(a.disabled)return false;this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()};this.elementOffset=this.element.offset();c=this._normValueFromMouse({x:b.pageX,y:b.pageY});e=this._valueMax()-this._valueMin()+1;h=this;this.handles.each(function(i){var j=Math.abs(c-h.values(i));if(e>j){e=j;f=d(this);g=i}});if(a.range===true&&this.values(1)===a.min){g+=1;f=d(this.handles[g])}if(this._start(b,
g)===false)return false;this._mouseSliding=true;h._handleIndex=g;f.addClass("ui-state-active").focus();a=f.offset();this._clickOffset=!d(b.target).parents().andSelf().is(".ui-slider-handle")?{left:0,top:0}:{left:b.pageX-a.left-f.width()/2,top:b.pageY-a.top-f.height()/2-(parseInt(f.css("borderTopWidth"),10)||0)-(parseInt(f.css("borderBottomWidth"),10)||0)+(parseInt(f.css("marginTop"),10)||0)};this.handles.hasClass("ui-state-hover")||this._slide(b,g,c);return this._animateOff=true},_mouseStart:function(){return true},
_mouseDrag:function(b){var a=this._normValueFromMouse({x:b.pageX,y:b.pageY});this._slide(b,this._handleIndex,a);return false},_mouseStop:function(b){this.handles.removeClass("ui-state-active");this._mouseSliding=false;this._stop(b,this._handleIndex);this._change(b,this._handleIndex);this._clickOffset=this._handleIndex=null;return this._animateOff=false},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(b){var a;
if(this.orientation==="horizontal"){a=this.elementSize.width;b=b.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)}else{a=this.elementSize.height;b=b.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)}a=b/a;if(a>1)a=1;if(a<0)a=0;if(this.orientation==="vertical")a=1-a;b=this._valueMax()-this._valueMin();return this._trimAlignValue(this._valueMin()+a*b)},_start:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=
this.values(a);c.values=this.values()}return this._trigger("start",b,c)},_slide:function(b,a,c){var e;if(this.options.values&&this.options.values.length){e=this.values(a?0:1);if(this.options.values.length===2&&this.options.range===true&&(a===0&&c>e||a===1&&c<e))c=e;if(c!==this.values(a)){e=this.values();e[a]=c;b=this._trigger("slide",b,{handle:this.handles[a],value:c,values:e});this.values(a?0:1);b!==false&&this.values(a,c,true)}}else if(c!==this.value()){b=this._trigger("slide",b,{handle:this.handles[a],
value:c});b!==false&&this.value(c)}},_stop:function(b,a){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("stop",b,c)},_change:function(b,a){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[a],value:this.value()};if(this.options.values&&this.options.values.length){c.value=this.values(a);c.values=this.values()}this._trigger("change",b,c)}},value:function(b){if(arguments.length){this.options.value=
this._trimAlignValue(b);this._refreshValue();this._change(null,0)}return this._value()},values:function(b,a){var c,e,f;if(arguments.length>1){this.options.values[b]=this._trimAlignValue(a);this._refreshValue();this._change(null,b)}if(arguments.length)if(d.isArray(arguments[0])){c=this.options.values;e=arguments[0];for(f=0;f<c.length;f+=1){c[f]=this._trimAlignValue(e[f]);this._change(null,f)}this._refreshValue()}else return this.options.values&&this.options.values.length?this._values(b):this.value();
else return this._values()},_setOption:function(b,a){var c,e=0;if(d.isArray(this.options.values))e=this.options.values.length;d.Widget.prototype._setOption.apply(this,arguments);switch(b){case "disabled":if(a){this.handles.filter(".ui-state-focus").blur();this.handles.removeClass("ui-state-hover");this.handles.attr("disabled","disabled");this.element.addClass("ui-disabled")}else{this.handles.removeAttr("disabled");this.element.removeClass("ui-disabled")}break;case "orientation":this._detectOrientation();
this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation);this._refreshValue();break;case "value":this._animateOff=true;this._refreshValue();this._change(null,0);this._animateOff=false;break;case "values":this._animateOff=true;this._refreshValue();for(c=0;c<e;c+=1)this._change(null,c);this._animateOff=false;break}},_value:function(){var b=this.options.value;return b=this._trimAlignValue(b)},_values:function(b){var a,c;if(arguments.length){a=this.options.values[b];
return a=this._trimAlignValue(a)}else{a=this.options.values.slice();for(c=0;c<a.length;c+=1)a[c]=this._trimAlignValue(a[c]);return a}},_trimAlignValue:function(b){if(b<=this._valueMin())return this._valueMin();if(b>=this._valueMax())return this._valueMax();var a=this.options.step>0?this.options.step:1,c=(b-this._valueMin())%a;alignValue=b-c;if(Math.abs(c)*2>=a)alignValue+=c>0?a:-a;return parseFloat(alignValue.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},
_refreshValue:function(){var b=this.options.range,a=this.options,c=this,e=!this._animateOff?a.animate:false,f,h={},g,i,j,l;if(this.options.values&&this.options.values.length)this.handles.each(function(k){f=(c.values(k)-c._valueMin())/(c._valueMax()-c._valueMin())*100;h[c.orientation==="horizontal"?"left":"bottom"]=f+"%";d(this).stop(1,1)[e?"animate":"css"](h,a.animate);if(c.options.range===true)if(c.orientation==="horizontal"){if(k===0)c.range.stop(1,1)[e?"animate":"css"]({left:f+"%"},a.animate);
if(k===1)c.range[e?"animate":"css"]({width:f-g+"%"},{queue:false,duration:a.animate})}else{if(k===0)c.range.stop(1,1)[e?"animate":"css"]({bottom:f+"%"},a.animate);if(k===1)c.range[e?"animate":"css"]({height:f-g+"%"},{queue:false,duration:a.animate})}g=f});else{i=this.value();j=this._valueMin();l=this._valueMax();f=l!==j?(i-j)/(l-j)*100:0;h[c.orientation==="horizontal"?"left":"bottom"]=f+"%";this.handle.stop(1,1)[e?"animate":"css"](h,a.animate);if(b==="min"&&this.orientation==="horizontal")this.range.stop(1,
1)[e?"animate":"css"]({width:f+"%"},a.animate);if(b==="max"&&this.orientation==="horizontal")this.range[e?"animate":"css"]({width:100-f+"%"},{queue:false,duration:a.animate});if(b==="min"&&this.orientation==="vertical")this.range.stop(1,1)[e?"animate":"css"]({height:f+"%"},a.animate);if(b==="max"&&this.orientation==="vertical")this.range[e?"animate":"css"]({height:100-f+"%"},{queue:false,duration:a.animate})}}});d.extend(d.ui.slider,{version:"1.8.11"})})(jQuery);
;;