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
			app.enableQE();
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
			app.enableQE();
			payload.result = app.project.rootItem.children[index];
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