class Resource {
  constructor(amounts) {
    this.position = {
      x: Math.random() * (canvas.width - cellSize),
      y: Math.floor(Math.random() * 5 + 1) * cellSize + 25,
    };
    this.width = cellSize * 0.6;
    this.height = cellSize * 0.6;
    this.amount = amounts[Math.floor(Math.random() * amounts.length)];
  }

  draw() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    ctx.fillStyle = 'black';
    ctx.font = '20px Orbitron';
    ctx.fillText(this.amount, this.position.x + 15, this.position.y + 25);
  }
}
