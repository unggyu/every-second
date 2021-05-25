/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
#include "./JSON.jsx";

// alert(JSON.stringify(a))

function test_host(obj_string) {
	// alert(obj_string)
	res = JSON.parse(obj_string)
	// alert(res)
	return 'hola from extendscript ' + res.name
}

function invoke_document_worker(pluginData) {
	return pluginData;
}

function start_edit(args) {
	const {
		interval,
		numberOfClipsToMultiply,
		toEndOfTheVideo
	} = JSON.parse(args);

	app.enableQE();

	const activeSeq = app.project.activeSequence;
	const videoTrack = activeSeq.videoTracks[0];
	const clip = app.project.rootItem.children[0];
	const inconsterval = parseFloat(interval);
	const coefficient = 254016000000;

	var currentTime = interval;

	if (args.toEndOfTheVideo) {
		var currentTime = interval;
		var endTime = activeSeq.end / coefficient;
		for (var i = 0; currentTime < endTime; i++) {
			activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
			currentTime += interval;
		}
	}
	else {
		for (var i = 0; i < args.numberOfClipsToMultiply; i++) {
			activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
			currentTime += interval;
		}
	}

	return 'success edit';
}