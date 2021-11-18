const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const body = document.getElementById("body");
import Pendulum from "./pendulum.js";

// in physics g is gravitational force on planet.
let g = 1;
if (canvas.getContext) {
  canvas.width = body.clientWidth;
  canvas.height = body.clientHeight;
  // canvas context, width, start of line, height, lineLength, mass
  const pend = new Pendulum(
    context,
    canvas.width,
    0,
    canvas.height,
    canvas.height / 4,
    10
  );
  // canvas context, width, start of line, height, lineLength, mass
  const pend2 = new Pendulum(
    context,
    pend.ballPos.x * 2,
    pend.ballPos.y,
    canvas.height,
    canvas.height / 10,
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
  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const { sin, cos } = Math;

    let num1 = -g * (2 * pend.mass + pend2.mass) * sin(pend.angle);
    let num2 = -pend2.mass * g * sin(pend.angle - 2 * pend2.angle);
    let num3 = -2 * sin(pend.angle - pend2.angle) * pend2.mass;
    let num4 =
      pend2.vel * pend2.vel * pend2.length +
      pend.vel * pend.vel * pend.length * cos(pend.angle - pend2.angle);
    let den =
      pend.length *
      (2 * pend.mass +
        pend2.mass -
        pend2.mass * cos(2 * pend.angle - 2 * pend2.angle));

    pend.move((num1 + num2 + num3 * num4) / den);

    num1 = 2 * sin(pend.angle - pend2.angle);
    num2 = pend.vel * pend.vel * pend.length * (pend.mass + pend2.mass);
    num3 = g * (pend.mass + pend2.mass) * cos(pend.angle);
    num4 =
      pend2.vel *
      pend2.vel *
      pend2.length *
      pend2.mass *
      cos(pend.angle - pend2.angle);
    den =
      pend2.length *
      (2 * pend.mass +
        pend2.mass -
        pend2.mass * cos(2 * pend.angle - 2 * pend2.angle));

    pend2.linePos = pend.ballPos;
    pend2.move((num1 * (num2 + num3 + num4)) / den);

    window.requestAnimationFrame(draw);
  };
  window.requestAnimationFrame(draw);
}
