var SUCCESS = 'success';
var FAILURE = 'failure';
var TIME_COEFFICIENT = 254016000000;

function parse(json) {
	return JSON.parse(decodeURIComponent(json));
}

function stringify(obj) {
	return encodeURIComponent(JSON.stringify(obj));
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
	testHostWithParam: function(paramStr) {
		var payload = {};
		
		try {
			var parameter = decodeURIComponent(paramStr);
			var parameterObj = JSON.parse(parameter);
			payload.result = {};
			payload.result.parameter = parameter;
			payload.result.data = 'hola from extendscript ' + parameterObj.name;
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
	startEdit: function(paramStr) {
		var payload = {};

		try {
			var parsedParam = parse(paramStr);
			var activeSeq = app.project.activeSequence;
			var clip = app.project.rootItem.children[0];
			var currentTime = parsedParam.interval;
			
			var endTime;
			var trackCountToAdd;
			if (parsedParam.toEndOftheVideo) {
				endTime = activeSeq.end / TIME_COEFFICIENT;
				trackCountToAdd = parseInt(endTime / parsedParam.interval) - activeSeq.videoTracks.numTracks;
			} else {
				trackCountToAdd = parsedParam.clipsToMultipy - activeSeq.videoTracks.numTracks;
			}

			for (var i = 0; i < trackCountToAdd; i++) {
				app.enableQE();
				var activeQeSeq = qe.project.getActiveSequence();
				// 1 audio track, 1 video track
				activeQeSeq.addTracks(1);
			}

			if (parsedParam.toEndOfTheVideo) {
				var currentTime = parsedParam.interval;
				var videoTracks = activeSeq.videoTracks;
				for (var i = 0; currentTime < endTime; i++) {
					videoTracks[i + 1].insertClip(clip, currentTime);
					currentTime += parsedParam.interval;
				}
			} else {
				for (var i = 0; i < parsedParam.numberOfClipsToMultiply; i++) {
					videoTracks[i + 1].insertClip(clip, currentTime);
					currentTime += parsedParam.interval;
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