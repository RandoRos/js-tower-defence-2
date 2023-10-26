const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemiesPosition = [];

let frame = 0;
let gameOver = false;
let numberOfResources = 300;
let enemiesInterval = 600;

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
  for (let i = defenders.length - 1; i >= 0; i--) {
    const defender = defenders[i];
    defender.draw();

    enemies.forEach((enemy) => {
      if (collision(defender, enemy)) {
        enemy.movement = 0;
        defender.health -= 0.2;
      }

      if (defender && defender.health <= 0) {
        defenders.splice(i, 1);
        // i--; // prevent next element getting skiped
        enemy.movement = enemy.speed;
      }
    });
  }
}

function handleGameStatus() {
  ctx.fillStyle = 'gold';
  ctx.font = '30px Orbitron';
  ctx.fillText('Resources: ' + numberOfResources, 20, 55);

  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '90px Orbitron';
    ctx.fillText('GAME OVER', 135, 330);
  }
}

function handleEnemies() {
  enemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();

    if (enemy.position.x < 0) {
      gameOver = true;
    }
  });

  if (frame % enemiesInterval === 0) {
    let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize;
    enemies.push(new Enemy(verticalPosition));
    enemiesPosition.push(verticalPosition);
    if (enemiesInterval > 120) enemiesInterval -= 50;
  }
}

createGrid();

function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, controlBar.width, controlBar.height);
  handleGameGrid();
  handleDefenders();
  handleEnemies();
  handleGameStatus();
  frame++;
  if (!gameOver) requestAnimationFrame(gameloop);
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
