function test_host() {
	return 'test_host result';
}

function test_host_with_args(obj_string) {
	res = JSON.parse(obj_string)
	return 'hola from extendscript ' + res.name
}

function invoke_document_worker(pluginData) {
	return pluginData;
}

function start_edit(args) {
	var parsedArgs = JSON.parse(args);

	app.enableQE();

	var activeSeq = app.project.activeSequence;
	var videoTrack = activeSeq.videoTracks[0];
	var clip = app.project.rootItem.children[0];
	var inconsterval = parseFloat(parsedArgs.interval);
	var coefficient = 254016000000;

	var currentTime = parsedArgs.interval;

	if (parsedArgs.toEndOfTheVideo) {
		var currentTime = parsedArgs.interval;
		var endTime = activeSeq.end / coefficient;
		for (var i = 0; currentTime < endTime; i++) {
			activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
			currentTime += interval;
		}
	} else {
		for (var i = 0; i < parsedArgs.numberOfClipsToMultiply; i++) {
			activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
			currentTime += interval;
		}
	}

	return {
		result: 'success'
	};
}