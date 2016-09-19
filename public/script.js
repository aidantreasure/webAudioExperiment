
var context;
var bufferLoader;
var stepBuffer;
var leftPanner, rightPanner;
var listener;

var mainLoop = MainLoop.setUpdate(update).setDraw(draw);

// var canvas = document.getElementById('canvas'),
//     canvasContext = canvas.getContext('2d');

function AudioEntity(x,y,z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

function AudioPanner(audioEnt, orx, ory, orz) {
  this.audioEntity = audioEnt;
  this.orx = orx;
  this.ory = ory;
  this.orz = orz;
}

var world = [];

world.push(new AudioPanner(new AudioEntity(5, 2, -1), 1, 0, 0));



var scene, camera, renderer;
var geometry, material, mesh;

initDisplay();
//animate();

function initDisplay() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry( 200, 200, 200 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

// function animate() {
//
//     requestAnimationFrame( animate );
//
//     mesh.rotation.x += 0.01;
//     mesh.rotation.y += 0.02;
//
//     renderer.render( scene, camera );
//
// }
//
function update(delta) {
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

}

function draw(interpolationPercentage) {
  //canvasContext.clearRect(0, 0, canvas.width, canvas.height);


  renderer.render( scene, camera );
}
//
function initAudio() {

  // canvas.width = window.innerWidth;
  // canvas.height = window.innerHeight;
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

window.addEventListener('load', initAudio, false);
