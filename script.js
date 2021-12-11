const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const body = document.getElementById("body");
import Pendulum from "./pendulum.js";

if (canvas.getContext) {
  canvas.width = body.clientWidth;
  canvas.height = body.clientHeight;
  // in physics g is gravitational force on planet.
  let g = 1;
  let length =
    (canvas.width + canvas.height) / 10 > 100
      ? (canvas.width + canvas.height) / 10
      : 100;
  // canvas context, start of line X, start of line Y, lineLength, mass
  const pend = new Pendulum(
    context,
    canvas.width / 2,
    canvas.height / 3,
    length,
    1
  );
  // canvas context, start of line X, start of line Y, lineLength, mass
  const pend2 = new Pendulum(
    context,
    pend.ballPos.x,
    pend.ballPos.y,
    length,
    1
  );
// adjust line length, change gravity based on length, divide width by current position,
// then change canvas size based on current body element size and get new obejcts position by dividing
// current canvas size with old value that was given when dividing old width by current position.
  const adjustToScreenSize = (p, p2) => {
    length =
    (canvas.width + canvas.height) / 10 > 100
      ? (canvas.width + canvas.height) / 10
      : 100;
    g = length / 300;
    let difx = canvas.width / p.ballPos.x;
    let dify = canvas.height / p.ballPos.y;
    let difx2 = canvas.width / p2.ballPos.x;
    let dify2 = canvas.height / p2.ballPos.y;
    canvas.width = body.clientWidth;
    canvas.height = body.clientHeight
    p.length = length;
    p2.length = length;
    p.ballPos = { x: canvas.width / difx, y: canvas.height / dify };
    p.linePos.x = canvas.width / 2;
    p.linePos.y = canvas.height / 3;
    
    p2.ballPos = { x: canvas.width / difx2, y: canvas.height / dify2 };
    p2.linePos = p.ballPos;
    
  };

  const { sin, cos } = Math;
  const firstObjForce = (obj1, obj2) => {
    let num1 = -g * (2 * obj1.mass + obj2.mass) * sin(obj1.angle);
    let num2 = -obj2.mass * g * sin(obj1.angle - 2 * obj2.angle);
    let num3 = -2 * sin(obj1.angle - obj2.angle) * obj2.mass;
    let num4 =
      obj2.vel * obj2.vel * obj2.length +
      obj1.vel * obj1.vel * obj1.length * cos(obj1.angle - obj2.angle);
    let den =
      obj1.length *
      (2 * obj1.mass +
        obj2.mass -
        obj2.mass * cos(2 * obj1.angle - 2 * obj2.angle));
    return (num1 + num2 + num3 * num4) / den;
  };

  const secondObjForce = (obj1, obj2) => {
    let num1 = 2 * sin(obj1.angle - obj2.angle);
    let num2 = obj1.vel * obj1.vel * obj1.length * (obj1.mass + obj2.mass);
    let num3 = g * (obj1.mass + obj2.mass) * cos(obj1.angle);
    let num4 =
      obj2.vel *
      obj2.vel *
      obj2.length *
      obj2.mass *
      cos(obj1.angle - obj2.angle);
    let den =
      obj2.length *
      (2 * obj1.mass +
        obj2.mass -
        obj2.mass * cos(2 * obj1.angle - 2 * obj2.angle));
    return (num1 * (num2 + num3 + num4)) / den;
  };

  let time = 0;
  let fps = 60;
  let now;
  let then = Date.now();
  let delta;

  let arrayOfPendulums = [];

  // looping code
  const draw = () => {
    let pendulumsToResize = [[pend, pend2],...arrayOfPendulums]
    let interval = 1000 / fps;
    window.requestAnimationFrame(draw);
    now = Date.now();
    delta = now - then;
    // When time reaches 10 creates new pendulum.New pendulum is pushed into pendulums array.
    if (delta > interval) {
      time += 1;
      then = now - (delta % interval);
      // canvas and will adjust to screen size.
      for(let i = 0; i < pendulumsToResize.length; i++){
        adjustToScreenSize(pendulumsToResize[i][0], pendulumsToResize[i][1])
      }
      pend.move(firstObjForce(pend, pend2));
      pend2.move(secondObjForce(pend, pend2));
      
// Calculates every bottom pendulum balls distance to original black pendulum.
// If distance is less then 20 that colored pendulum gets removed, original always remain.
      for (let i = 0; i < arrayOfPendulums.length; i++) {
        //checks distance between main pendulum and new ones.
        const ballArea = (ball, ball2) => {
          let bool = false;
          let distance = Math.sqrt(
            Math.pow(ball.ballPos.x - ball2.ballPos.x, 2) +
              Math.pow(ball.ballPos.y - ball2.ballPos.y, 2)
          );

          if (distance <= 20) {
            bool = true;
          } else bool = false;
          return bool;
        };
        
        arrayOfPendulums[i][0].move(
          firstObjForce(arrayOfPendulums[i][0], arrayOfPendulums[i][1])
        );
        arrayOfPendulums[i][1].move(
          secondObjForce(arrayOfPendulums[i][0], arrayOfPendulums[i][1])
        );
        // if ballArea returns true this pendulum is removed
        if (ballArea(arrayOfPendulums[i][1], pend2)) {
          arrayOfPendulums.splice(i, 1);
        }
      }

      // every 120 of time and if there is less then 15 pendulums new one will be created and added to pendulums array.
      if (time >= 120 && arrayOfPendulums.length < 15) {
        // canvas context, start of line X, start of line Y, lineLength, mass, color
        let p = new Pendulum(
          context,
          pend.linePos.x,
          pend.linePos.y,
          length,
          10,
          `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          })`
        );
        // canvas context, start of line X, start of line Y, lineLength, mass,color
        let p2 = new Pendulum(
          context,
          p.ballPos.x,
          p.ballPos.y,
          length,
          10,
          `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          })`
        );
        arrayOfPendulums.push([p, p2]);
        time = 0;
      }
    }
  };
  window.requestAnimationFrame(draw);
}
