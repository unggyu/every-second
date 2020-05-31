/*
Adobe Premiere Pro every second script
*/

$.scripts = {
    everySecond: function(args) {
        var activeSeq = app.project.activeSequence;
        var videoTrack = activeSeq.videoTracks[0];
        var clip = app.project.rootItem.children[0];
        var interval = parseFloat(args.interval);

        var currentTime = interval;
        for (var i = 0; i < args.numberOfClipsToMultiply; i++) {
            activeSeq.videoTracks[i + 1].insertClip(clip, currentTime);
            currentTime += interval;
        }
    }
}

// test
// $.scripts.everySecond({
//     interval: 0.1,
//     numberOfClipsToMultiply: 10
// });