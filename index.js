const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];

let numberOfResources = 300;

// mouse
const mouse = {
  position: {
    x: undefined,
    y: undefined,
  },
  width: 0.1,
  height: 0.1,
};

let canvasPosition = canvas.getBoundingClientRect();

canvas.addEventListener('mousemove', (event) => {
  mouse.position.x = event.x - canvasPosition.left;
  mouse.position.y = event.y - canvasPosition.top;
});

canvas.addEventListener('mouseleave', () => {
  mouse.position.x = undefined;
  mouse.position.y = undefined;
});

canvas.addEventListener('click', () => {
  const gridPositionX = mouse.position.x - (mouse.position.x % cellSize);
  const gridPositionY = mouse.position.y - (mouse.position.y % cellSize);
  if (gridPositionY < cellSize) return;

  for (let i = 0; i < defenders.length; i++) {
    if (
      defenders[i].position.x === gridPositionX &&
      defenders[i].position.y === gridPositionY
    ) {
      return;
    }
  }

  let defenderCost = 100;
  if (numberOfResources >= defenderCost) {
    defenders.push(
      new Defender({
        position: {
          x: gridPositionX,
          y: gridPositionY,
        },
      })
    );
    numberOfResources -= defenderCost;
  }
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
    const cell = gameGrid[i];
    if (mouse.position.x && mouse.position.y && collision(cell, mouse)) {
      cell.draw();
    }
  }
}

function handleDefenders() {
  defenders.forEach((defender) => {
    defender.draw();
  });
}

function handleGameStatus() {
  ctx.fillStyle = 'gold';
  ctx.font = '30px Arial';
  ctx.fillText('Resources: ' + numberOfResources, 20, 55);
}

createGrid();

function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, controlBar.width, controlBar.height);
  handleGameGrid();
  handleDefenders();
  handleGameStatus();
  requestAnimationFrame(gameloop);
}

gameloop();

function collision(first, second) {
  if (
    !(
      first.position.x > second.position.x + second.width ||
      first.position.x + first.width < second.position.x ||
      first.position.y > second.position.y + second.height ||
      first.position.y + first.height < second.position.y
    )
  ) {
    return true;
  }
}
