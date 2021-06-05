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
	alert: function(param) {
		var payload = {};

		try {
			if (typeof param === 'string') {
				param = parse(param);
			}
			app.setSDKEventMessage(param.message, param.decorator);
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	getClip: function(name) {
		var payload = {};

		try {
			var clip = $._ES_.getClipInternal(name);
			if (clip === undefined) {
				throw new Error('\'' + name + '\' clip not found');
			} else {
				payload.result = clip;
			}
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	getClipInternal: function(name) {
		var clip;
		var clipCollection = app.project.rootItem.children;
		for (var i = 0; i < clipCollection.numItems; i++) {
			if (clipCollection[i].name === name) {
				clip = clipCollection[i];
			}
		}

		return clip;
	},
	isClipSelected: function() {
		var payload = {};

		try {
			payload.result = $._ES_.isClipSelectedInternal();
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	isClipSelectedInternal: function() {
		var isClipSelected;
		app.enableQE();
		if (qe.source.clip.name === '' &&
			qe.source.clip.duration === '' &&
			qe.source.clip.filePath === '') {
			isClipSelected = false;
		} else {
			isClipSelected = true;
		}
		return isClipSelected;
	},
	getSelectedClip: function() {
		var payload = {};

		try {
			app.enableQE();
			var name = qe.source.clip.name;
			var clip = $._ES_.getClipInternal(name);
			payload.result = clip;
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	getSelectedClipInternal: function() {
		app.enableQE();
		var name = qe.source.clip.name;
		return $._ES_.getClipInternal(name);
	},
	isEditable: function() {
		var payload = {};

		try {
			app.enableQE();
			var isClipSelected;
			var isActiveSequenceExists;
			var isTrackEmpty = true;

			// Check if source has clip
			isClipSelected = $._ES_.isClipSelectedInternal();

			// Check if there is an active sequence
			var seq = app.project.activeSequence;
			if (seq !== null) {
				isActiveSequenceExists = true;
			} else {
				isActiveSequenceExists = false;
			}

			if (isActiveSequenceExists) {
				var maxTracksNum;
				if (seq.videoTracks.numTracks > seq.audioTracks.numTracks) {
					maxTracksNum = seq.videoTracks.numTracks;
				} else {
					maxTracksNum = seq.audioTracks.numTracks;
				}

				for (var i = 0; i < maxTracksNum; i++) {
					var videoTrack = seq.videoTracks[i];
					var audioTrack = seq.audioTracks[i];
					if (videoTrack !== null && videoTrack.clips.numItems !== 0) {
						isTrackEmpty = false;
						break;
					}
					if (audioTrack !== null && audioTrack.clips.numItems !== 0 ) {
						isTrackEmpty = false;
						break;	
					}
				}
			}

			payload.result = {};
			payload.result.isEditable = isClipSelected && isActiveSequenceExists && isTrackEmpty;
			if (!payload.result.isEditable) {
				if (!isClipSelected) {
					payload.result.reason = 'No clip selected';
				} else if (!isActiveSequenceExists) {
					payload.result.reason = 'No sequence active';
				} else if (!isTrackEmpty) {
					payload.result.reason = 'Track not empty';
				}
			}
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
			var videoTracks = app.project.activeSequence.videoTracks;
			var qeClip = qe.source.clip;
			// Find and inject the same clip as qeclip
			var clip = $._ES_.getClipInternal(qeClip.name);
			if (!clip) {
				throw new Error('Clip not found');
			}

			// Finding the number of tracks needed to inject a clip
			var endMilliseconds, trackCountToAdd;
			if (param.untilEndOfClip) {
				var outPoint = clip.getOutPoint();
				endMilliseconds = outPoint.seconds * 1000;
				trackCountToAdd = Math.ceil(endMilliseconds / param.interval) - videoTracks.numTracks;
			} else {
				trackCountToAdd = param.injectCount - videoTracks.numTracks;
			}

			// Add a track using the qe object
			var activeQeSeq = qe.project.getActiveSequence();
			for (var i = 0; i < trackCountToAdd; i++) {
				// 1 audio track, 1 video track
				activeQeSeq.addTracks(1);
			}

			var currentMilliseconds = 0;
			if (param.untilEndOfClip) {
				// injection till the end of the video
				for (var i = 0; currentMilliseconds < endMilliseconds; i++) {
					if (param.trimEnd && currentMilliseconds !== 0) {
						var outPoint = clip.getOutPoint();
						outPoint.seconds -= param.interval / 1000;
						clip.setOutPoint(outPoint, 4);
					}
					videoTracks[i].insertClip(clip, currentMilliseconds / 1000);
					currentMilliseconds += param.interval;
				}
			} else {
				// Inject as many as the number of injections entered as parameters
				for (var i = 0; i < param.injectCount; i++) {
					if (param.trimEnd && currentMilliseconds !== 0) {
						var outPoint = clip.getOutPoint();
						outPoint.seconds -= param.interval / 1000;
						clip.setOutPoint(outPoint, 4);
					}
					videoTracks[i].insertClip(clip, currentMilliseconds / 1000);
					currentMilliseconds += param.interval;
				}
			}
			clip.clearOutPoint();
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
	isClipSelectedInternalTest: function() {
		try {
			var isSelected = $._ES_.isClipSelectedInternal();
			alert(isSelected.toString());
		} catch (err) {
			alert(JSON.stringify(err));
		}
	},
	getClipInternalTest: function() {
		try {
			var result = $._ES_.getClipInternal('Shia LaBeouf  Just Do It  Motivational Speech (Original Video by LaBeouf, Rönkkö & Turner).mp4');
			alert(JSON.stringify(result.name));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	},
	getSelectedClipInternal: function() {
		try {
			var result = $._ES_.getSelectedClipInternal();
			alert(JSON.stringify(result.name));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	},
	isEditableTest: function() {
		try {
			var result = $._ES_.isEditable();
			alert(decodeURIComponent(result));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	},
	startEditTest: function() {
		try {
			var result = $._ES_.startEdit({
				interval: 3000,
				injectCount: 10,
				untilEndOfClip: true,
				trimEnd: true
			});
			alert(decodeURIComponent(result));
		} catch (err) {
			alert(JSON.stringify(err));
		}
	}
}

// $._EST_.testHostWithParamTest();
// $._EST_.getClipInternalTest();
// $._EST_.isClipSelectedInternalTest();
// $._EST_.getSelectedClipInternal();
// $._EST_.isEditableTest();
// $._EST_.startEditTest();
