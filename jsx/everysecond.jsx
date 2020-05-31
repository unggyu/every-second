/*
Adobe Premiere Pro every second script
*/

$.scripts = {
    everySecond: function(args) {
        app.enableQE();

        var activeSeq = app.project.activeSequence;
        var videoTrack = activeSeq.videoTracks[0];
        var clip = app.project.rootItem.children[0];
        var interval = parseFloat(args.interval);
        const coefficient = 254016000000

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
    }
}

// test
$.scripts.everySecond({
    interval: 0.1,
    numberOfClipsToMultiply: 10,
    toEndOfTheVideo: true
});