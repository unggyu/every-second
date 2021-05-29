$._ES_ = {
	test_host: function() {
		var payload = {};

		try {
			payload.status = 'success';
			payload.result.data = 'test_host result';
		} catch (err) {
			payload.status = 'failure';
			payload.error = err;
		}

		return encodeURIComponent(JSON.stringify(payload));
	},
	test_host_with_args: function(paramsStr) {
		var payload = {};
		
		try {
			payload.status = 'success';
			payload.result.parameters = decodeURIComponent(paramsStr);
			payload.result.data = 'hola from extendscript ' + JSON.parse(payload.result.parameters).name;
		} catch (err) {
			payload.status = 'failure';
			payload.error = err;
		}

		return encodeURIComponent(JSON.stringify(payload));
	},
	start_edit: function(paramsStr) {
		var payload = {};

		try {
			var parsedParams = JSON.parse(decodeURIComponent(paramsStr));

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

			payload.status = 'success';
		} catch (err) {
			payload.status = 'failure';
			payload.error = err;
		}

		return encodeURIComponent(JSON.stringify(payload));
	}
}