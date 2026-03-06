// Footer year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Email copy logic
const emailLink = document.getElementById("inline-email-address");
const emailCopyBtn = document.getElementById("inline-email-copy");
const emailStatus = document.getElementById("inline-email-status");
const emailCopyText = document.getElementById("inline-email-copy-text");

if (emailLink && emailCopyBtn && emailStatus && emailCopyText) {
  const email = emailLink.textContent.trim();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      emailCopyText.textContent = "Copied";
      emailStatus.classList.add("visible");
      emailCopyBtn.classList.add("copied");

      setTimeout(() => {
        emailCopyText.textContent = "Copy";
        emailStatus.classList.remove("visible");
        emailCopyBtn.classList.remove("copied");
      }, 1400);
    } catch (err) {
      console.error("Copy failed", err);
      emailCopyText.textContent = "Error";
      setTimeout(() => {
        emailCopyText.textContent = "Copy";
      }, 1200);
    }
  }

  emailCopyBtn.addEventListener("click", copyEmail);
}

// Scroll reveal animations
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("visible"));
}

// Staggered reveal for cards
const cardGroups = document.querySelectorAll(".cards");

if ("IntersectionObserver" in window) {
  cardGroups.forEach((group) => {
    const cards = group.querySelectorAll(".card");
    if (!cards.length) return;

    const cardObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              card.style.transition =
                "opacity 0.6s ease-out, transform 0.6s ease-out";
              card.style.opacity = "0";
              card.style.transform = "translateY(12px)";
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, index * 70);
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    cardObserver.observe(cards[0]);
  });
}

// Theme menu: light / dark / system
const htmlEl = document.documentElement;
const themeMenu = document.querySelector(".theme-menu");
const themeMenuToggle = document.querySelector(".theme-menu-toggle");
const themeMenuPanel = document.querySelector(".theme-menu-panel");
const themeButtons = document.querySelectorAll(".theme-menu-panel [data-theme-option]");
const themeIcon = document.getElementById("theme-icon");

// Theme-dependent icons (Git / GitHub etc.)
function updateThemeIcons(theme) {
  let effectiveTheme = theme;
  if (theme === "system") {
    effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  const isLight = effectiveTheme === "light";

  document
    .querySelectorAll("[data-icon-dark][data-icon-light]")
    .forEach((img) => {
      const lightSrc = img.getAttribute("data-icon-light");
      const darkSrc = img.getAttribute("data-icon-dark");
      img.src = isLight ? lightSrc : darkSrc;
    });
}

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  updateThemeIcons(theme);

  try {
    localStorage.setItem("theme-preference", theme);
  } catch (e) {}

  themeButtons.forEach((btn) => {
    const isActive = btn.getAttribute("data-theme-option") === theme;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });

  if (themeIcon) {
    themeIcon.textContent = theme === "light" ? "☼" : "☾";
  }
}

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem("theme-preference");
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch (e) {}
  return "system";
}

applyTheme(getPreferredTheme());

if (themeMenuToggle && themeMenuPanel) {
  themeMenuToggle.addEventListener("click", () => {
    const isOpen = themeMenuPanel.classList.toggle("open");
    themeMenuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-theme-option");
    if (!choice) return;
    applyTheme(choice);
    if (themeMenuPanel) {
      themeMenuPanel.classList.remove("open");
      themeMenuToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

document.addEventListener("click", (e) => {
  if (!themeMenu || !themeMenuPanel) return;
  if (!themeMenu.contains(e.target)) {
    themeMenuPanel.classList.remove("open");
    themeMenuToggle?.setAttribute("aria-expanded", "false");
  }
});

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
if (mediaQuery && typeof mediaQuery.addEventListener === "function") {
  mediaQuery.addEventListener("change", () => {
    if (getPreferredTheme() === "system") {
      applyTheme("system");
    }
  });
}

// Scroll-to-top button
const scrollTopBtn = document.getElementById("scroll-top");

if (scrollTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.45) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Typing effect in hero
const typingPhrases = [
  "Windows 11 & Windows Server 2025 labs.",
  "small networks that just work.",
  "Python & Bash scripts that save time.",
  "simple, fast landing pages.",
  "AI workflows that answer common questions."
];
const typingEl = document.getElementById("typing-text");
let phraseIndex = 0;
let charIndex = 0;
let typingDirection = 1;

function runTyping() {
  if (!typingEl) return;
  const phrase = typingPhrases[phraseIndex];

  if (typingDirection === 1) {
    charIndex++;
    if (charIndex === phrase.length + 6) {
      typingDirection = -1;
      setTimeout(runTyping, 450);
      return;
    }
  } else {
    charIndex--;
    if (charIndex <= 0) {
      typingDirection = 1;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
  }

  typingEl.textContent = phrase.slice(
    0,
    Math.max(0, Math.min(charIndex, phrase.length))
  );
  const delay = typingDirection === 1 ? 55 : 25;
  setTimeout(runTyping, delay);
}

if (typingEl) runTyping();
