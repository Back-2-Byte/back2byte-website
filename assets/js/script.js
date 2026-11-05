document.documentElement.classList.add("js");

const languageButtons = [...document.querySelectorAll(".language-toggle")];
const themeButton = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuToggle");
const navigation = document.getElementById("primaryNav");
const contactForm = document.getElementById("contactForm");
const byteCanvas = document.getElementById("byteCanvas");
let translations;
let snakeGame;

const savedTheme = window.localStorage.getItem("back2byte-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.dataset.theme = savedTheme;
}

function syncThemeLogos() {
  const isLight = document.documentElement.dataset.theme === "light";
  document.querySelectorAll("[data-dark-src][data-light-src]").forEach((image) => {
    image.src = isLight ? image.dataset.lightSrc : image.dataset.darkSrc;
  });
}
syncThemeLogos();

function getCurrentLanguage() {
  const pathSegments = (window.location.pathname || "/").toLowerCase().split("/").filter(Boolean);
  if (pathSegments.includes("en")) return "en";
  if (pathSegments.includes("es")) return "es";
  return "pt";
}

function getContentPath() {
  return "/assets/data/content.json";
}

function getTranslation(path) {
  return path.split(".").reduce((value, part) => value?.[part], translations?.translations?.[currentLanguage]);
}

function applyLanguage(language) {
  currentLanguage = language;
  if (window.localStorage) {
    window.localStorage.setItem("back2byte-language", language);
  }

  document.documentElement.lang = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(element.dataset.i18n);
    if (typeof value !== "string") {
      console.error(`Missing translation "${element.dataset.i18n}" for "${language}".`);
      return;
    }

    element.textContent = value;
  });

  languageButtons.forEach((button) => {
    const selected = button.dataset.language === language;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  themeButton.setAttribute("aria-label", getTranslation(document.documentElement.dataset.theme === "light" ? "ui.switchToDark" : "ui.switchToLight"));
  menuButton.setAttribute("aria-label", getTranslation(menuButton.getAttribute("aria-expanded") === "true" ? "ui.closeMenu" : "ui.openMenu"));
  navigation.setAttribute("aria-label", getTranslation("ui.primaryNavigation"));
  document.querySelectorAll(".brand[aria-label]").forEach((brand) => brand.setAttribute("aria-label", getTranslation("ui.brandHome")));
  document.querySelectorAll(".snake-controls").forEach((controls) => controls.setAttribute("aria-label", getTranslation("game.controls")));
  document.querySelectorAll(".snake-controls [data-direction]").forEach((button) => {
    button.setAttribute("aria-label", getTranslation(`game.directions.${button.dataset.direction}`));
  });
  const snakeCanvas = document.getElementById("snakeCanvas");
  if (snakeCanvas) snakeCanvas.setAttribute("aria-label", getTranslation("game.canvasLabel"));
  snakeGame?.refreshLabels();
}

let currentLanguage = getCurrentLanguage();

async function loadTranslations() {
  const response = await fetch(getContentPath());
  if (!response.ok) {
    throw new Error(`Could not load content.json (${response.status} ${response.statusText}).`);
  }
  translations = await response.json();

  if (!translations.translations?.[currentLanguage]) {
    throw new Error(`The default language "${currentLanguage}" is missing from content.json.`);
  }
  if (!translations.meta?.contactEmail) {
    throw new Error("The contactEmail field is missing from content.json.");
  }

  document.querySelectorAll("[data-contact-email]").forEach((link) => {
    link.href = `mailto:${translations.meta.contactEmail}`;
    link.textContent = translations.meta.contactEmail;
  });

  applyLanguage(currentLanguage);
  languageButtons.forEach((button) => {
    button.disabled = false;
  });
}

loadTranslations().catch((error) => {
  console.error("The website translations could not be loaded. Serve the site over HTTP to enable language switching.", error);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLanguage = button.dataset.language;
    const pathParts = (window.location.pathname || "/").split("/").filter(Boolean);
    const page = pathParts.find((part) => !["en", "es", "pt"].includes(part));
    const targetPath = page
      ? selectedLanguage === "pt" ? `/${page}/` : `/${page}/${selectedLanguage}/`
      : selectedLanguage === "pt" ? "/" : `/${selectedLanguage}/`;
    const currentPath = (window.location.pathname || "/").toLowerCase();

    if (currentPath !== targetPath.toLowerCase()) {
      window.location.assign(targetPath);
      return;
    }

    applyLanguage(selectedLanguage);
  });
});

themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("back2byte-theme", theme);
  syncThemeLogos();
  themeButton.setAttribute("aria-label", getTranslation(theme === "light" ? "ui.switchToDark" : "ui.switchToLight"));
});

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);
  menuButton.setAttribute("aria-label", getTranslation(!isExpanded ? "ui.closeMenu" : "ui.openMenu"));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    if (translations) menuButton.setAttribute("aria-label", getTranslation("ui.openMenu"));
  });
});

document.querySelectorAll(".expertise-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".expertise-tab").forEach((item) => {
      const selected = item === tab;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll(".expertise-panel").forEach((panel) => {
      const selected = panel.dataset.panel === tab.dataset.tab;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
    });
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll(".expertise-tab")];
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const next = tabs[(tabs.indexOf(tab) + direction + tabs.length) % tabs.length];
    next.focus();
    next.click();
  });
});

function initializeByteParticles() {
  const context = byteCanvas.getContext("2d");
  if (!context) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let scrollProgress = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let frame = 0;

  function resizeCanvas() {
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    byteCanvas.width = Math.round(width * pixelRatio);
    byteCanvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = Math.min(72, Math.floor((width * height) / 18000));
    particles.length = 0;
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        gridX: Math.round(Math.random() * width / 32) * 32,
        gridY: Math.round(Math.random() * height / 32) * 32,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() > 0.8 ? 3 : 2,
      });
    }
  }

  function drawParticles() {
    context.clearRect(0, 0, width, height);
    const now = performance.now() / 1000;
    const green = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00ff66";

    particles.forEach((particle) => {
      const progress = Math.min(1, scrollProgress * 1.8);
      const driftX = Math.sin(now * 0.45 + particle.phase) * 5;
      const driftY = Math.cos(now * 0.4 + particle.phase) * 5;
      const targetX = particle.x + (particle.gridX - particle.x) * progress + driftX;
      const targetY = particle.y + (particle.gridY - particle.y) * progress + driftY;
      const dx = targetX - pointerX;
      const dy = targetY - pointerY;
      const distance = Math.hypot(dx, dy);
      const repulsion = distance < 110 ? (110 - distance) * 0.28 : 0;
      const x = targetX + (distance ? (dx / distance) * repulsion : 0);
      const y = targetY + (distance ? (dy / distance) * repulsion : 0);
      const alpha = .12 + ((Math.sin(now + particle.phase) + 1) * .12);
      context.globalAlpha = alpha;
      context.fillStyle = green;
      context.fillRect(Math.round(x / 4) * 4, Math.round(y / 4) * 4, particle.size, particle.size);
    });
    context.globalAlpha = 1;

    if (!reduceMotion) frame = requestAnimationFrame(drawParticles);
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("scroll", () => {
    scrollProgress = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
  }, { passive: true });
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });
  resizeCanvas();
  if (reduceMotion) drawParticles();
  else frame = requestAnimationFrame(drawParticles);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}

const glow = document.querySelector(".cursor-glow");
const dot = document.querySelector(".cursor-dot");
const heroCursorRegion = document.getElementById("inicio");
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;

  if (!dot || !hasFinePointer.matches) return;
  const target = event.target instanceof Element ? event.target : null;
  const isInHero = Boolean(target && heroCursorRegion?.contains(target));
  const isTextInput = Boolean(target?.closest("input, textarea, [contenteditable='true']"));
  const isInteractive = Boolean(target?.closest("a, button, [role='tab']"));

  dot.style.left = `${event.clientX}px`;
  dot.style.top = `${event.clientY}px`;
  dot.classList.toggle("is-mouth", isInHero);
  dot.classList.toggle("is-tracker", !isInHero);
  dot.classList.toggle("is-target", !isInHero && isInteractive);
  dot.classList.toggle("is-visible", !isTextInput);
}, { passive: true });
document.addEventListener("pointerout", (event) => {
  if (!event.relatedTarget && dot) dot.classList.remove("is-visible");
});
window.addEventListener("blur", () => {
  if (dot) dot.classList.remove("is-visible");
});

initializeByteParticles();

document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  }, { passive: true });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const subject = encodeURIComponent(`Contato Back2Byte — ${formData.get("company") || formData.get("name")}`);
    const message = [
      `${getTranslation("contact.name")}: ${formData.get("name")}`,
      `${getTranslation("contact.company")}: ${formData.get("company") || "-"}`,
      `${getTranslation("contact.email")}: ${formData.get("email")}`,
      "",
      `${getTranslation("contact.message")}:`,
      formData.get("message"),
    ].join("\n");
    window.location.href = `mailto:${translations.meta.contactEmail}?subject=${subject}&body=${encodeURIComponent(message)}`;
  });
}

const currentYear = document.getElementById("currentYear");
if (currentYear) currentYear.textContent = new Date().getFullYear();

function initializeSnakeGame() {
  const canvas = document.getElementById("snakeCanvas");
  const playButton = document.getElementById("snakePlay");
  const overlay = document.getElementById("snakeOverlay");
  const status = document.getElementById("snakeStatus");
  const scoreDisplay = document.getElementById("snakeScore");
  const highscoreDisplay = document.getElementById("snakeHighscore");
  if (!canvas || !playButton || !overlay || !status || !scoreDisplay || !highscoreDisplay) return;

  const context = canvas.getContext("2d");
  if (!context) {
    console.error("The snake game could not initialize because the canvas context is unavailable.");
    return;
  }

  const cellSize = 20;
  const columns = canvas.width / cellSize;
  const rows = canvas.height / cellSize;
  const highscoreKey = "back2byte-snake-highscore";
  let snake = [];
  let food = { x: 0, y: 0 };
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let score = 0;
  let highscore = readHighscore();
  let intervalId = 0;
  let isRunning = false;
  let hasTurned = false;

  function readHighscore() {
    try {
      const saved = Number(window.localStorage.getItem(highscoreKey));
      return Number.isFinite(saved) && saved > 0 ? saved : 0;
    } catch (error) {
      console.error("The snake game high score could not be loaded from local storage.", error);
      return 0;
    }
  }

  function saveHighscore() {
    try {
      window.localStorage.setItem(highscoreKey, String(highscore));
    } catch (error) {
      console.error("The snake game high score could not be saved to local storage.", error);
    }
  }

  function makeSnake() {
    const centerX = Math.floor(columns / 2);
    const centerY = Math.floor(rows / 2);
    return [{ x: centerX, y: centerY }, { x: centerX - 1, y: centerY }, { x: centerX - 2, y: centerY }];
  }

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) };
    } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
  }

  function draw() {
    context.fillStyle = "#f4f6f1";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(12, 38, 22, .08)";
    context.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += cellSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, canvas.height);
      context.stroke();
    }
    for (let y = 0; y <= canvas.height; y += cellSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    context.fillStyle = "#ed3d52";
    context.beginPath();
    context.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, 7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#9c1f34";
    context.fillRect(food.x * cellSize + 5, food.y * cellSize + 3, 3, 3);
    context.fillRect(food.x * cellSize + 12, food.y * cellSize + 3, 3, 3);

    snake.forEach((segment, index) => {
      const inset = index === 0 ? 2 : 3;
      context.fillStyle = index === 0 ? "#008f3c" : "#00b348";
      context.fillRect(segment.x * cellSize + inset, segment.y * cellSize + inset, cellSize - inset * 2, cellSize - inset * 2);
    });

    const head = snake[0];
    if (head) {
      context.fillStyle = "#f4f6f1";
      const eyeX = head.x * cellSize + cellSize / 2 + direction.x * 4;
      const eyeY = head.y * cellSize + cellSize / 2 + direction.y * 4;
      context.fillRect(eyeX - direction.y * 4 - 1, eyeY + direction.x * 4 - 1, 3, 3);
      context.fillRect(eyeX + direction.y * 4 - 1, eyeY - direction.x * 4 - 1, 3, 3);
    }
  }

  function refreshLabels() {
    const label = isRunning ? "game.playing" : score > 0 ? "game.restart" : "game.play";
    playButton.textContent = getTranslation(label) || "Play";
    status.textContent = getTranslation(isRunning ? "game.playing" : score > 0 ? "game.over" : "game.ready") || "READY";
    highscoreDisplay.textContent = String(highscore);
  }

  function stopGame() {
    window.clearInterval(intervalId);
    intervalId = 0;
    isRunning = false;
    overlay.hidden = false;
    overlay.textContent = `${getTranslation("game.over") || "GAME OVER"} · ${score}`;
    refreshLabels();
  }

  function move() {
    direction = nextDirection;
    hasTurned = false;
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    const ateFood = head.x === food.x && head.y === food.y;
    const body = ateFood ? snake : snake.slice(0, -1);
    const hitBody = body.some((segment) => segment.x === head.x && segment.y === head.y);
    if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows || hitBody) {
      stopGame();
      return;
    }

    snake.unshift(head);
    if (ateFood) {
      score += 1;
      scoreDisplay.textContent = String(score);
      placeFood();
      if (score > highscore) {
        highscore = score;
        highscoreDisplay.textContent = String(highscore);
        saveHighscore();
      }
      window.clearInterval(intervalId);
      intervalId = window.setInterval(move, Math.max(70, 145 - score * 2));
    } else {
      snake.pop();
    }
    draw();
  }

  function setDirection(name) {
    const directions = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 }
    };
    const requested = directions[name];
    if (!requested || hasTurned || requested.x === -direction.x && requested.y === -direction.y) return;
    nextDirection = requested;
    hasTurned = true;
  }

  function startGame() {
    window.clearInterval(intervalId);
    snake = makeSnake();
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    score = 0;
    scoreDisplay.textContent = "0";
    isRunning = true;
    hasTurned = false;
    placeFood();
    overlay.hidden = true;
    refreshLabels();
    draw();
    if (document.visibilityState !== "hidden") intervalId = window.setInterval(move, 145);
  }

  playButton.addEventListener("click", startGame);
  document.querySelectorAll(".snake-controls [data-direction]").forEach((button) => {
    button.addEventListener("click", () => setDirection(button.dataset.direction));
  });
  window.addEventListener("keydown", (event) => {
    if (!isRunning || event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable='true']")) return;
    const directions = {
      ArrowUp: "up", w: "up", W: "up",
      ArrowDown: "down", s: "down", S: "down",
      ArrowLeft: "left", a: "left", A: "left",
      ArrowRight: "right", d: "right", D: "right"
    };
    const requested = directions[event.key];
    if (!requested) return;
    event.preventDefault();
    setDirection(requested);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      window.clearInterval(intervalId);
      intervalId = 0;
    } else if (isRunning && !intervalId) {
      intervalId = window.setInterval(move, Math.max(70, 145 - score * 2));
    }
  });

  snake = makeSnake();
  placeFood();
  draw();
  refreshLabels();
  snakeGame = { refreshLabels };
}

initializeSnakeGame();
