
var context;
var bufferLoader;
var stepBuffer;
var leftPanner, rightPanner;
var listener;

var mainLoop = MainLoop.setUpdate(update).setDraw(draw);

var canvas = document.getElementById('canvas'),
    canvasContext = canvas.getContext('2d');

function update(delta) {


}

function draw(interpolationPercentage) {
  context.clearRect(0, 0, canvas.width, canvas.height);

}

function init() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  listener = context.listener;
  listener.setOrientation(0,0,-1,0,1,0);

  leftPanner = context.createPanner()
  leftPanner.panningModel = "HRTF"
  // Set the 3D position (x, y, z).
  leftPanner.setPosition(5, 2, -1)
  // Connect the "panner" object to the "destination" object.
  leftPanner.connect(context.destination)

  rightPanner = context.createPanner()
  rightPanner.panningModel = "HRTF"
  // Set the 3D position (x, y, z).
  rightPanner.setPosition(-5, 2, -1)
  // Connect the "panner" object to the "destination" object.
  rightPanner.connect(context.destination)

  bufferLoader = new BufferLoader(
    context,
    [
      '166509__yoyodaman234__concrete-footstep-1.wav',
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList) {

  stepBuffer = bufferList[0];

  mainLoop.start();

  var side = false;
  setInterval(function() {
    side = !side;

    var pann;
    if(side) {
      pann = leftPanner;
    } else {
      pann = rightPanner;
    }

    step(pann);
  }, 1000);
}



function step(panner) {

  var buffer = context.createBufferSource();
  buffer.buffer = stepBuffer;
  buffer.connect(panner);
  buffer.start();
}

window.addEventListener('load', init, false);
