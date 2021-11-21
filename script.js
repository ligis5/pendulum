const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const body = document.getElementById("body");
import Pendulum from "./pendulum.js";

// in physics g is gravitational force on planet.
let g = 1;
if (canvas.getContext) {
  canvas.width = body.clientWidth;
  canvas.height = body.clientHeight;
  // canvas context, start of line X, start of line Y, lineLength, mass
  const pend = new Pendulum(
    context,
    canvas.width / 2,
    canvas.height / 3,
    canvas.height / 4,
    10
  );
  // canvas context, start of line X, start of line Y, lineLength, mass
  const pend2 = new Pendulum(
    context,
    pend.ballPos.x * 2,
    pend.ballPos.y,
    canvas.height / 4,
    10
  );
  window.addEventListener("resize", () => {
    canvas.width = body.clientWidth;
    canvas.height = body.clientHeight;

    let difx = canvas.width / pend.ballPos.x;
    let dify = canvas.height / pend.ballPos.y;
    pend.ballPos = { x: canvas.width / difx, y: canvas.height / dify };
    pend.linePos.x = canvas.width / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  let time = 0;
  let fps = 5;
  let now;
  let then = Date.now();
  let delta;

  let arrayOfPendulums = [];
  const draw = () => {
    let interval = 1000 / fps;

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      time += 1;
      then = now - (delta % interval);
      if (time >= 10) {
        // canvas context, start of line X, start of line Y, lineLength, mass, color
        let p = new Pendulum(
          context,
          canvas.width / 2,
          canvas.height / 3,
          canvas.height / 4,
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
          canvas.height / 4,
          10,
          `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
            Math.random() * 255
          })`
        );
        arrayOfPendulums.push([p, p2]);
        time = 0;
      }
    }
    context.clearRect(0, 0, canvas.width, canvas.height);

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

    pend.move(firstObjForce(pend, pend2));

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

    pend2.linePos = pend.ballPos;
    pend2.move(secondObjForce(pend, pend2));

    for (let i = 0; i < arrayOfPendulums.length; i++) {
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
      arrayOfPendulums[i][1].linePos = arrayOfPendulums[i][0].ballPos;

      if (ballArea(arrayOfPendulums[i][1], pend2)) {
        arrayOfPendulums.splice(i, 1);
      }
    }

    window.requestAnimationFrame(draw);
  };
  window.requestAnimationFrame(draw);
}
