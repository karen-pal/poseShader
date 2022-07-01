const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer,
{
  connectionColor: "rgb(0,255,0)",
    landmarkColor:"rgb(255,0,0)",
    axesColor:0x0,
  range: 2,
  fitToGrid: true,
  landmarkSize: 4,
  numCellsPerAxis: 4,
  showHidden: false,
  centered: true,
    backgroundColor:"rgba(255,255,255,0)",
}

);
//console.log(grid);

function onResults(results) {
  if (!results.poseLandmarks) {
    grid.updateLandmarks([]);
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.segmentationMask, 0, 0,
                      canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';
  //canvasCtx.fillStyle = '#00FF00';
  canvasCtx.drawImage(videoElement,0,0,canvasElement.width, canvasElement.height);

///aver
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
     // Set a rectangle the same size as the image.
    //aver
  //// Only overwrite missing pixels.
  //canvasCtx.globalCompositeOperation = 'destination-atop';
  //canvasCtx.drawImage(
  //    results.image, 0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.globalCompositeOperation = 'source-over';
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                 {color: 'rgb(0,255,0)', lineWidth: 4});
  drawLandmarks(canvasCtx, results.poseLandmarks,
                {color: '#FF0000', lineWidth: 2});
  let right_hand = results.poseLandmarks[16];
  let left_hand = results.poseLandmarks[15];
  let right_shoulder = results.poseLandmarks[12];
  let left_shoulder = results.poseLandmarks[11];
  let nose = results.poseLandmarks[0];

    //console.log(left_hand);
  //uLeft.set(left_hand.x, left_hand.y);
  function getDistance (x1,y1,x2,y2){
    var a = x1 - x2;
    var b = y1 - y2;

    return Math.sqrt( a*a + b*b );

  }
  uMouse.set(right_hand.x*2000, right_hand.y*-2500);
    let distance = Math.abs(Math.abs(right_hand.x)-Math.abs(left_hand.x))
    let hasInfo = (left_hand.x>0 && right_hand.x>0);
    //console.log(distance);
    let rightHandToShoulder = getDistance(right_shoulder.x,right_shoulder.y, right_hand.x, right_hand.y);
    let rightHandToNose = getDistance(nose.x,nose.y, right_hand.x, right_hand.y);
    let leftHandToShoulder =getDistance(left_shoulder.x,left_shoulder.y, left_hand.x, left_hand.y)
    let leftHandToNose =getDistance(nose.x,nose.y, left_hand.x, left_hand.y)
    if ( hasInfo && distance<.03){
        uTouch.set(1.);
        uLeft.set(distance,distance);
        //setTimeout(function() { uTouch.set(0.);console.log("timeout!")}, 2000);
    }
    uHandsShoulders.set(rightHandToShoulder, leftHandToShoulder);
    uHandsNose.set(rightHandToNose, leftHandToNose);
    console.log(rightHandToNose);
    if (hasInfo && distance>.2){
        uTouch.set(0.)
    }
    //else if ((left_hand.x>0 && right_hand.x>0) && distance>.1){
    //    uTouch.set(0.);
    //}
  //console.log(uMouse);
  animate();
  canvasCtx.restore();

  grid.updateLandmarks(results.poseWorldLandmarks);
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
  modelComplexity: 2,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1920,
  height: 1080
});
camera.start();
