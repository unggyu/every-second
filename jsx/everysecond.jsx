/*
Adobe Premiere Pro every second script
*/

var start = function(args) {
    var activeSeq = app.project.activeSequence;
    var videoTrack = activeSeq.videoTracks[0];
    var clip = app.project.rootItem.children[0];

    var currentTime = parseFloat(args.interval);
    for (var i = 0; i < args.numberOfClipsToMultiply; i++) {
        activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
        currentTime += args.interval;
    }
}

// test
// start({
//     interval: 0.1,
//     numberOfClipsToMultiply: 10
// });