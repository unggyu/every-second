var csInterface = new CSInterface();

var params = {
    interval: 1,
    numberOfClipsToMultiply: 1
}

function start(event) {
    var intervalInput = document.getElementById('interval-input');
    params.interval = intervalInput.value;
    var numberOfClipsToMultiplyInput = document.getElementById('number-of-clips-to-multiply-input');
    params.numberOfClipsToMultiply = numberOfClipsToMultiplyInput.value;
    
    csInterface.evalScript('$.scripts.everySecond(' + JSON.stringify(params) + ')');
}

window.addEventListener('DOMContentLoaded', (event) => {
    var startButton = document.getElementById('start-button');
    startButton.addEventListener('click', start);
});