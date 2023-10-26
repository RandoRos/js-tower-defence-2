class Enemy {
  constructor(verticalPosition) {
    this.position = {
      x: canvas.width,
      y: verticalPosition,
    };
    this.width = cellSize;
    this.height = cellSize;
    this.speed = Math.random() * 0.2 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;
  }

  update() {
    this.position.x -= this.movement;
  }

  draw() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Orbitron';
    ctx.fillText(
      Math.floor(this.health),
      this.position.x + 15,
      this.position.y + 30
    );
  }
}
