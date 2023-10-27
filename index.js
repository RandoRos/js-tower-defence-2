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
const projectiles = [];
const resources = [];
const amounts = [20, 30, 40];

const winningScore = 50;
let score = 0;
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
  const gridPositionX =
    mouse.position.x - (mouse.position.x % cellSize) + cellGap;
  const gridPositionY =
    mouse.position.y - (mouse.position.y % cellSize) + cellGap;
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
    defender.update();

    if (enemiesPosition.indexOf(defender.position.y) !== -1) {
      defender.shooting = true;
    } else {
      defender.shooting = false;
    }

    enemies.forEach((enemy) => {
      if (defender && collision(defender, enemy)) {
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
  ctx.fillText('Score: ' + score, 20, 40);
  ctx.fillText('Resources: ' + numberOfResources, 20, 80);

  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '90px Orbitron';
    ctx.fillText('GAME OVER', 135, 330);
  }

  if (score >= winningScore && enemies.length === 0) {
    ctx.fillStyle = 'black';
    ctx.font = '60px Orbitron';
    ctx.fillText('LEVEL COMPLETE', 130, 300);
    ctx.font = '30px Orbitron';
    ctx.fillText(`You win with ${score} points!`, 134, 340);
  }
}

function handleEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();

    if (enemies[i].position.x < 0) {
      gameOver = true;
    }

    if (enemies[i].health <= 0) {
      const gainedResources = enemies[i].maxHealth / 10;
      numberOfResources += gainedResources;
      score += 10;
      enemiesPosition.splice(enemiesPosition.indexOf(enemies[i].position.y), 1);
      enemies.splice(i, 1);
      i--;
    }
  }

  if (frame % enemiesInterval === 0 && score < winningScore) {
    let verticalPosition =
      Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
    enemies.push(new Enemy(verticalPosition));
    enemiesPosition.push(verticalPosition);
    if (enemiesInterval > 120) enemiesInterval -= 50;
  }
}

function handleProjectiles() {
  for (let i = 0; i < projectiles.length; i++) {
    projectiles[i].update();
    projectiles[i].draw();

    for (let j = 0; j < enemies.length; j++) {
      if (
        enemies[j] &&
        projectiles[i] &&
        collision(projectiles[i], enemies[j])
      ) {
        enemies[j].health -= projectiles[i].power;
        projectiles.splice(i, 1);
        i--;
      }
    }

    if (projectiles[i] && projectiles[i].position.x > canvas.width - cellSize) {
      projectiles.splice(i, 1);
      i--;
    }
  }
}

function handleResources() {
  if (frame % 500 === 0 && score < winningScore) {
    resources.push(new Resource(amounts));
  }

  for (let i = 0; i < resources.length; i++) {
    resources[i].draw();
    if (
      resources[i] &&
      mouse.position.x &&
      mouse.position.y &&
      collision(resources[i], mouse)
    ) {
      numberOfResources += resources[i].amount;
      resources.splice(i, 1);
      i--;
    }
  }
}

createGrid();

function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, controlBar.width, controlBar.height);
  handleGameGrid();
  handleDefenders();
  handleResources();
  handleProjectiles();
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

window.addEventListener('resize', () => {
  canvasPosition = canvas.getBoundingClientRect();
});
