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

// Backend API base – adjust port if you change it in server.js
const API_BASE = "http://localhost:4000";

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

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
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
      text: "VR fills fast on weekends – book at least 2 hours ahead.",
    },
    sim: {
      badge: "Time-attack slots",
      text: "Sim rigs reserved in 1-hour blocks for leaderboard runs.",
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
      const seat = pill.getAttribute("data-seat") || "pc";
      updateAvailability(seat);
    });
  });

  updateAvailability("pc");
}

function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const dateInput = document.getElementById("booking-date");
  if (dateInput) {
    const today = new Date();
    const offsetDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    dateInput.min = offsetDate.toISOString().split("T")[0];
    dateInput.value = offsetDate.toISOString().split("T")[0];
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const seatButton = form.querySelector(".pill.active");
    const seatType = seatButton?.dataset.seat || "pc";
    const date = form.querySelector("#booking-date")?.value;
    const time = form.querySelector("#booking-time")?.value;
    const duration = form.querySelector("#booking-duration")?.value;
    const players = form.querySelector("#players")?.value;
    const name = form.querySelector("#name")?.value;
    const email = form.querySelector("#email")?.value;

    const payload = {
      seatType,
      date,
      time,
      duration,
      players,
      name,
      email,
    };

    fetch(`${API_BASE}/api/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          throw new Error(data.error || "Booking failed");
        }

        const summary = [
          `Seat: ${seatType.toUpperCase()}`,
          `Date: ${date}`,
          `Time: ${time} (${duration}h)`,
          `Players: ${players}`,
        ].join(" • ");

        alert(
          `GG ${name || "player"}!\n\nYour booking has been sent to L1 staff:\n${summary}\n\nYou'll receive a confirmation from the team shortly.`
        );

        form.reset();
      })
      .catch((err) => {
        console.error(err);
        alert(
          "We couldn't reach the booking server. Please try again in a moment or call the cafe to confirm."
        );
      });
  });
}

function setupEventsSchedule() {
  const list = document.getElementById("eventSchedule");
  if (!list) return;

  const schedule = [
    {
      time: "Wednesday • 7:00 PM",
      title: "Valorant 5v5 Ranked Night",
      details: "Single-elim, best of 3. Member discounts on entry.",
    },
    {
      time: "Friday • 8:30 PM",
      title: "PS5 Party Royale",
      details: "FIFA, Mortal Kombat & party titles – drop-in brackets.",
    },
    {
      time: "Saturday • 6:00 PM",
      title: "Sim Racing Time Attack",
      details: "Gran Turismo 7 + Assetto Corsa. Fastest lap wins merch.",
    },
    {
      time: "Sunday • 4:00 PM",
      title: "Creator & Streamer Meetup",
      details: "Streaming pods, collab spaces and Q&A with local creators.",
    },
  ];

  list.innerHTML = schedule
    .map(
      (item) => `
      <li class="schedule-item">
        <span class="time">${item.time}</span>
        <span class="title">${item.title}</span>
        <span class="details">${item.details}</span>
      </li>
    `
    )
    .join("");
}

function setupTestimonials() {
  const body = document.getElementById("testimonialBody");
  const dotsContainer = document.getElementById("testimonialDots");
  const prevBtn = document.getElementById("prevTestimonial");
  const nextBtn = document.getElementById("nextTestimonial");

  if (!body || !dotsContainer || !prevBtn || !nextBtn) return;

  const testimonials = [
    {
      quote:
        "L1 feels like walking into a LAN final – the setups are insane and the staff actually understand competitive play.",
      name: "RogueNova",
      tag: "Immortal Valorant player",
    },
    {
      quote:
        "We hosted our company game night here and everyone keeps asking when we’re going back. The sim rigs were the star.",
      name: "Maya S.",
      tag: "Team Lead, Tech Startup",
    },
    {
      quote:
        "As a streamer, I love the dedicated pods and stable connection. I can go live from L1 without touching my home setup.",
      name: "ClipCity",
      tag: "Variety streamer",
    },
  ];

  let current = 0;
  let timer;

  const render = (index) => {
    const t = testimonials[index];
    body.innerHTML = `
      <p class="testimonial-quote">“${t.quote}”</p>
      <p class="testimonial-meta">${t.name} • ${t.tag}</p>
    `;

    dotsContainer.querySelectorAll(".testimonial-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  };

  dotsContainer.innerHTML = testimonials
    .map(() => `<span class="testimonial-dot"></span>`)
    .join("");

  dotsContainer.addEventListener("click", (e) => {
    const dot = e.target.closest(".testimonial-dot");
    if (!dot) return;
    const index = Array.from(dotsContainer.children).indexOf(dot);
    if (index === -1) return;
    current = index;
    render(current);
    restartAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    current = (current - 1 + testimonials.length) % testimonials.length;
    render(current);
    restartAutoPlay();
  });

  nextBtn.addEventListener("click", () => {
    current = (current + 1) % testimonials.length;
    render(current);
    restartAutoPlay();
  });

  const restartAutoPlay = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      current = (current + 1) % testimonials.length;
      render(current);
    }, 9000);
  };

  render(current);
  restartAutoPlay();
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    const payload = {
      name: document.getElementById("contact-name")?.value,
      email: document.getElementById("contact-email")?.value,
      subject: document.getElementById("contact-subject")?.value,
      phone: document.getElementById("contact-phone")?.value,
      message: document.getElementById("contact-message")?.value,
    };

    fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          throw new Error(data.error || "Contact failed");
        }
        status.textContent =
          "Message sent. We'll respond within one business day.";
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        status.textContent =
          "We couldn't reach the server. Please email or call us directly.";
      });
  });
}

function setupNewsletterForm() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletterEmail")?.value || "";
    if (!email) return;

    fetch(`${API_BASE}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) {
          throw new Error(data.error || "Newsletter failed");
        }
        alert(
          `You’re in! We'll send tournament and offer updates to ${email}.`
        );
        form.reset();
      })
      .catch((err) => {
        console.error(err);
        alert(
          "We couldn't reach the server to save your email. Please try again later."
        );
      });
  });
}

function setupTourModal() {
  const openBtn = document.getElementById("openTourModal");
  const closeBtn = document.getElementById("closeTourModal");
  const modal = document.getElementById("tourModal");

  if (!openBtn || !closeBtn || !modal) return;

  const backdrop = modal.querySelector(".modal-backdrop");

  const open = () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  };

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  backdrop?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      close();
    }
  });
}

function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

