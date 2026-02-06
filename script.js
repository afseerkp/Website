const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const revealEls = document.querySelectorAll("[data-reveal]");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const FORM_ENDPOINT =
  "https://docs.google.com/forms/d/e/1FAIpQLScOKGZV-8JpQu5xOUmXtgkybbYQB1_szXURxNGCWSHEBlWRiA/viewform?usp=publish-editor"; // Google Form target

const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");

function setTheme(mode) {
  if (mode === "light") {
    root.classList.add("light");
    themeToggle.innerHTML = '<span class="icon-moon" aria-hidden="true"></span>';
  } else {
    root.classList.remove("light");
    themeToggle.innerHTML = '<span class="icon-sun" aria-hidden="true"></span>';
  }
}

function loadTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    setTheme(saved);
    return;
  }
  setTheme(prefersLight.matches ? "light" : "dark");
}

function toggleTheme() {
  const next = root.classList.contains("light") ? "dark" : "light";
  localStorage.setItem("theme", next);
  setTheme(next);
}

loadTheme();
themeToggle?.addEventListener("click", toggleTheme);

prefersLight?.addEventListener("change", (event) => {
  const saved = localStorage.getItem("theme");
  if (saved) return;
  setTheme(event.matches ? "light" : "dark");
});

function handleReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

handleReveal();

async function handleContactSubmit(event) {
  event.preventDefault();
  if (!contactForm) return;

  if (formStatus) formStatus.textContent = "Sending...";

  const formData = new FormData(contactForm);
  const name = formData.get("name") || "";
  const email = formData.get("email") || "";
  const message = formData.get("message") || "";

  // Redirect to Google Form (cannot post directly without entry IDs)
  if (FORM_ENDPOINT.includes("docs.google.com/forms")) {
    if (formStatus) formStatus.textContent = "Opening Google Form...";
    window.open(FORM_ENDPOINT, "_blank", "noopener");
    if (formStatus) formStatus.textContent = "Form opened. Please submit there.";
    return;
  }

  // Fallback: open mail client with prefilled body
  if (formStatus) formStatus.textContent = "Opening email client...";
  const mailto = `mailto:mail@afseer.com?subject=Hello%20AFSEER&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`
  )}`;
  window.location.href = mailto;
  if (formStatus) formStatus.textContent = "If email didn't open, please send directly.";
  contactForm.reset();
}

contactForm?.addEventListener("submit", handleContactSubmit);
