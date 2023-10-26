class Defender {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = cellSize;
    this.height = cellSize;
    this.shooting = false;
    this.health = 100;
    this.projectiles = [];
    this.timer = 0;
  }

  draw() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = 'gold';
    ctx.font = '30px Arial';
    ctx.fillText(Math.floor(this.health), this.position.x + 15, this.position.y + 30);
  }
}
