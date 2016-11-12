function resize(context,t,r,b,l) {
	var doc = context.document;
	var selection = context.selection;
	for (var i=0; i < selection.count(); i++) {
		var layer = selection.objectAtIndex(i);
		var frame = layer.frame();

		//if layer is a textlayer, set width to fixed
		if (layer instanceof MSTextLayer) {
			layer.setTextBehaviour(1);
		}

		// Top
		if(t != 0) {
			if (frame.height() + t < 0) {
				var oldHeight = frame.height();
				frame.setHeight(1); // When contracting size prevent object to get a negative height (e.g. -45px).
				frame.setY(frame.y() + oldHeight - 1); // reposition the object
			} else {
				frame.setY(frame.y() - t); // push/pull object to correct position
				frame.setHeight(frame.height() + t);
			}
		}

		// Right
		if(r != 0) {
			frame.setWidth(frame.width() + r);
			if(frame.width() <= 1) { frame.setWidth(1); }
		}

		// Bottom
		if(b != 0) {
			frame.setHeight(frame.height() + b);
			if(frame.height() <= 1) { frame.setHeight(1); }
		}

		// Left
		if(l != 0) {
			if (frame.width() + l < 0) {
				var oldWidth = frame.width();
				frame.setWidth(1);
				frame.setX(frame.x() + oldWidth - 1);
			} else {
				frame.setX(frame.x() - l); // push/pull object to correct position
				frame.setWidth(frame.width() + l);
			}
		}
	}
	doc.reloadInspector(); //makes it a lot slower, but timeouts/throttling don't seem to work...
}

// A nicer/shorter way for saving settings than using persistence.js: http://developer.sketchapp.com/reference/api/file/api/Application.js.html
// It seems like they are not part of the Sketch API yet, as long as that's not
// the case use 'rc' as a prefix to prevent conflicts in the future

// Set setting for key
function rcSetSettingForKey(key, value) {
    NSUserDefaults.standardUserDefaults().setObject_forKey_(value, key)
}
// Get setting for key
function rcSettingForKey(key) {
    return NSUserDefaults.standardUserDefaults().objectForKey_(key);
}

function getBigResizeDistance() {
	if (rcSettingForKey("bigResizeDistance")) {
		return rcSettingForKey("bigResizeDistance");
	} else {
		return 10;
	}
}
function getSmallResizeDistance() {
	if (rcSettingForKey("smallResizeDistance")) {
		return rcSettingForKey("smallResizeDistance");
	} else {
		return 1;
	}
}

function onExpandTopBig(context) {
	getBigResizeDistance();
	resize(context,+getBigResizeDistance(),0,0,0);
}
function onExpandRightBig(context) {
	getBigResizeDistance();
	resize(context,0,+getBigResizeDistance(),0,0);
}
function onExpandBottomBig(context) {
	getBigResizeDistance();
	resize(context,0,0,+getBigResizeDistance(),0);
}
function onExpandLeftBig(context) {
	getBigResizeDistance();
	resize(context,0,0,0,+getBigResizeDistance());
}
////////////////////////////////////////////////////////////  +1
function onExpandTopSmall(context) {
	resize(context,+getSmallResizeDistance(),0,0,0);
}
function onExpandRightSmall(context) {
	resize(context,0,+getSmallResizeDistance(),0,0);
}
function onExpandBottomSmall(context) {
	resize(context,0,0,+getSmallResizeDistance(),0);
}
function onExpandLeftSmall(context) {
	resize(context,0,0,0,+getSmallResizeDistance());
}

////////////////////////////////////////////////////////////  -10
function onContractTopBig(context) {
	getBigResizeDistance();
	resize(context,-getBigResizeDistance(),0,0,0);
}
function onContractRightBig(context) {
	getBigResizeDistance();
	resize(context,0,-getBigResizeDistance(),0,0);
}
function onContractBottomBig(context) {
	getBigResizeDistance();
	resize(context,0,0,-getBigResizeDistance(),0);
}
function onContractLeftBig(context) {
	getBigResizeDistance();
	resize(context,0,0,0,-getBigResizeDistance());
}

////////////////////////////////////////////////////////////  -1
function onContractTopSmall(context) {
	resize(context,-getSmallResizeDistance(),0,0,0);
}
function onContractRightSmall(context) {
	resize(context,0,-getSmallResizeDistance(),0,0);
}
function onContractBottomSmall(context) {
	resize(context,0,0,-getSmallResizeDistance(),0);
}
function onContractLeftSmall(context) {
	resize(context,0,0,0,-getSmallResizeDistance());
}
function onSetBigResizeDistance(context) {
	var doc = context.document;
	var resizePrompt = doc.askForUserInput_initialValue("Set big resize distance to:", getBigResizeDistance());
	rcSetSettingForKey("bigResizeDistance", resizePrompt);
}
function onSetSmallResizeDistance(context) {
	var doc = context.document;
	var resizePrompt = doc.askForUserInput_initialValue("Set small resize distance to:", getSmallResizeDistance());
	if (!isNaN(resizePrompt)) {
		rcSetSettingForKey("smallResizeDistance", resizePrompt);
	}
}
