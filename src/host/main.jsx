$._ES_ = {
	test_host: function() {
		return 'test_host result';
	},
	test_host_with_args: function(paramsStr) {
		res = JSON.parse(decodeURIComponent(paramsStr));
		return 'hola from extendscript ' + res.name;
	},
	start_edit: function(paramsStr) {
		var payload = {};
		try {
			var parsedParams = JSON.parse(decodeURIComponent(paramsStr));

			app.enableQE();

			var activeSeq = app.project.activeSequence;
			var videoTrack = activeSeq.videoTracks[0];
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

			payload.result = 'success';
		} catch (err) {
			payload.result = 'failure';
			payload.error = err;
		}

		return encodeURIComponent(JSON.stringify(payload));
	}
}