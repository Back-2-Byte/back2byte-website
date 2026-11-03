function getBrowserLanguage() {
  const preferredLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const locale of preferredLanguages) {
    const language = locale?.split("-")[0].toLowerCase();
    if (language === "pt" || language === "es" || language === "en") return language;
  }
  return "en";
}

const pathname = (window.location.pathname || "/").toLowerCase();
if (pathname === "/" || pathname === "/index.html") {
  const localePaths = { en: "/en/", es: "/es/", pt: "/pt/" };
  const targetPath = localePaths[getBrowserLanguage()];
  window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`);
}

document.documentElement.classList.add("js");

const languageButtons = [...document.querySelectorAll(".language-toggle")];
const themeButton = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuToggle");
const navigation = document.getElementById("primaryNav");
const contactForm = document.getElementById("contactForm");
const byteCanvas = document.getElementById("byteCanvas");
let translations;

function getCurrentLanguage() {
  const pathname = (window.location.pathname || "/").toLowerCase();
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  return "pt";
}

function getContentPath() {
  const pathname = (window.location.pathname || "/").toLowerCase();
  return pathname === "/en" || pathname.startsWith("/en/") || pathname === "/es" || pathname.startsWith("/es/") || pathname === "/pt" || pathname.startsWith("/pt/") ? "../content.json" : "content.json";
}

function getTranslation(path) {
  return path.split(".").reduce((value, part) => value?.[part], translations?.translations?.[currentLanguage]);
}

function setSeoMetadata(language) {
  const seoByLanguage = {
    en: {
      title: "Back2Byte Interactive | Game Development & B2B Solutions",
      description: "Game development, co-development, porting, performance optimization, and corporate gamification. We build interactive solutions for businesses, publishers, and game studios.",
      canonical: "https://back2byte.com/en/",
      locale: "en_US"
    },
    es: {
      title: "Back2Byte Interactive | Desarrollo de juegos y soluciones B2B",
      description: "Desarrollo de juegos, co-development, porting, optimización de rendimiento y gamificación corporativa. Creamos soluciones interactivas para empresas, publishers y estudios.",
      canonical: "https://back2byte.com/es/",
      locale: "es_ES"
    },
    pt: {
      title: "Back2Byte Interactive | Desenvolvimento de Games e Soluções B2B",
      description: "Desenvolvimento de jogos, co-development, porting, otimização e gamificação corporativa. Soluções tecnológicas e experiências interativas para empresas e estúdios.",
      canonical: "https://back2byte.com/pt/",
      locale: "pt_BR"
    }
  };

  const metadata = seoByLanguage[language] || seoByLanguage.en;
  document.title = metadata.title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", metadata.description);

  const canonicalMeta = document.querySelector('link[rel="canonical"]');
  if (canonicalMeta) canonicalMeta.setAttribute("href", metadata.canonical);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", metadata.title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", metadata.description);

  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute("content", metadata.locale);

  const alternateLanguages = {
    en: "https://back2byte.com/en/",
    es: "https://back2byte.com/es/",
    pt: "https://back2byte.com/pt/"
  };

  document.querySelectorAll('link[hreflang]').forEach((link) => {
    const hreflang = link.getAttribute("hreflang");
    if (hreflang && alternateLanguages[hreflang]) {
      link.setAttribute("href", alternateLanguages[hreflang]);
    }
  });

  const xDefault = document.querySelector('link[hreflang="x-default"]');
  if (xDefault) xDefault.setAttribute("href", "https://back2byte.com/");
}

function applyLanguage(language) {
  currentLanguage = language;
  if (window.localStorage) {
    window.localStorage.setItem("back2byte-language", language);
  }

  document.documentElement.lang = language === "pt" ? "pt-BR" : language === "es" ? "es-ES" : "en";
  setSeoMetadata(language);

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
    const localePaths = {
      en: "/en/",
      es: "/es/",
      pt: "/pt/"
    };
    const targetPath = localePaths[selectedLanguage] || "/";
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

document.getElementById("currentYear").textContent = new Date().getFullYear();

function initializeHeroGame() {
  const hero = document.getElementById("inicio");
  const gameLayer = document.getElementById("heroGameLayer");
  const counter = document.getElementById("bugsCount");
  if (!hero || !gameLayer || !counter) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bugs = [];
  const pointer = { x: 0, y: 0, inside: false };
  let devoured = 0;
  let visible = false;
  let animationFrame = 0;
  let lastFrameTime = 0;
  let biteTimeout;

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function placeBug(bug) {
    bug.element.style.left = `${bug.x}px`;
    bug.element.style.top = `${bug.y}px`;
  }

  function createBug() {
    const width = Math.max(1, hero.clientWidth);
    const height = Math.max(1, hero.clientHeight);
    const minY = Math.min(110, height / 2);
    const maxY = Math.max(minY, height - 65);
    const bug = {
      element: document.createElement("span"),
      x: randomBetween(width * .55, width * .94),
      y: randomBetween(minY, maxY),
      vx: reduceMotion ? 0 : randomBetween(-32, 32),
      vy: reduceMotion ? 0 : randomBetween(-23, 23),
      eaten: false,
    };

    bug.element.className = "hero-bug";
    gameLayer.append(bug.element);
    placeBug(bug);
    bugs.push(bug);
  }

  function createBurst(x, y) {
    const particleCount = 12;
    for (let index = 0; index < particleCount; index += 1) {
      const particle = document.createElement("span");
      const angle = (Math.PI * 2 * index) / particleCount;
      const distance = randomBetween(22, 38);
      particle.className = "hero-particle";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
      gameLayer.append(particle);
      window.setTimeout(() => particle.remove(), 480);
    }
  }

  function devour(bug) {
    if (bug.eaten) return;
    bug.eaten = true;
    bug.element.classList.add("is-devoured");
    devoured += 1;
    counter.textContent = String(devoured);
    createBurst(bug.x, bug.y);
    if (dot) {
      dot.classList.add("is-mouth", "is-visible");
      dot.classList.add("is-closed");
      window.clearTimeout(biteTimeout);
      biteTimeout = window.setTimeout(() => dot.classList.remove("is-closed"), 150);
    }
    window.setTimeout(() => {
      bug.element.remove();
      const index = bugs.indexOf(bug);
      if (index !== -1) bugs.splice(index, 1);
      createBug();
    }, 240);
  }

  function checkCollisions() {
    if (!pointer.inside) return;
    bugs.forEach((bug) => {
      if (bug.eaten) return;
      const distance = Math.hypot(bug.x - pointer.x, bug.y - pointer.y);
      if (distance < 24) devour(bug);
    });
  }

  function updatePointer(event) {
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.inside = true;

    if (event.pointerType !== "touch" && dot) {
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      dot.classList.add("is-mouth", "is-visible");
      dot.classList.remove("is-tracker", "is-target");
    }

    checkCollisions();
  }

  function animate(timestamp) {
    animationFrame = 0;
    if (!visible || document.visibilityState === "hidden") return;
    const delta = lastFrameTime ? Math.min((timestamp - lastFrameTime) / 1000, .05) : 0;
    lastFrameTime = timestamp;

    if (!reduceMotion) {
      const width = hero.clientWidth;
      const height = hero.clientHeight;
      bugs.forEach((bug) => {
        if (bug.eaten) return;
        bug.x += bug.vx * delta;
        bug.y += bug.vy * delta;
        if (bug.x < 14 || bug.x > width - 14) bug.vx *= -1;
        if (bug.y < 14 || bug.y > height - 14) bug.vy *= -1;
        bug.x = Math.min(width - 14, Math.max(14, bug.x));
        bug.y = Math.min(height - 14, Math.max(14, bug.y));
        placeBug(bug);
      });
    }

    checkCollisions();
    animationFrame = window.requestAnimationFrame(animate);
  }

  function syncAnimation() {
    const shouldAnimate = visible && document.visibilityState !== "hidden" && !reduceMotion;
    if (shouldAnimate && !animationFrame) {
      lastFrameTime = 0;
      animationFrame = window.requestAnimationFrame(animate);
    } else if (!shouldAnimate && animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }
  }

  for (let index = 0; index < 7; index += 1) createBug();

  window.addEventListener("resize", () => {
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    bugs.forEach((bug) => {
      bug.x = Math.min(width - 14, Math.max(14, bug.x));
      bug.y = Math.min(height - 14, Math.max(14, bug.y));
      placeBug(bug);
    });
  }, { passive: true });

  hero.addEventListener("pointerenter", updatePointer);
  hero.addEventListener("pointermove", updatePointer, { passive: true });
  hero.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "touch") {
      pointer.inside = false;
      if (dot) dot.classList.remove("is-bite");
    }
  });
  hero.addEventListener("pointerdown", updatePointer);
  document.addEventListener("visibilitychange", syncAnimation);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    }, { rootMargin: "40px" });
    observer.observe(hero);
  } else {
    visible = true;
    syncAnimation();
  }
}

initializeHeroGame();
