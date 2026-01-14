// L1 Gaming Cafe – Interaction Layer

document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  setupSmoothScroll();
  setupScrollReveal();
  setupSeatSelector();
  setupBookingForm();
  setupEventsSchedule();
  setupTestimonials();
  setupContactForm();
  setupNewsletterForm();
  setupTourModal();
  setCurrentYear();
});

// ✅ CORRECT API BASE FOR VERCEL + LOCALHOST
const API_BASE = window.location.origin;

function setupNav() {
  const nav = document.querySelector(".main-nav");
  const toggle = document.querySelector(".nav-toggle");

  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("nav-open");
  });

  nav.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link) return;
    nav.classList.remove("nav-open");
  });
}

function setupSmoothScroll() {
  const triggers = document.querySelectorAll("[data-scroll-target], a[href^='#']");

  triggers.forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetId =
        el.getAttribute("data-scroll-target") || el.getAttribute("href");

      if (!targetId || !targetId.startsWith("#")) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const topOffset = document.querySelector(".site-header")?.offsetHeight || 0;
      const rect = target.getBoundingClientRect();
      const offset = rect.top + window.scrollY - (topOffset + 12);

      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });
}

function setupScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || !revealEls.length) {
    revealEls.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

function setupSeatSelector() {
  const pills = document.querySelectorAll(".pill-options .pill");
  const availability = document.getElementById("availabilityStatus");
  if (!pills.length || !availability) return;

  const messages = {
    pc: {
      badge: "High availability",
      text: "Best value between 4PM and 8PM in the PC arena.",
    },
    console: {
      badge: "Popular tonight",
      text: "Prime slots after 7PM for co-op and party games.",
    },
    vr: {
      badge: "Limited pods",
      text: "VR fills fast on weekends – book early.",
    },
    sim: {
      badge: "Time-attack slots",
      text: "Sim rigs reserved in 1-hour blocks.",
    },
  };

  const updateAvailability = (seat) => {
    const info = messages[seat] || messages.pc;
    availability.innerHTML = `
      <span class="badge badge-good">${info.badge}</span>
      <p>${info.text}</p>
    `;
  };

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      updateAvailability(pill.dataset.seat || "pc");
    });
  });

  updateAvailability("pc");
}

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      seatType: form.querySelector(".pill.active")?.dataset.seat || "pc",
      date: form.querySelector("#booking-date")?.value,
      time: form.querySelector("#booking-time")?.value,
      duration: form.querySelector("#booking-duration")?.value,
      players: form.querySelector("#players")?.value,
      name: form.querySelector("#name")?.value,
      email: form.querySelector("#email")?.value,
    };

    try {
      const res = await fetch(`${API_BASE}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.ok) throw new Error();

      alert("🎮 Booking sent successfully! Check your email.");
      form.reset();
    } catch {
      alert(
        "We couldn't reach the booking server. Please try again or call the cafe."
      );
    }
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("contact-name")?.value,
      email: document.getElementById("contact-email")?.value,
      subject: document.getElementById("contact-subject")?.value,
      phone: document.getElementById("contact-phone")?.value,
      message: document.getElementById("contact-message")?.value,
    };

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.ok) throw new Error();

      status.textContent = "Message sent successfully!";
      form.reset();
    } catch {
      status.textContent =
        "Server unreachable. Please email or call us directly.";
    }
  });
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail")?.value;
    if (!email) return;

    try {
      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error();

      alert("✅ Newsletter subscription successful!");
      form.reset();
    } catch {
      alert("Newsletter service unavailable.");
    }
  });
}

function setupTourModal() {
  const modal = document.getElementById("tourModal");
  const openBtn = document.getElementById("openTourModal");
  const closeBtn = document.getElementById("closeTourModal");
  if (!modal || !openBtn || !closeBtn) return;

  openBtn.onclick = () => modal.classList.add("show");
  closeBtn.onclick = () => modal.classList.remove("show");
}

function setupEventsSchedule() {}
function setupTestimonials() {}

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
