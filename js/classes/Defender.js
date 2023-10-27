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
    ctx.font = '30px Orbitron';
    ctx.fillText(
      Math.floor(this.health),
      this.position.x + 15,
      this.position.y + 30
    );
  }

  update() {
    if (this.shooting) {
      this.timer++;
      if (this.timer % 100 === 0) {
        projectiles.push(
          new Projectile({
            position: {
              x: this.position.x + 70,
              y: this.position.y + 50,
            },
          })
        );
      }
    } else {
      this.timer = 0;
    }
  }
}
