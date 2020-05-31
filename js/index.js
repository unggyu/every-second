var csInterface = new CSInterface();

var params = {
    interval: 1,
    numberOfClipsToMultiply: 1,
    toEndOfTheVideo: false
}

function start(event) {
    var intervalInput = document.getElementById('interval-input');
    params.interval = intervalInput.value;
    var numberOfClipsToMultiplyInput = document.getElementById('number-of-clips-to-multiply-input');
    params.numberOfClipsToMultiply = numberOfClipsToMultiplyInput.value;
    
    csInterface.evalScript('$.scripts.everySecond(' + JSON.stringify(params) + ')');
}

function toEndOfTheVideoCheckboxChanged(event) {
    var toEndOfTheVideoCheckbox = document.getElementById('to-end-of-the-video-checkbox');
    var numberOfClipsToMultiplyInput = document.getElementById('number-of-clips-to-multiply-input');

    if (toEndOfTheVideoCheckbox.checked) {
        numberOfClipsToMultiplyInput.readOnly = true;
        params.toEndOfTheVideo = true;
    }
    else {
        numberOfClipsToMultiplyInput.readOnly = false;
        params.toEndOfTheVideo = false;
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    var startButton = document.getElementById('start-button');
    startButton.addEventListener('click', start);
    var toEndOfTheVideoCheckbox = document.getElementById('to-end-of-the-video-checkbox');
    toEndOfTheVideoCheckbox.addEventListener('change', toEndOfTheVideoCheckboxChanged);
});