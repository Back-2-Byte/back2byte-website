document.documentElement.classList.add("js");

const languageButton = document.getElementById("langToggle");
const themeButton = document.getElementById("themeToggle");
const menuButton = document.getElementById("menuToggle");
const navigation = document.getElementById("primaryNav");
const contactForm = document.getElementById("contactForm");
let translations;
let currentLanguage = "pt";

function getTranslation(path) {
  return path.split(".").reduce((value, part) => value?.[part], translations?.translations?.[currentLanguage]);
}

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const value = getTranslation(element.dataset.i18n);
    if (typeof value !== "string") {
      console.error(`Missing translation "${element.dataset.i18n}" for "${language}".`);
      return;
    }

    element.textContent = value;
  });
  languageButton.textContent = language === "pt" ? "EN" : "PT";
  languageButton.setAttribute("aria-label", getTranslation(language === "pt" ? "ui.switchToEnglish" : "ui.switchToPortuguese"));
  themeButton.setAttribute("aria-label", getTranslation(document.documentElement.dataset.theme === "light" ? "ui.switchToDark" : "ui.switchToLight"));
  menuButton.setAttribute("aria-label", getTranslation(menuButton.getAttribute("aria-expanded") === "true" ? "ui.closeMenu" : "ui.openMenu"));
  navigation.setAttribute("aria-label", getTranslation("ui.primaryNavigation"));
  document.querySelectorAll(".brand[aria-label]").forEach((brand) => brand.setAttribute("aria-label", getTranslation("ui.brandHome")));
}

async function loadTranslations() {
  const response = await fetch("content.json");
  if (!response.ok) {
    throw new Error(`Could not load content.json (${response.status} ${response.statusText}).`);
  }
  translations = await response.json();
  currentLanguage = translations.meta?.defaultLanguage;
  if (!translations.translations?.[currentLanguage]) {
    throw new Error(`The default language "${currentLanguage}" is missing from content.json.`);
  }
  applyLanguage(currentLanguage);
  languageButton.disabled = false;
}

loadTranslations().catch((error) => {
  console.error("The website translations could not be loaded. Serve the site over HTTP to enable language switching.", error);
});

languageButton.addEventListener("click", () => {
  if (translations) applyLanguage(currentLanguage === "pt" ? "en" : "pt");
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
window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
  dot.style.left = `${event.clientX}px`;
  dot.style.top = `${event.clientY}px`;
}, { passive: true });

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
  window.location.href = `mailto:hello@back2byte.com?subject=${subject}&body=${encodeURIComponent(message)}`;
});

document.getElementById("currentYear").textContent = new Date().getFullYear();
