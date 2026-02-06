// Mobile nav toggle
const toggle = document.querySelector(".nav__toggle");
const nav = document.querySelector("[data-nav]");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close mobile nav when clicking a link
nav?.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

// Counter animation on load (simple)
const counters = document.querySelectorAll("[data-counter]");
counters.forEach(el => {
  const target = Number(el.dataset.counter || 0);
  let current = 0;
  const steps = 40;
  const inc = Math.max(1, Math.round(target / steps));

  const tick = () => {
    current += inc;
    if (current >= target) {
      el.textContent = target;
      return;
    }
    el.textContent = current;
    requestAnimationFrame(tick);
  };
  tick();
});

function updateSATime() {
  const now = new Date();

  const options = {
    timeZone: "Africa/Johannesburg",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };

  const time = new Intl.DateTimeFormat("en-ZA", options).format(now);
  const el = document.getElementById("sa-time");

  if (el) el.textContent = time;
}

// Run immediately + update every second
updateSATime();
setInterval(updateSATime, 1000);

// Work filters
const filterButtons = document.querySelectorAll(".filter");
const workItems = document.querySelectorAll(".work");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");

    const filter = btn.dataset.filter;
    workItems.forEach(item => {
      const tags = (item.dataset.tags || "").split(" ");
      const show = filter === "all" || tags.includes(filter);
      item.style.display = show ? "block" : "none";
    });
  });
});

// Testimonials slider
const quotes = document.querySelectorAll(".quote");
let quoteIndex = 0;

function showQuote(i) {
  quotes.forEach(q => q.classList.remove("is-active"));
  quotes[i].classList.add("is-active");
}

document.getElementById("prev")?.addEventListener("click", () => {
  if (!quotes.length) return;
  quoteIndex = (quoteIndex - 1 + quotes.length) % quotes.length;
  showQuote(quoteIndex);
});

document.getElementById("next")?.addEventListener("click", () => {
  if (!quotes.length) return;
  quoteIndex = (quoteIndex + 1) % quotes.length;
  showQuote(quoteIndex);
});

// Modals
document.querySelectorAll("[data-modal]").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-modal");
    const modal = document.getElementById(id);
    modal?.showModal();
  });
});

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest("dialog")?.close();
  });
});

document.querySelectorAll("dialog.modal").forEach(modal => {
  modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) modal.close();
  });
});

// Contact form validation (frontend only)
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

function setError(name, msg) {
  const err = document.querySelector(`[data-error="${name}"]`);
  if (err) err.textContent = msg || "";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl && (statusEl.textContent = "");

  const data = new FormData(form);
  const name = (data.get("name") || "").toString().trim();
  const email = (data.get("email") || "").toString().trim();
  const service = (data.get("service") || "").toString().trim();
  const message = (data.get("message") || "").toString().trim();

  let ok = true;

  setError("name", "");
  setError("email", "");
  setError("service", "");
  setError("message", "");

  if (name.length < 2) { setError("name", "Please enter your name."); ok = false; }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) { setError("email", "Please enter a valid email."); ok = false; }

  if (!service) { setError("service", "Please select a service."); ok = false; }

  if (message.length < 10) { setError("message", "Please add a short message (10+ chars)."); ok = false; }

  if (!ok) return;

  // If a real form action exists (e.g., Formspree), submit it via fetch.
  const hasAction = form.getAttribute("action") && form.getAttribute("action").trim().length > 0;

  if (hasAction) {
    statusEl && (statusEl.textContent = "Sending...");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        statusEl && (statusEl.textContent = "Thanks! Your message has been sent.");
        form.reset();
      } else {
        statusEl && (statusEl.textContent = "Oops — something went wrong. Please try again.");
      }
    } catch (err) {
      statusEl && (statusEl.textContent = "Network error — please check your connection and try again.");
    }

    return;
  }

  // Demo success (replace with real backend later)
  statusEl && (statusEl.textContent = "✅ Message sent!");
  form.reset();
});

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
