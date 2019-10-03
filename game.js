/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/

let point = 0;
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.getElementById('playArea').appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 5;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.png";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/hero.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

/** 
 * Setting up our characters.
 * 
 * Note that heroX represents the X position of our hero.
 * heroY represents the Y position.
 * We'll need these values to know where to "draw" the hero.
 * 
 * The same applies to the monster.
 */

let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX;
let monsterY;
randomPlaceMonter();
//--function random place monter
function randomPlaceMonter() {
  monsterX = Math.round(Math.random() * (canvas.width - 20)) + 20;
  monsterY = Math.round(Math.random() * (canvas.height - 20)) + 20;
  console.log(monsterX);
  console.log(monsterY);
}

/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
*/
let keysDown = {};
function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */
//------reset function----
document.getElementById('reset').addEventListener("click", function () {
  startTime = Date.now();
  elapsedTime = SECONDS_PER_ROUND - Math.floor((Date.now() - startTime) / 1000);
  update();
});
//--------------------
let update = function () {
  // Update the time.
  elapsedTime = SECONDS_PER_ROUND - Math.floor((Date.now() - startTime) / 1000);
  // Game over-----------
  let isTimeOver;
  if (elapsedTime < 0) {
    isTimeOver = true;
  }
  if (isTimeOver) {
    elapsedTime = 0;
    console.log("final point",topCoreHistory["Huy"]);
    newTopCore();
    return
    //--------------------
  } else {
    if (38 in keysDown) { // Player is holding up key
      heroY -= 5;
      if (heroY <= -5) {
        heroY = canvas.height + 5;
      }
    }
    if (40 in keysDown) { // Player is holding down key
      heroY += 5;
      if (heroY >= canvas.height + 5) {
        heroY = -5;
      }
    }
    if (37 in keysDown) { // Player is holding left key
      heroX -= 5;
      if (heroX <= -5) {
        heroX = canvas.width + 5;
      }
    }
    if (39 in keysDown) { // Player is holding right key
      heroX += 5;
      if (heroX >= canvas.width + 5) {
        heroX = -5;
      }
    }
  }

  // Check if player and monster collided. Our images
  // are about 32 pixels big.
  if (
    heroX <= (monsterX + 22)
    && monsterX <= (heroX + 22)
    && heroY <= (monsterY + 22)
    && monsterY <= (heroY + 22)
  ) {
    // Pick a new location for the monster.
    // Note: Change this to place the monster at a new, random location.
    randomPlaceMonter();
    point += 1;
    //---count point-----
    document.getElementById('yourPoint').innerHTML = point;
  }
};

/**
 * This function, render, runs as often as possible.
 */
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  ctx.fillText(`Seconds Remaining: ${elapsedTime}`, 20, 100);
};

/**
 * The main game loop. Most every game will have two distinct parts:
 * update (updates the state of the game, in this case our hero and monster)
 * render (based on the state of our game, draw the right things)
 */
var main = function () {
  update();
  render();
  // Request to do this again ASAP. This is a special method
  // for web browsers. 
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages();
setupKeyboardListeners();
main();
// count time-------------
// let time;
// function startCountTime(){
//   time = 0;
//   myTime = setInterval(timeRun,1000);
// }
// function timeRun(){
//   time += 1;
//   console.log(time);
// }
//------------TopCore----
let topCoreHistory = JSON.parse(localStorage.getItem("top"));
document.getElementById('topCore').innerHTML = topCoreHistory["Huy"];
function newTopCore() {
  if (point > topCoreHistory["Huy"]) {
    topCoreHistory["Huy"] = point;
    document.getElementById('topCore').innerHTML = topCoreHistory["Huy"];
    console.log(topCoreHistory);
    localStorage.setItem("top", JSON.stringify(topCoreHistory));
  }
}
