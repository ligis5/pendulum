function Pendulum(ctx, x, y, lineLength, mass, color) {
  this.radius = 10;
  this.color = color ? color : "black";
  this.mass = mass;
  this.angle = Math.PI / 4;
  this.linePos = { x: x, y: y };
  let endX = this.linePos.x;
  let endY = this.linePos.y + lineLength;
  this.length = Math.sqrt(
    Math.pow(endX + this.radius - this.linePos.x, 2) +
      Math.pow(endY + this.radius - this.linePos.y, 2)
  );
  this.ballPos = { x: endX, y: endY };

  // function for drawing new pendulum.
  let CreatePendulum = (ballX, ballY) => {
    ctx.beginPath();
    ctx.moveTo(this.linePos.x, this.linePos.y);
    ctx.lineTo(ballX, ballY);
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ballX, ballY, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  };
  CreatePendulum(this.ballPos.x, this.ballPos.y);
  this.acc = 0;
  this.vel = 0;

  // on every frame new pendulum gets drawn on updated position.
  this.move = (f) => {
    this.acc = f;
    this.vel += this.acc;
    this.angle += this.vel;

    this.ballPos.x = this.length * Math.sin(this.angle) + this.linePos.x;
    this.ballPos.y = this.length * Math.cos(this.angle) + this.linePos.y;
    CreatePendulum(this.ballPos.x, this.ballPos.y);
  };
}
export default Pendulum;
