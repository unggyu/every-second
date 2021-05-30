var SUCCESS = 'success';
var FAILURE = 'failure';

function parse(json) {
	return JSON.parse(decoideURIComponent(json));
}

function stringify(obj) {
	return encodeURIComponent(JSON.stringify(obj));
}

$._ES_ = {
	testHost: function() {
		var payload = {};

		try {
			payload.result = {};
			payload.result.data = 'testHost result';
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	testHostWithParams: function(paramStr) {
		var payload = {};
		
		try {
			payload.reuslt = {};
			payload.result.parameters = decodeURIComponent(paramStr);
			payload.result.data = 'hola from extendscript ' + JSON.parse(payload.result.parameters).name;
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
			payload.error = err;
		}

		return stringify(payload);
	},
	getProjectItems: function() {
		var payload = {};

		try {
			app.enableQE();
			payload.result = app.project.rootItem.children;
			payload.status = SUCCESS;
		} catch (err) {
			payload.status = FAILURE;
		}

		return stringify(payload);
	},
	startEdit: function(paramStr) {
		var payload = {};

		try {
			var parsedParams = parse(paramStr);

			app.enableQE();

			var activeSeq = app.project.activeSequence;
			var clip = app.project.rootItem.children[0];
			var inconsterval = parseFloat(parsedParams.interval);
			var coefficient = 254016000000;

			var currentTime = parsedParams.interval;

			if (parsedParams.toEndOfTheVideo) {
				var currentTime = parsedParams.interval;
				var endTime = activeSeq.end / coefficient;
				for (var i = 0; currentTime < endTime; i++) {
					activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
					currentTime += parsedParams.interval;
				}
			} else {
				for (var i = 0; i < parsedParams.numberOfClipsToMultiply; i++) {
					activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
					currentTime += parsedParams.interval;
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