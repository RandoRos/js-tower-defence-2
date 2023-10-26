class Cell {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = cellSize;
    this.height = cellSize;
  }

  draw() {
    ctx.strokeStyle = 'black';
    ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
  }
}
