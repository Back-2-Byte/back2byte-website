document.documentElement.classList.add("js");

const languageButtons = [...document.querySelectorAll(".language-toggle")];
const themeButton = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuToggle");
const navigation = document.getElementById("primaryNav");
const contactForm = document.getElementById("contactForm");
const byteCanvas = document.getElementById("byteCanvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let translations;
let snakeGame;

/* Storage can throw (private mode, blocked cookies); never let it break the page. */
const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* Preference is simply not persisted. */
    }
  },
};

const savedTheme = storage.get("back2byte-theme");
if (savedTheme === "light" || savedTheme === "dark") {
  document.documentElement.dataset.theme = savedTheme;
}

function syncThemeLogos() {
  const isLight = document.documentElement.dataset.theme === "light";
  document.querySelectorAll("[data-dark-src][data-light-src]").forEach((image) => {
    const source = isLight ? image.dataset.lightSrc : image.dataset.darkSrc;
    if (image.getAttribute("src") !== source) image.src = source;
  });
}
syncThemeLogos();

function getCurrentLanguage() {
  const pathSegments = (window.location.pathname || "/").toLowerCase().split("/").filter(Boolean);
  const language = pathSegments[0];
  return ["pt", "en", "es"].includes(language) ? language : "pt";
}

function getContentPath() {
  return "/assets/data/content.json";
}

function getTranslation(path) {
  return path.split(".").reduce((value, part) => value?.[part], translations?.translations?.[currentLanguage]);
}
window.back2byteTranslate = getTranslation;

/* Only replace an accessible name when a translation exists, so labels never become "undefined". */
function setTranslatedLabel(element, key) {
  const value = getTranslation(key);
  if (element && typeof value === "string") element.setAttribute("aria-label", value);
}

function applyLanguage(language) {
  currentLanguage = language;
  storage.set("back2byte-language", language);

  document.documentElement.lang = language === "pt" ? "pt-BR" : language === "es" ? "es" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(element.dataset.i18n);
    if (typeof value !== "string") {
      console.error(`Missing translation "${element.dataset.i18n}" for "${language}".`);
      return;
    }
    element.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const value = getTranslation(element.dataset.i18nAria);
    if (typeof value !== "string") {
      console.error(`Missing accessibility translation "${element.dataset.i18nAria}" for "${language}".`);
      return;
    }
    element.setAttribute("aria-label", value);
  });

  languageButtons.forEach((button) => {
    const selected = button.dataset.language === language;
    button.classList.toggle("is-active", selected);
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelectorAll('a[href="/"]').forEach((link) => {
    link.href = `/${language}/`;
  });
  document.querySelectorAll('a[href^="/#"]').forEach((link) => {
    link.href = `/${language}/${link.getAttribute("href").slice(1)}`;
  });

  setTranslatedLabel(themeButton, document.documentElement.dataset.theme === "light" ? "ui.switchToDark" : "ui.switchToLight");
  setTranslatedLabel(menuButton, menuButton.getAttribute("aria-expanded") === "true" ? "ui.closeMenu" : "ui.openMenu");
  document.querySelectorAll(".snake-controls").forEach((controls) => setTranslatedLabel(controls, "game.controls"));
  document.querySelectorAll(".snake-controls [data-direction]").forEach((button) => {
    setTranslatedLabel(button, `game.directions.${button.dataset.direction}`);
  });
  document.querySelectorAll(".pacman-controls [data-pacman-direction]").forEach((button) => {
    setTranslatedLabel(button, `game.directions.${button.dataset.pacmanDirection}`);
  });
  setTranslatedLabel(document.getElementById("snakeCanvas"), "game.canvasLabel");
  snakeGame?.refreshLabels();
  window.back2byteRefreshArcade?.();
}

let currentLanguage = getCurrentLanguage();

async function loadTranslations() {
  const response = await fetch(getContentPath());
  if (!response.ok) {
    throw new Error(`Could not load content.json (${response.status} ${response.statusText}).`);
  }
  translations = await response.json();

  if (!translations.translations?.[currentLanguage]) {
    throw new Error(`The language "${currentLanguage}" is missing from content.json.`);
  }
  if (!translations.meta?.contactEmail) {
    throw new Error("The contactEmail field is missing from content.json.");
  }

  document.querySelectorAll("[data-contact-email]").forEach((link) => {
    link.href = `mailto:${translations.meta.contactEmail}`;
    link.textContent = translations.meta.contactEmail;
  });

  applyLanguage(currentLanguage);
}

/* The localized pages already ship their text in HTML; the JSON keeps dynamic labels in sync. */
loadTranslations().catch((error) => {
  console.error("The website translations could not be loaded. Serve the site over HTTP to enable language switching.", error);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const selectedLanguage = button.dataset.language;
    const isArcade = (window.location.pathname || "/").split("/").includes("havefun");
    if (isArcade) {
      if (!translations) return; /* follow the link normally */
      event.preventDefault();
      applyLanguage(selectedLanguage);
      return;
    }
    const targetPath = `/${selectedLanguage}/`;
    if ((window.location.pathname || "/").toLowerCase() === targetPath) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    window.location.assign(`${targetPath}${window.location.hash}`);
  });
});

themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  storage.set("back2byte-theme", theme);
  syncThemeLogos();
  setTranslatedLabel(themeButton, theme === "light" ? "ui.switchToDark" : "ui.switchToLight");
  document.dispatchEvent(new CustomEvent("back2byte:themechange"));
});

/* Mobile navigation */
function setMenuOpen(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
  setTranslatedLabel(menuButton, open ? "ui.closeMenu" : "ui.openMenu");
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});
navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (menuButton.getAttribute("aria-expanded") !== "true") return;
  if (!navigation.contains(event.target) && !menuButton.contains(event.target)) setMenuOpen(false);
});

/* Highlight the navigation link of the section currently in view */
function initializeSectionTracking() {
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  if (!sections.length || !("IntersectionObserver" in window)) return;

  links.forEach((link) => link.removeAttribute("aria-current"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((section) => observer.observe(section));
}
initializeSectionTracking();

/* Technical expertise tabs (WAI-ARIA tabs pattern) */
const expertiseTabs = [...document.querySelectorAll(".expertise-tab")];
function selectTab(tab) {
  expertiseTabs.forEach((item) => {
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
}
expertiseTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const last = expertiseTabs.length - 1;
    const targets = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowRight: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    const next = expertiseTabs[targets[event.key]];
    next.focus();
    selectTab(next);
  });
});

/* Ambient byte particles behind the page */
function initializeByteParticles() {
  const context = byteCanvas?.getContext("2d");
  if (!context) return;

  const particles = [];
  let width = 0;
  let height = 0;
  let scrollProgress = 0;
  let pointerX = -1000;
  let pointerY = -1000;
  let frame = 0;
  let accent = "#00ff66";

  function readAccent() {
    accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00ff66";
  }

  function resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    byteCanvas.width = Math.round(width * pixelRatio);
    byteCanvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = Math.min(60, Math.floor((width * height) / 22000));
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
    if (reduceMotion.matches) drawParticles();
  }

  function drawParticles() {
    context.clearRect(0, 0, width, height);
    const now = performance.now() / 1000;
    const progress = Math.min(1, scrollProgress * 1.8);
    context.fillStyle = accent;

    particles.forEach((particle) => {
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
      context.globalAlpha = .12 + ((Math.sin(now + particle.phase) + 1) * .12);
      context.fillRect(Math.round(x / 4) * 4, Math.round(y / 4) * 4, particle.size, particle.size);
    });
    context.globalAlpha = 1;
  }

  function loop() {
    drawParticles();
    frame = requestAnimationFrame(loop);
  }

  function start() {
    if (!frame && !reduceMotion.matches && document.visibilityState === "visible") frame = requestAnimationFrame(loop);
  }

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("scroll", () => {
    scrollProgress = Math.min(1, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
  }, { passive: true });
  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });
  document.addEventListener("visibilitychange", () => (document.visibilityState === "visible" ? start() : stop()));
  document.addEventListener("back2byte:themechange", () => {
    readAccent();
    if (reduceMotion.matches) drawParticles();
  });
  reduceMotion.addEventListener?.("change", () => (reduceMotion.matches ? (stop(), drawParticles()) : start()));

  readAccent();
  resizeCanvas();
  start();
}

/* Reveal sections once as they enter the viewport */
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

/* Soft glow that follows a fine pointer; moved with transforms to avoid layout work */
const glow = document.querySelector(".cursor-glow");
if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let glowFrame = 0;
  let glowX = 0;
  let glowY = 0;
  window.addEventListener("pointermove", (event) => {
    glowX = event.clientX;
    glowY = event.clientY;
    if (glowFrame) return;
    glowFrame = requestAnimationFrame(() => {
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      glowFrame = 0;
    });
  }, { passive: true });
}

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
    const label = (key, fallback) => getTranslation(key) || fallback;
    const email = translations?.meta?.contactEmail || "contact@back2byte.com";
    const subject = encodeURIComponent(`Contato Back2Byte — ${formData.get("company") || formData.get("name")}`);
    const message = [
      `${label("contact.name", "Name")}: ${formData.get("name")}`,
      `${label("contact.company", "Company")}: ${formData.get("company") || "-"}`,
      `${label("contact.email", "Email")}: ${formData.get("email")}`,
      "",
      `${label("contact.message", "Message")}:`,
      formData.get("message"),
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(message)}`;
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
    context.fillStyle = "#07130b";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(0, 255, 102, .1)";
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

    context.fillStyle = "#00ff66";
    context.beginPath();
    context.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, 7, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#07130b";
    context.fillRect(food.x * cellSize + 5, food.y * cellSize + 3, 3, 3);
    context.fillRect(food.x * cellSize + 12, food.y * cellSize + 3, 3, 3);

    snake.forEach((segment, index) => {
      const inset = index === 0 ? 2 : 3;
      context.fillStyle = index === 0 ? "#00ff66" : "#00b348";
      context.fillRect(segment.x * cellSize + inset, segment.y * cellSize + inset, cellSize - inset * 2, cellSize - inset * 2);
    });

    const head = snake[0];
    if (head) {
      context.fillStyle = "#07130b";
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
    if (window.back2byteActiveGame === "snake") window.back2byteActiveGame = "";
    overlay.hidden = false;
    overlay.textContent = `${getTranslation("game.over") || "GAME OVER"} · ${score}`;
    refreshLabels();
  }

  window.back2byteSnakePause = () => {
    if (!isRunning) return;
    window.clearInterval(intervalId);
    intervalId = 0;
    isRunning = false;
    overlay.hidden = false;
    overlay.textContent = getTranslation("game.instructions") || "Clique em Jogar para começar";
    refreshLabels();
  };

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
    window.back2byteActiveGame = "snake";
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
    if (window.back2byteActiveGame && window.back2byteActiveGame !== "snake") return;
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
