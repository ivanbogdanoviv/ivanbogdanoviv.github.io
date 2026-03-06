// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Inline email copy: button only, email text stays fixed
const inlineCopyBtn = document.getElementById("inline-email-copy");
const inlineCopyText = document.querySelector(".inline-email-copy-text");
const inlineEmailAddress = document.getElementById("inline-email-address");

if (inlineCopyBtn && inlineCopyText && inlineEmailAddress) {
  const emailText = inlineEmailAddress.textContent.trim();
  const originalText = inlineCopyText.textContent;

  inlineCopyBtn.addEventListener("mouseenter", () => {
    if (!inlineCopyBtn.classList.contains("copied")) {
      inlineCopyText.textContent = "Copy";
    }
  });

  inlineCopyBtn.addEventListener("mouseleave", () => {
    if (!inlineCopyBtn.classList.contains("copied")) {
      inlineCopyText.textContent = originalText;
    }
  });

  inlineCopyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      inlineCopyBtn.classList.add("copied");
      inlineCopyText.textContent = "Copied!";
      setTimeout(() => {
        inlineCopyBtn.classList.remove("copied");
        inlineCopyText.textContent = originalText;
      }, 1400);
    } catch (err) {
      console.error("Copy failed", err);
    }
  });
}

// Scroll reveal animations
const revealElements = document.querySelectorAll(".reveal");

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

// Staggered reveal for cards
const cardGroups = document.querySelectorAll(".cards");

cardGroups.forEach((group) => {
  const cards = group.querySelectorAll(".card");
  const cardObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            card.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";
            card.style.opacity = "0";
            card.style.transform = "translateY(18px)";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, index * 80);
          });
          obs.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  if (cards.length) {
    cardObserver.observe(cards[0]);
  }
});

// Theme menu: light / dark / system
const htmlEl = document.documentElement;
const themeMenu = document.querySelector(".theme-menu");
const themeMenuToggle = document.querySelector(".theme-menu-toggle");
const themeMenuPanel = document.querySelector(".theme-menu-panel");
const themeButtons = document.querySelectorAll(".theme-menu-panel [data-theme-option]");
const themeIcon = document.getElementById("theme-icon");

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  localStorage.setItem("theme-preference", theme);

  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-theme-option") === theme);
  });

  // Icon: ☼ for light, ☾ for dark/system
  if (theme === "light") {
    themeIcon.textContent = "☼";
  } else {
    themeIcon.textContent = "☾";
  }
}

function getPreferredTheme() {
  const stored = localStorage.getItem("theme-preference");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

// Init theme on load
applyTheme(getPreferredTheme());

// Toggle panel open/close
themeMenuToggle.addEventListener("click", () => {
  themeMenuPanel.classList.toggle("open");
});

// Handle option clicks
themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-theme-option");
    applyTheme(choice);
    themeMenuPanel.classList.remove("open");
  });
});

// Close panel when clicking outside
document.addEventListener("click", (e) => {
  if (!themeMenu.contains(e.target)) {
    themeMenuPanel.classList.remove("open");
  }
});

// Update if system preference changes and current mode is "system"
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (getPreferredTheme() === "system") {
    applyTheme("system");
  }
});

// Scroll-to-top button
const scrollTopBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > window.innerHeight * 0.6) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Typing effect in hero
const typingPhrases = [
  "fixing slow Windows and Linux machines.",
  "setting up small networks that just work.",
  "writing Python & Bash scripts to save time.",
  "building simple, fast websites.",
  "connecting AI tools into your workflow."
];
const typingEl = document.getElementById("typing-text");
let phraseIndex = 0;
let charIndex = 0;
let typingDirection = 1; // 1 = forward, -1 = delete

function runTyping() {
  const phrase = typingPhrases[phraseIndex];

  if (typingDirection === 1) {
    charIndex++;
    if (charIndex === phrase.length + 8) {
      typingDirection = -1;
      setTimeout(runTyping, 500);
      return;
    }
  } else {
    charIndex--;
    if (charIndex <= 0) {
      typingDirection = 1;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
    }
  }

  typingEl.textContent = phrase.slice(0, Math.max(0, Math.min(charIndex, phrase.length)));
  const delay = typingDirection === 1 ? 55 : 25;
  setTimeout(runTyping, delay);
}

if (typingEl) runTyping();
