var csInterface = new CSInterface();

var params = {
    interval: 1,
    numberOfClipsToMultiply: 0
}

(function initialize() {
    var startButton = document.getElementById('start-button');
    startButton.addEventListener('click', start);
})();

function start() {
    var intervalInput = document.getElementById('interval-input');
    params.interval = intervalInput.value;
    var numberOfClipsToMultiplyInput = document.getElementById('number-of-clips-to-multiply');
    params.numberOfClipsToMultiply = numberOfClipsToMultiplyInput.value;
    
    csInterface.evalScript('start(' + JSON.stringify(params) + ')');
}