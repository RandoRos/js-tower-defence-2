class Projectile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 5;
  }

  update() {
    this.position.x += this.speed;
  }

  draw() {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.width, 0, Math.PI * 2);
    ctx.fill();
  }
}
