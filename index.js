const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];

// mouse
const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
};

let canvasPosition = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', (event) => {
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseleave', () => {
  mouse.x = undefined;
  mouse.y = undefined;
});

const controlBar = {
  width: canvas.width,
  height: cellSize,
};

function createGrid() {
  for (let y = cellSize; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      gameGrid.push(
        new Cell({
          position: {
            x,
            y,
          },
        })
      );
    }
  }
}

function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
}

createGrid();

function gameloop() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, controlBar.width, controlBar.height);
  handleGameGrid();
  requestAnimationFrame(gameloop);
}

gameloop();
