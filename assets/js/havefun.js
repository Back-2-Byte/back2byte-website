const arcadeAccent = "#00ff66";
const arcadeShade = "#00b348";
const arcadeMuted = "#8a99ad";
const arcadeBackground = "#07130b";

function arcadeTranslation(key, fallback) {
  return window.back2byteTranslate?.(key) || fallback;
}

function createArcadeParticles(context) {
  const particles = [];
  return {
    burst(x, y, color) {
      for (let index = 0; index < 9; index += 1) {
        const angle = (Math.PI * 2 * index) / 9 + Math.random() * .25;
        const speed = 25 + Math.random() * 95;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: .35 + Math.random() * .3, color });
      }
    },
    draw() {
      particles.forEach((particle) => {
        particle.x += particle.vx / 60;
        particle.y += particle.vy / 60;
        particle.life -= 1 / 60;
        context.globalAlpha = Math.max(0, particle.life / .65);
        context.fillStyle = particle.color;
        context.fillRect(particle.x, particle.y, 3, 3);
      });
      context.globalAlpha = 1;
      for (let index = particles.length - 1; index >= 0; index -= 1) {
        if (particles[index].life <= 0) particles.splice(index, 1);
      }
    },
  };
}

function getArcadeContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  const context = canvas?.getContext("2d");
  if (!canvas || !context) {
    console.error(`The arcade game "${canvasId}" could not initialize.`);
    return null;
  }
  return { canvas, context };
}

function saveArcadeRecord(key, score) {
  try {
    const record = Number(window.localStorage.getItem(key)) || 0;
    if (score > record) window.localStorage.setItem(key, String(score));
    return Math.max(record, score);
  } catch (error) {
    console.error(`The arcade record "${key}" could not be saved.`, error);
    return score;
  }
}

function readArcadeRecord(key) {
  try {
    return Number(window.localStorage.getItem(key)) || 0;
  } catch (error) {
    console.error(`The arcade record "${key}" could not be loaded.`, error);
    return 0;
  }
}

const arcadeGames = new Map();
let activeKeyboardGame = "";

function stopArcadeGames(except) {
  arcadeGames.forEach((game, name) => {
    if (name !== except) game.stop();
  });
  if (except !== "snake") window.back2byteSnakePause?.();
  activeKeyboardGame = except || "";
  window.back2byteActiveGame = activeKeyboardGame;
}

function setArcadeStatus(id, key, fallback) {
  const status = document.getElementById(id);
  if (!status) return;
  status.dataset.gameStatus = key;
  status.textContent = arcadeTranslation(key, fallback);
}
window.back2byteRefreshArcade = () => {
  document.querySelectorAll(".arcade-status[data-game-status]").forEach((status) => {
    status.textContent = arcadeTranslation(status.dataset.gameStatus, status.textContent);
  });
};

function initializePong() {
  const surface = getArcadeContext("pongCanvas");
  if (!surface) return;
  const { canvas, context } = surface;
  const particles = createArcadeParticles(context);
  const scoreDisplay = document.getElementById("pongScore");
  const cpuDisplay = document.getElementById("pongCpuScore");
  const paddle = { x: 18, y: 100, width: 10, height: 70, speed: 330 };
  const cpu = { x: 452, y: 100, width: 10, height: 70, speed: 220 };
  const ball = { x: 240, y: 135, vx: 230, vy: 115, size: 9 };
  let score = 0;
  let cpuScore = 0;
  let running = false;
  let frameId = 0;
  let previousTime = 0;
  let heldDirection = 0;

  function draw() {
    context.fillStyle = arcadeBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(138, 153, 173, .35)";
    context.setLineDash([6, 8]);
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.stroke();
    context.setLineDash([]);
    context.fillStyle = arcadeAccent;
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = arcadeShade;
    context.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);
    context.fillRect(ball.x - ball.size / 2, ball.y - ball.size / 2, ball.size, ball.size);
    particles.draw();
  }

  function tick(time) {
    if (!running) return;
    const delta = Math.min((time - previousTime) / 1000 || 0, .035);
    previousTime = time;
    paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, paddle.y + heldDirection * paddle.speed * delta));
    const cpuTarget = ball.y - cpu.height / 2;
    cpu.y += Math.max(-cpu.speed * delta, Math.min(cpu.speed * delta, cpuTarget - cpu.y));
    ball.x += ball.vx * delta;
    ball.y += ball.vy * delta;

    if (ball.y < ball.size / 2 || ball.y > canvas.height - ball.size / 2) ball.vy *= -1;
    const hitPlayer = ball.vx < 0 && ball.x - ball.size / 2 <= paddle.x + paddle.width && ball.y >= paddle.y && ball.y <= paddle.y + paddle.height;
    const hitCpu = ball.vx > 0 && ball.x + ball.size / 2 >= cpu.x && ball.y >= cpu.y && ball.y <= cpu.y + cpu.height;
    if (hitPlayer || hitCpu) {
      particles.burst(ball.x, ball.y, arcadeAccent);
      ball.vx *= -1.04;
      ball.vy += (ball.y - (hitPlayer ? paddle.y + paddle.height / 2 : cpu.y + cpu.height / 2)) * .9;
    }
    if (ball.x < -ball.size || ball.x > canvas.width + ball.size) {
      if (ball.x < 0) {
        cpuScore += 1;
        cpuDisplay.textContent = String(cpuScore);
      } else {
        score += 1;
        scoreDisplay.textContent = String(score);
      }
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.vx = (ball.x < canvas.width / 2 ? 1 : -1) * 230;
      ball.vy = Math.random() * 180 - 90;
    }
    draw();
    frameId = requestAnimationFrame(tick);
  }

  function start() {
    stopArcadeGames("pong");
    running = true;
    score = 0;
    cpuScore = 0;
    paddle.y = canvas.height / 2 - paddle.height / 2;
    cpu.y = canvas.height / 2 - cpu.height / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 230;
    ball.vy = 115;
    scoreDisplay.textContent = "0";
    cpuDisplay.textContent = "0";
    setArcadeStatus("pongStatus", "game.playing", "JOGANDO");
    previousTime = performance.now();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
    setArcadeStatus("pongStatus", "game.ready", "PRONTO");
  }

  const button = document.querySelector('[data-start-game="pong"]');
  button.addEventListener("click", start);
  canvas.addEventListener("pointermove", (event) => {
    if (!running) return;
    const bounds = canvas.getBoundingClientRect();
    paddle.y = Math.max(0, Math.min(canvas.height - paddle.height, ((event.clientY - bounds.top) / bounds.height) * canvas.height - paddle.height / 2));
    draw();
  });
  arcadeGames.set("pong", {
    stop,
    setDirection(direction) { heldDirection = direction; },
  });
  draw();
}

function initializeBreakout() {
  const surface = getArcadeContext("breakoutCanvas");
  if (!surface) return;
  const { canvas, context } = surface;
  const particles = createArcadeParticles(context);
  const scoreDisplay = document.getElementById("breakoutScore");
  const livesDisplay = document.getElementById("breakoutLives");
  const paddle = { x: 195, width: 90, height: 10, speed: 360 };
  const ball = { x: 240, y: 255, vx: 180, vy: -200, radius: 7 };
  let score = 0;
  let lives = 3;
  let bricks = [];
  let running = false;
  let frameId = 0;
  let previousTime = 0;
  let heldDirection = 0;

  function createBricks() {
    bricks = [];
    for (let row = 0; row < 4; row += 1) {
      for (let column = 0; column < 10; column += 1) {
        bricks.push({ x: 20 + column * 44, y: 28 + row * 22, width: 36, height: 12, active: true, color: row % 2 ? arcadeAccent : arcadeShade });
      }
    }
  }

  function draw() {
    context.fillStyle = arcadeBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    bricks.forEach((brick) => {
      if (!brick.active) return;
      context.fillStyle = brick.color;
      context.fillRect(brick.x, brick.y, brick.width, brick.height);
    });
    context.fillStyle = arcadeAccent;
    context.fillRect(paddle.x, canvas.height - 25, paddle.width, paddle.height);
    context.fillStyle = "#f4f6f1";
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fill();
    particles.draw();
  }

  function end(statusKey, fallback) {
    running = false;
    cancelAnimationFrame(frameId);
    setArcadeStatus("breakoutStatus", statusKey, fallback);
  }

  function tick(time) {
    if (!running) return;
    const delta = Math.min((time - previousTime) / 1000 || 0, .035);
    previousTime = time;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, paddle.x + heldDirection * paddle.speed * delta));
    ball.x += ball.vx * delta;
    ball.y += ball.vy * delta;
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) ball.vx *= -1;
    if (ball.y < ball.radius) ball.vy *= -1;
    if (ball.y + ball.radius >= canvas.height - 25 && ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
      ball.vy = -Math.abs(ball.vy);
      ball.vx += ((ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)) * 80;
    }
    bricks.forEach((brick) => {
      if (!brick.active || ball.x < brick.x || ball.x > brick.x + brick.width || ball.y < brick.y || ball.y > brick.y + brick.height) return;
      brick.active = false;
      particles.burst(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
      ball.vy *= -1;
      score += 10;
      scoreDisplay.textContent = String(score);
    });
    if (ball.y > canvas.height + ball.radius) {
      lives -= 1;
      livesDisplay.textContent = String(lives);
      if (!lives) {
        end("game.over", "FIM DE JOGO");
        draw();
        return;
      }
      ball.x = paddle.x + paddle.width / 2;
      ball.y = canvas.height - 45;
      ball.vx = 180 * (Math.random() > .5 ? 1 : -1);
      ball.vy = -200;
    }
    if (bricks.every((brick) => !brick.active)) {
      end("game.victory", "VOCÊ VENCEU!");
      draw();
      return;
    }
    draw();
    frameId = requestAnimationFrame(tick);
  }

  function start() {
    stopArcadeGames("breakout");
    score = 0;
    lives = 3;
    paddle.x = (canvas.width - paddle.width) / 2;
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 45;
    ball.vx = 180;
    ball.vy = -200;
    scoreDisplay.textContent = "0";
    livesDisplay.textContent = "3";
    createBricks();
    running = true;
    setArcadeStatus("breakoutStatus", "game.playing", "JOGANDO");
    previousTime = performance.now();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
    setArcadeStatus("breakoutStatus", "game.ready", "PRONTO");
  }

  document.querySelector('[data-start-game="breakout"]').addEventListener("click", start);
  canvas.addEventListener("pointermove", (event) => {
    if (!running) return;
    const bounds = canvas.getBoundingClientRect();
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, ((event.clientX - bounds.left) / bounds.width) * canvas.width - paddle.width / 2));
  });
  arcadeGames.set("breakout", {
    stop,
    setDirection(direction) { heldDirection = direction; },
  });
  createBricks();
  draw();
}

function initializeDino() {
  const surface = getArcadeContext("dinoCanvas");
  if (!surface) return;
  const { canvas, context } = surface;
  const particles = createArcadeParticles(context);
  const scoreDisplay = document.getElementById("dinoScore");
  const recordDisplay = document.getElementById("dinoHighscore");
  const recordKey = "back2byte-dino-highscore";
  const ground = 190;
  const dino = { x: 54, y: ground - 32, width: 25, height: 32, velocity: 0, jumping: false };
  let obstacles = [];
  let score = 0;
  let running = false;
  let frameId = 0;
  let previousTime = 0;
  let spawnTimer = 0;
  let speed = 220;
  let record = readArcadeRecord(recordKey);
  recordDisplay.textContent = String(record);

  function draw() {
    context.fillStyle = arcadeBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(138, 153, 173, .5)";
    context.beginPath();
    context.moveTo(0, ground);
    context.lineTo(canvas.width, ground);
    context.stroke();
    context.fillStyle = arcadeAccent;
    context.fillRect(dino.x, dino.y, dino.width, dino.height);
    context.fillStyle = "#06120b";
    context.fillRect(dino.x + 17, dino.y + 7, 4, 4);
    context.fillRect(dino.x - 3, ground - 5, 9, 5);
    context.fillRect(dino.x + 16, ground - 5, 9, 5);
    context.fillStyle = arcadeShade;
    obstacles.forEach((obstacle) => context.fillRect(obstacle.x, ground - obstacle.height, obstacle.width, obstacle.height));
    particles.draw();
  }

  function jump() {
    if (!running) return;
    if (dino.jumping) return;
    dino.velocity = -430;
    dino.jumping = true;
    particles.burst(dino.x + dino.width / 2, ground - 3, arcadeAccent);
  }

  function end() {
    running = false;
    cancelAnimationFrame(frameId);
    setArcadeStatus("dinoStatus", "game.over", "FIM DE JOGO");
    record = saveArcadeRecord(recordKey, Math.floor(score));
    recordDisplay.textContent = String(record);
    draw();
  }

  function tick(time) {
    if (!running) return;
    const delta = Math.min((time - previousTime) / 1000 || 0, .035);
    previousTime = time;
    score += delta * 10;
    scoreDisplay.textContent = String(Math.floor(score));
    speed = 220 + Math.min(score * 3, 250);
    dino.velocity += 1150 * delta;
    dino.y += dino.velocity * delta;
    if (dino.y >= ground - dino.height) {
      dino.y = ground - dino.height;
      dino.velocity = 0;
      dino.jumping = false;
    }
    spawnTimer -= delta;
    if (spawnTimer <= 0) {
      obstacles.push({ x: canvas.width + 10, width: 15 + Math.random() * 13, height: 22 + Math.random() * 26 });
      spawnTimer = .75 + Math.random() * .8;
    }
    obstacles.forEach((obstacle) => { obstacle.x -= speed * delta; });
    obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
    const collision = obstacles.some((obstacle) =>
      dino.x < obstacle.x + obstacle.width - 3 &&
      dino.x + dino.width > obstacle.x + 3 &&
      dino.y + dino.height > ground - obstacle.height
    );
    if (collision) {
      particles.burst(dino.x + dino.width / 2, dino.y + dino.height / 2, arcadeAccent);
      end();
      return;
    }
    draw();
    frameId = requestAnimationFrame(tick);
  }

  function start() {
    stopArcadeGames("dino");
    obstacles = [];
    score = 0;
    speed = 220;
    spawnTimer = .75;
    dino.y = ground - dino.height;
    dino.velocity = 0;
    dino.jumping = false;
    scoreDisplay.textContent = "0";
    running = true;
    setArcadeStatus("dinoStatus", "game.playing", "CORRENDO");
    previousTime = performance.now();
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(frameId);
    setArcadeStatus("dinoStatus", "game.ready", "PRONTO");
  }

  document.querySelector('[data-start-game="dino"]').addEventListener("click", start);
  canvas.addEventListener("pointerdown", jump);
  arcadeGames.set("dino", { stop, jump });
  draw();
}

function initializePacman() {
  const surface = getArcadeContext("pacmanCanvas");
  if (!surface) return;
  const { canvas, context } = surface;
  const particles = createArcadeParticles(context);
  const scoreDisplay = document.getElementById("pacmanScore");
  const pelletDisplay = document.getElementById("pacmanPellets");
  const tile = 24;
  const columns = canvas.width / tile;
  const rows = canvas.height / tile;
  const walls = new Set();
  for (let x = 0; x < columns; x += 1) {
    walls.add(`${x},0`);
    walls.add(`${x},${rows - 1}`);
  }
  for (let y = 0; y < rows; y += 1) {
    walls.add(`0,${y}`);
    walls.add(`${columns - 1},${y}`);
  }
  [[3, 2, 4, 2], [8, 2, 11, 2], [14, 2, 16, 2], [3, 4, 5, 4], [8, 4, 11, 4], [14, 4, 16, 4],
    [5, 2, 5, 3], [14, 2, 14, 3], [2, 7, 5, 7], [8, 7, 11, 7], [14, 7, 17, 7],
    [3, 9, 5, 9], [8, 9, 11, 9], [14, 9, 16, 9], [5, 8, 5, 9], [14, 8, 14, 9]].forEach(([x1, y1, x2, y2]) => {
    for (let y = y1; y <= y2; y += 1) for (let x = x1; x <= x2; x += 1) walls.add(`${x},${y}`);
  });

  let pellets = new Set();
  let score = 0;
  let player = { x: 1, y: 1, direction: "right", next: "right" };
  let ghosts = [];
  let running = false;
  let timerId = 0;
  let steps = 0;
  const moves = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  function canMove(x, y) {
    return x > 0 && x < columns - 1 && y > 0 && y < rows - 1 && !walls.has(`${x},${y}`);
  }

  function reset() {
    pellets = new Set();
    for (let y = 1; y < rows - 1; y += 1) {
      for (let x = 1; x < columns - 1; x += 1) {
        if (!walls.has(`${x},${y}`) && !(x === 1 && y === 1) && !(x === 18 && y === 1) && !(x === 18 && y === 10)) pellets.add(`${x},${y}`);
      }
    }
    score = 0;
    player = { x: 1, y: 1, direction: "right", next: "right" };
    ghosts = [{ x: 18, y: 1, color: arcadeAccent }, { x: 18, y: 10, color: arcadeShade }];
    steps = 0;
    scoreDisplay.textContent = "0";
    pelletDisplay.textContent = String(pellets.size);
  }

  function draw() {
    context.fillStyle = arcadeBackground;
    context.fillRect(0, 0, canvas.width, canvas.height);
    walls.forEach((position) => {
      const [x, y] = position.split(",").map(Number);
      context.fillStyle = "#0c2816";
      context.fillRect(x * tile + 2, y * tile + 2, tile - 4, tile - 4);
      context.strokeStyle = "rgba(0, 255, 102, .18)";
      context.strokeRect(x * tile + 3, y * tile + 3, tile - 6, tile - 6);
    });
    pellets.forEach((position) => {
      const [x, y] = position.split(",").map(Number);
      context.fillStyle = arcadeShade;
      context.beginPath();
      context.arc(x * tile + tile / 2, y * tile + tile / 2, 2.3, 0, Math.PI * 2);
      context.fill();
    });
    context.fillStyle = arcadeAccent;
    context.beginPath();
    context.arc(player.x * tile + tile / 2, player.y * tile + tile / 2, 9, .18, Math.PI * 1.82);
    context.lineTo(player.x * tile + tile / 2, player.y * tile + tile / 2);
    context.fill();
    ghosts.forEach((ghost) => {
      context.fillStyle = ghost.color;
      context.beginPath();
      context.arc(ghost.x * tile + tile / 2, ghost.y * tile + tile / 2, 9, Math.PI, 0);
      context.lineTo(ghost.x * tile + tile - 3, ghost.y * tile + tile - 3);
      context.lineTo(ghost.x * tile + tile / 2, ghost.y * tile + tile - 7);
      context.lineTo(ghost.x * tile + 3, ghost.y * tile + tile - 3);
      context.closePath();
      context.fill();
      context.fillStyle = "#07130b";
      context.fillRect(ghost.x * tile + 7, ghost.y * tile + 8, 3, 4);
      context.fillRect(ghost.x * tile + 14, ghost.y * tile + 8, 3, 4);
    });
    particles.draw();
  }

  function end(statusKey, fallback) {
    running = false;
    window.clearInterval(timerId);
    setArcadeStatus("pacmanStatus", statusKey, fallback);
  }

  function step() {
    const nextMove = moves[player.next];
    if (canMove(player.x + nextMove[0], player.y + nextMove[1])) player.direction = player.next;
    const [dx, dy] = moves[player.direction];
    if (canMove(player.x + dx, player.y + dy)) {
      player.x += dx;
      player.y += dy;
    }
    const pellet = `${player.x},${player.y}`;
    if (pellets.delete(pellet)) {
      score += 10;
      scoreDisplay.textContent = String(score);
      pelletDisplay.textContent = String(pellets.size);
      particles.burst(player.x * tile + tile / 2, player.y * tile + tile / 2, arcadeAccent);
    }
    steps += 1;
    ghosts.forEach((ghost) => {
      if (steps % 2 !== 0) return;
      const options = Object.keys(moves).filter((direction) => {
        const [gx, gy] = moves[direction];
        return canMove(ghost.x + gx, ghost.y + gy);
      });
      options.sort((a, b) => {
        const [ax, ay] = moves[a];
        const [bx, by] = moves[b];
        return Math.hypot(ghost.x + ax - player.x, ghost.y + ay - player.y) - Math.hypot(ghost.x + bx - player.x, ghost.y + by - player.y);
      });
      const [gx, gy] = moves[options[0] || "left"];
      ghost.x += gx;
      ghost.y += gy;
    });
    if (ghosts.some((ghost) => ghost.x === player.x && ghost.y === player.y)) {
      draw();
      end("arcade.caught", "PEGARAM VOCÊ");
      return;
    }
    if (!pellets.size) {
      draw();
      end("arcade.cleared", "LABIRINTO LIMPO!");
      return;
    }
    draw();
  }

  function start() {
    stopArcadeGames("pacman");
    window.clearInterval(timerId);
    reset();
    running = true;
    setArcadeStatus("pacmanStatus", "game.playing", "JOGANDO");
    draw();
    timerId = window.setInterval(step, 145);
  }

  function stop() {
    running = false;
    window.clearInterval(timerId);
    setArcadeStatus("pacmanStatus", "game.ready", "PRONTO");
  }

  document.querySelector('[data-start-game="pacman"]').addEventListener("click", start);
  document.querySelectorAll("[data-pacman-direction]").forEach((button) => {
    button.addEventListener("click", () => { player.next = button.dataset.pacmanDirection; });
  });
  arcadeGames.set("pacman", {
    stop,
    setDirection(direction) { player.next = direction; },
  });
  reset();
  draw();
}

document.querySelectorAll("[data-start-game]").forEach((button) => {
  button.addEventListener("click", () => {
    const game = arcadeGames.get(button.dataset.startGame);
    if (game) activeKeyboardGame = button.dataset.startGame;
  });
});

window.addEventListener("keydown", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
  const directionKeys = {
    ArrowUp: "up", w: "up", W: "up",
    ArrowDown: "down", s: "down", S: "down",
    ArrowLeft: "left", a: "left", A: "left",
    ArrowRight: "right", d: "right", D: "right",
  };
  if (activeKeyboardGame === "pong") {
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      if (event.key === "ArrowUp") event.preventDefault();
      arcadeGames.get("pong").setDirection(-1);
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
      if (event.key === "ArrowDown") event.preventDefault();
      arcadeGames.get("pong").setDirection(1);
    }
    return;
  }
  if (activeKeyboardGame === "breakout") {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      if (event.key === "ArrowLeft") event.preventDefault();
      arcadeGames.get("breakout").setDirection(-1);
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      if (event.key === "ArrowRight") event.preventDefault();
      arcadeGames.get("breakout").setDirection(1);
    }
    return;
  }
  if (activeKeyboardGame === "dino") {
    if (event.code === "Space" || event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
      event.preventDefault();
      arcadeGames.get("dino").jump();
    }
    return;
  }
  if (activeKeyboardGame === "pacman" && directionKeys[event.key]) {
    event.preventDefault();
    arcadeGames.get("pacman").setDirection(directionKeys[event.key]);
  }
});

window.addEventListener("keyup", (event) => {
  if (activeKeyboardGame === "pong" && (event.key === "ArrowUp" || event.key === "w" || event.key === "W" || event.key === "ArrowDown" || event.key === "s" || event.key === "S")) arcadeGames.get("pong")?.setDirection(0);
  if (activeKeyboardGame === "breakout" && (event.key === "ArrowLeft" || event.key === "a" || event.key === "A" || event.key === "ArrowRight" || event.key === "d" || event.key === "D")) arcadeGames.get("breakout")?.setDirection(0);
});

initializePong();
initializeBreakout();
initializeDino();
initializePacman();
