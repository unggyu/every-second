var SUCCESS = 'success';
var FAILURE = 'failure';
var TIME_COEFFICIENT = 254016000000;

function parse(json) {
	return JSON.parse(decodeURIComponent(json));
}

function stringify(obj) {
	return encodeURIComponent(JSON.stringify(obj));
}

if ($ === undefined) {
	$ = {};
}

$._ES_ = {
	testHost: function() {
		var payload = {};

		try {
			payload.result = 'testHost result';
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	testHostWithParam: function(param) {
		var payload = {};
		
		try {
			var paramStr;
			if (typeof param === 'string') {
				paramStr = decodeURIComponent(param);
				param = JSON.parse(paramStr);
			} else {
				paramStr = JSON.stringify(param);
			}
			payload.result = {};
			payload.result.parameter = paramStr;
			payload.result.data = 'hola from extendscript ' + param.name;
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	getProjectItemsLength: function() {
		var payload = {};

		try {
			payload.result = app.project.rootItem.children.length;
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	getProjectItem: function(index) {
		var payload = {};

		try {
			payload.result = app.project.rootItem.children[index];
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	addTrack: function() {
		var payload = {};

		try {
			app.enableQE();
			var activeSeq = qe.project.getActiveSequence();
			// 1 audio track, 1 video track
			activeSeq.addTracks(1);
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	startEdit: function(param) {
		var payload = {};

		try {
			if (typeof param === 'string') {	
				param = parse(param);
			}
			// Enable qe to use the qe object
			app.enableQE();
			var activeSeq = app.project.activeSequence;
			var videoTracks = activeSeq.videoTracks;
			
			// Finding the number of tracks needed to inject a clip
			var endTime = 0;
			var trackCountToAdd;
			if (param.untilEndOfClip) {
				var qeClip = qe.source.clip;
				var frameRate = Math.round(qeClip.videoFrameRate);
				var hmst = qeClip.duration.split(':');
				endTime += hmst[0] * 60 * 60; // hour
				endTime += hmst[1] * 60;	  // minute
				endTime += hmst[2] * 1;		  // second
				trackCountToAdd = parseInt(endTime / param.interval) - videoTracks.numTracks;
			} else {
				trackCountToAdd = param.injectCount - videoTracks.numTracks;
			}

			// Add a track using the qe object
			var activeQeSeq = qe.project.getActiveSequence();
			for (var i = 0; i < trackCountToAdd; i++) {
				// 1 audio track, 1 video track
				activeQeSeq.addTracks(1);
			}

			// Find and inject the same clip as qeclip
			var clip;
			var projectItemCollection = app.project.rootItem.children;
			for (var i = 0; i < projectItemCollection.numItems; i++) {
				if (projectItemCollection[i].name === qe.source.clip.name) {
					clip = projectItemCollection[i];
				}
			}

			if (clip === undefined) {
				throw new Error('Clip not found');
			}

			var currentTime = param.interval;
			if (param.untilEndOfClip) {
				// injection till the end of the video
				var currentTime = param.interval;
				for (var i = 0; currentTime < endTime; i++) {
					videoTracks[i].insertClip(clip, currentTime);
					currentTime += param.interval;
				}
			} else {
				// Inject as many as the number of injections entered as parameters
				for (var i = 0; i < param.injectCount; i++) {
					videoTracks[i].insertClip(clip, currentTime);
					currentTime += param.interval;
				}
			}

			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	}
}

$._EST_ = {
	testHostTest: function() {
		try {
			var result = $._ES_.testHost();
			alert(decodeURIComponent(result));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	},
	testHostWithParamTest: function() {
		try {
			var result = $._ES_.testHostWithParam({
				name: 'john'
			});
			alert(decodeURIComponent(result));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	},
	startEditTest: function() {
		try {
			var result = $._ES_.startEdit({
				interval: 1,
				injectCount: 0,
				untilEndOfClip: true
			});
			alert(decodeURIComponent(result));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	}
}

// $._EST_.testHostWithParamTest();
// $._EST_.startEditTest();
