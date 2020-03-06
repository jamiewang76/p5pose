// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with poseNet. Built with p5.js
=== */
let video;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let poseNet;
let poses = [];
let decideA = true;
let decideB = true;
let decideC = true;
let classificationResult = "";
let a=[];
let allowedToPredict = false;
var delayInMilliseconds = 4000;
let housegif;
//var delayInTwoMilliseconds = 6000;
const numLabels = knnClassifier.getNumLabels();
var phase = "record";
var number = 0;
// function preload() {
//   holdimg = loadImage('img/hold.jpg');
//   housegif = createImg("img/house.gif");
// }
function setup() {
  // const canvas = createCanvas(window.innerWidth, window.innerHeight);
  //canvas.parent('videoContainer');
  // video = createCapture(VIDEO);
  //
  // video.size(width, height);
  housegif = loadImage("img/house.gif");
  // housegif.elt.className = "housegif";
//request videos
  house = createVideo(['vid/house.m4v']);
  house.elt.className = "house";
  countdown = createVideo(['vid/countdown.m4v']);
  countdown.elt.className = "countdown";
  good = createVideo(['vid/good.m4v']);
  good.elt.className = "good";
  bird = createVideo(['vid/bird.m4v']);
  bird.elt.className = "bird";
  countdown2 = createVideo(['vid/countdown2.m4v']);
  countdown2.elt.className = "countdown2";
  perfect = createVideo(['vid/perfect.m4v']);
  perfect.elt.className = "perfect";
  river = createVideo(['vid/river.m4v']);
  river.elt.className = "river";
  countdown3 = createVideo(['vid/countdown3.m4v']);
  countdown3.elt.className = "countdown3";
const canvas = createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO);

  video.size(width, height);
  // Create the UI buttons
  //createButtons();

  // for (i = 0;i<12;i++){
  //   a[i]=new Button();
  //   //a[i].input();
  // }
  initiate = new Button();
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();

  buttonStart = createButton("Start!");
  buttonA = createButton('First');
  buttonB = createButton('Second');
  buttonC = createButton('Third');
  buttonD = createButton('Predict!');

  buttonStart.mousePressed(buttonStartPressed);
  buttonA.mousePressed(buttonAPressed);
  buttonB.mousePressed(buttonBPressed);
  buttonC.mousePressed(buttonCPressed);
  buttonD.mousePressed(buttonDPressed);
}

function draw() {
  //image(video, 0, 0, width, height);

  if(phase == "record"){
    //console.log(Button);
    initiate.input();
  }else if(phase == "create"){
    //alert("create!")
    //console.log(allowedToPredict);
    if (poses.length>0 && allowedToPredict) {
      //console.log("classify!");
      classify();
      initiate.output();
      if(classificationResult!="A" && classificationResult!="B" && classificationResult!="C"){
        buttonDPressed();
      }else{
        allowedToPredict = false;
      }
    }
  }
  // We can call both functions to draw all keypoints and the skeletons
  //drawKeypoints();
  //drawSkeleton();

  fill(0,255,0);
  textSize(64);

}

function modelReady(){
  select('#status').html('model Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  //if (poses[0]!=undefined){
    const poseArray = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);
    console.log(poses);
    // Add an example with a label to the classifier
    knnClassifier.addExample(poseArray, label);
    //console.log(poseArray);
    updateCounts();
  //}
  // Convert poses results to a 2d array [[score0, x0, y0],...,[score16, x16, y16]]
  // const poseArray = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);
  //
  // // Add an example with a label to the classifier
  // knnClassifier.addExample(poseArray, label);
  // updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  // Convert poses results to a 2d array [[score0, x0, y0],...,[score16, x16, y16]]
  const poseArray = poses[0].pose.keypoints.map(p => [p.score, p.position.x, p.position.y]);

  // Use knnClassifier to classify which label do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(poseArray, gotResults);

   //allowedToPredict = false;
}



// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    console.log("TEST");
    // console.log(confidences['A']);
    // console.log(confidences['B']);
    // console.log(confidences['C']);

    select('#confidenceA').html( "0 %" );
    select('#confidenceB').html( "0 %" );
    select('#confidenceC').html( "0 %" );

    // result.label is the label that has the highest confidence
    if (result.label) {
      classificationResult = result.label;
      //select('#result').html(result.label);
      let idName = "#confidence"+result.label;
      //select('#confidence').html(`${confidences[result.label] * 100} %`);
      select(idName).html(`${confidences[result.label]*100} %`);
    }

    // select('#confidenceA').html(`${confidences['A'] ? confidences['A'] * 100 : 0} %`);
    // select('#confidenceB').html(`${confidences['B'] ? confidences['B'] * 100 : 0} %`);
    // select('#confidenceC').html(`${confidences['C'] ? confidences['C'] * 100 : 0} %`);
  }

 if (poses.length>0) {
   classify();
   // setTimeout(function(){
   //   classify()
   // },delayInMilliseconds)
 }
}

// Update the example count for each label
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();
  //console.log(counts['A']);


  if(counts['A']==12 && decideA){
    decideA = false;
    countdown.remove();
    good.play();
    good.onended(middle1);
  }else if(counts['B']==12 && decideB){
    decideB = false;
    countdown2.remove();
    perfect.play();
    perfect.onended(middle2);
  }else if(counts['C']==12 && decideC){
    decideC = false;
    countdown3.remove();
    console.log("all recorded!");
  }
  select('#exampleA').html(counts['A'] || 0);
  select('#exampleB').html(counts['B'] || 0);
  select('#exampleC').html(counts['C'] || 0);;
}

// Clear the examples in one label
// function clearLabel(classLabel) {
//   knnClassifier.clearLabel(classLabel);
//   updateCounts();
// }

// Clear all the examples in all labels
// function clearAllLabels() {
//   knnClassifier.clearAllLabels();
//   updateCounts();
// }


// // Save dataset as myKNNDataset.json
// function saveMyKNN() {
//     knnClassifier.save('myKNN');
// }

// // Load dataset to the classifier
// function loadMyKNN() {
//     knnClassifier.load('./myKNN.json', updateCounts);
// }
function buttonStartPressed(){
  console.log("start!");
  //image(house,0,0);
  house.play();
  house.onended(buttonAPressed);
}
//
function hold(){
image(holdimg,0,0);
}

function buttonAPressed(){
  console.log("buttonA is pressed!");
  house.remove();
  countdown.play();
  //countdown.onended(hold);
  number = number+1;
  select('#addClassA');
// for (let i=0;i<12;i++){
//   addExample('A');
// }
//console.log(phase);
  // addExample('A');
  setTimeout(function() {
    for (let i=0;i<12;i++){

      addExample('A');
    }
   },delayInMilliseconds)
}
function middle1(){
  console.log("Middle 1 start");
  good.remove();
  bird.play();
  bird.onended(buttonBPressed);
}
function buttonBPressed(){
  console.log("buttonB is pressed!");
  bird.remove();
  countdown2.play();
  number = number+1;
  select('#addClassB');
  //addExample('B');
  // for (let i=0;i<12;i++){
  //   addExample('B');
  // }
  //console.log(phase);
  setTimeout(function() {
    for (let i=0;i<12;i++){

      addExample('B');
    }
   },delayInMilliseconds)
}
function middle2(){
  console.log("Middle 2 start");
  perfect.remove();
  river.play();
  river.onended(buttonCPressed);
}
function buttonCPressed(){
  console.log("buttonC is pressed!");
  river.remove();
  countdown3.play();
  number = number+1;
  select('#addClassC');
  //addExample('C');
  // for (let i=0;i<12;i++){
  //   addExample('C');
  // }
  //phase = "create";
  //console.log(phase);
  setTimeout(function() {
    for (let i=0;i<12;i++){
      addExample('C');
    }
   },delayInMilliseconds)

}
function buttonDPressed(){
  setTimeout(function() {
   allowedToPredict = true;
   phase = "create";
 },delayInMilliseconds)
}
class Button{
  input(){
    //if(number!=4){
    for (let i = 0; i < poses.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = poses[i].pose;
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let partname=poses[i].pose.keypoints[j].part;
        let score=poses[i].pose.keypoints[j].score;
        let x=poses[i].pose.keypoints[j].position.x;
        let y=poses[i].pose.keypoints[j].position.y;

        let keypoint = pose.keypoints[j];

          }

        }
      //}else{
        //
      //}
    }
      output(){
  if (classificationResult == "A") {
    allowedToPredict = false;
    console.log("Pose A");
    image(housegif,0,0,200,200);
  //   document.getElementById("housegif").style.display="block";
  // document.getElementById("housegif").style.width="100px";
  }else if (classificationResult == "B") {
allowedToPredict = false;
console.log("Pose B")

  } else if (classificationResult == "C") {
    allowedToPredict = false;
    console.log("Pose C")

  } else {
    console.log("Not identified!")

  }
}
}



// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  //console.log(poses);
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
