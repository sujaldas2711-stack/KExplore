"use strict";

const EVENTS = [
  { id: 1, title: "CodeSprint 2026 Hackathon", category: "Tech", emoji: "💻", gradient: ["#6c4cf1", "#3b82f6"],
    date: "2026-12-05T09:00:00", venue: "Innovation Hub, Bengaluru", price: 0, seats: 200, featured: true,
    short: "24 hours of building, mentoring and prizes.",
    description: "Team up with fellow developers and build something amazing in 24 hours. Mentors from top companies, free meals, and prizes worth ₹2 lakh await the winners. Beginners are welcome!" },
  { id: 2, title: "AI & Machine Learning Summit", category: "Tech", emoji: "🤖", gradient: ["#0ea5e9", "#6366f1"],
    date: "2026-12-12T10:00:00", venue: "Convention Centre, Hyderabad", price: 499, seats: 350, featured: true,
    short: "Talks and workshops on practical AI.",
    description: "A full-day summit featuring keynotes, live demos and hands-on workshops covering generative AI, computer vision and responsible AI practices." },
  { id: 3, title: "Neon Nights Music Festival", category: "Music", emoji: "🎸", gradient: ["#ec4899", "#8b5cf6"],
    date: "2026-12-19T17:30:00", venue: "Open Arena, Mumbai", price: 1299, seats: 1500, featured: true,
    short: "Live bands, DJs and a night under the lights.",
    description: "Ten live acts across two stages, food trucks, art installations and a stunning light show. Gates open at 5:30 PM — come early for the best spots." },
  { id: 4, title: "City Marathon 10K", category: "Sports", emoji: "🏃", gradient: ["#10b981", "#06b6d4"],
    date: "2027-01-10T06:00:00", venue: "Marine Drive, Mumbai", price: 299, seats: 800, featured: false,
    short: "Run for health, run for fun.",
    description: "Join thousands of runners on a scenic 10K route. Every finisher receives a medal, a T-shirt and a post-race breakfast. Timing chips included." },
  { id: 5, title: "Startup Pitch Night", category: "Business", emoji: "🚀", gradient: ["#f59e0b", "#ef4444"],
    date: "2027-01-16T18:00:00", venue: "T-Hub, Hyderabad", price: 199, seats: 120, featured: false,
    short: "Watch founders pitch to real investors.",
    description: "Eight early-stage startups pitch live to a panel of investors. Stay after the pitches for open networking with founders, mentors and VCs." },
  { id: 6, title: "Classical Dance Evening", category: "Cultural", emoji: "💃", gradient: ["#f43f5e", "#f97316"],
    date: "2027-01-24T19:00:00", venue: "Kala Mandir, Kolkata", price: 350, seats: 400, featured: false,
    short: "An evening of Bharatanatyam and Kathak.",
    description: "Celebrated artists perform a curated programme of classical dance traditions, accompanied by live musicians. A perfect evening for the whole family." },
  { id: 7, title: "Web Design Workshop", category: "Workshop", emoji: "🎨", gradient: ["#8b5cf6", "#ec4899"],
    date: "2027-02-01T10:00:00", venue: "DesignLab, Pune", price: 0, seats: 60, featured: false,
    short: "Hands-on HTML, CSS & UI/UX crash course.",
    description: "Learn to design and build responsive websites from scratch. Bring your laptop — you'll leave with a deployed portfolio page and the confidence to keep building." },
  { id: 8, title: "Indie Film Screening", category: "Cultural", emoji: "🎬", gradient: ["#334155", "#6366f1"],
    date: "2027-02-07T16:00:00", venue: "Regal Cinema, Delhi", price: 250, seats: 180, featured: false,
    short: "Award-winning short films + director Q&A.",
    description: "Six award-winning independent short films followed by a live Q&A with the directors. Snacks and refreshments available at the venue." },
  { id: 9, title: "Cybersecurity Bootcamp", category: "Workshop", emoji: "🛡️", gradient: ["#0f766e", "#2563eb"],
    date: "2027-02-14T09:30:00", venue: "TechPark, Chennai", price: 799, seats: 80, featured: false,
    short: "Learn ethical hacking basics in a day.",
    description: "A practical introduction to ethical hacking, network security and CTF-style challenges guided by industry professionals. Basic computer knowledge required." }
];
EVENTS.forEach((e) => (e.image = `images/event-${e.id}.svg`));

const STORAGE_KEY = "eventora_registrations";
const THEME_KEY = "eventora_theme";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

const formatPrice = (p) => (p === 0 ? "Free" : "₹" + p.toLocaleString("en-IN"));
const upcoming = () => EVENTS.filter((e) => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
const getEvent = (id) => EVENTS.find((e) => e.id === Number(id));

function bannerStyle(ev) {
  return `background: linear-gradient(135deg, ${ev.gradient[0]}, ${ev.gradient[1]})`;
}


function loadRegs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveRegs(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }
  catch { showToast("Couldn't save to browser storage."); }
}


let activeCategory = "All";
let searchTerm = "";
let currentEventId = null;

const themeBtn = $("#theme-toggle");
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}
function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}
themeBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch {}
});

const menuBtn = $("#menu-toggle");
const navMenu = $("#nav-menu");
menuBtn.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "✕" : "☰";
});
navMenu.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    navMenu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  }
});

function renderFilters() {
  const cats = ["All", ...new Set(EVENTS.map((e) => e.category))];
  $("#filters").innerHTML = cats
    .map((c) => `<button class="chip ${c === activeCategory ? "active" : ""}" data-cat="${escapeHTML(c)}" aria-pressed="${c === activeCategory}">${escapeHTML(c)}</button>`)
    .join("");
}
$("#filters").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeCategory = chip.dataset.cat;
  renderFilters();
  renderEvents();
});

function renderEvents() {
  const term = searchTerm.trim().toLowerCase();
  const list = upcoming().filter((ev) => {
    const matchCat = activeCategory === "All" || ev.category === activeCategory;
    const hay = `${ev.title} ${ev.venue} ${ev.category} ${ev.short} ${ev.description}`.toLowerCase();
    return matchCat && (!term || hay.includes(term));
  });

  const grid = $("#event-grid");
  grid.innerHTML = list
    .map((ev) => `
      <article class="card">
        <div class="card-img" style="${bannerStyle(ev)}">
          ${ev.image ? `<img src="${escapeHTML(ev.image)}" alt="" loading="lazy" onerror="this.remove()" />` : ""}
          <span class="emoji" aria-hidden="true">${ev.emoji}</span>
          <span class="tag">${escapeHTML(ev.category)}</span>
          ${ev.featured ? '<span class="featured-flag">★ Featured</span>' : ""}
        </div>
        <div class="card-body">
          <h3>${escapeHTML(ev.title)}</h3>
          <div class="card-meta">
            <span>📅 ${formatDate(ev.date)}</span>
            <span>📍 ${escapeHTML(ev.venue)}</span>
          </div>
          <p class="card-desc">${escapeHTML(ev.short)}</p>
          <div class="card-foot">
            <span class="price">${formatPrice(ev.price)}</span>
            <button class="btn btn-primary btn-sm" data-open="${ev.id}">View & Register</button>
          </div>
        </div>
      </article>`)
    .join("");

  $("#empty-state").hidden = list.length > 0;
  $("#result-count").textContent = `Showing ${list.length} event${list.length === 1 ? "" : "s"}`;
}

$("#event-grid").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-open]");
  if (btn) openModal(btn.dataset.open);
});

let searchTimer;
$("#search").addEventListener("input", (e) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { searchTerm = e.target.value; renderEvents(); }, 150);
});
$("#reset-filters").addEventListener("click", () => {
  activeCategory = "All"; searchTerm = ""; $("#search").value = "";
  renderFilters(); renderEvents();
});


const modal = $("#event-modal");
const form = $("#reg-form");

function openModal(id) {
  const ev = getEvent(id);
  if (!ev) return;
  currentEventId = ev.id;

  const hero = $("#modal-hero");
  hero.style.cssText = bannerStyle(ev);
  hero.innerHTML = (ev.image ? `<img src="${escapeHTML(ev.image)}" alt="" onerror="this.remove()" />` : "") +
    `<span class="emoji" aria-hidden="true">${ev.emoji}</span>`;

  $("#modal-category").textContent = ev.category;
  $("#modal-title").textContent = ev.title;
  $("#modal-date").textContent = formatDate(ev.date);
  $("#modal-venue").textContent = ev.venue;
  $("#modal-price").textContent = formatPrice(ev.price);
  $("#modal-seats").textContent = `${ev.seats.toLocaleString("en-IN")} seats available`;
  $("#modal-desc").textContent = ev.description;

  $("#f-event").innerHTML = '<option value="">— Select an event —</option>' +
    upcoming().map((u) => `<option value="${u.id}" ${u.id === ev.id ? "selected" : ""}>${escapeHTML(u.title)}</option>`).join("");

  form.reset();
  $("#f-event").value = String(ev.id);
  $$(".field", form).forEach((f) => f.classList.remove("valid", "invalid"));
  $$(".error", form).forEach((e) => (e.textContent = ""));
  $("#form-view").hidden = false;
  $("#success-view").hidden = true;

  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}

function closeModal() { if (modal.open) modal.close(); }
$("#modal-close").addEventListener("click", closeModal);
$("#success-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); }); // click on backdrop


$("#f-event").addEventListener("change", (e) => {
  if (e.target.value) openModalKeepForm(e.target.value);
});
function openModalKeepForm(id) {
  const values = { name: $("#f-name").value, email: $("#f-email").value, phone: $("#f-phone").value };
  openModal(id);
  $("#f-name").value = values.name; $("#f-email").value = values.email; $("#f-phone").value = values.phone;
}

const validators = {
  name(v) {
    v = v.trim();
    if (!v) return "Please enter your full name.";
    if (v.length < 2) return "Name must be at least 2 characters.";
    if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(v)) return "Name can only contain letters, spaces, . ' and -";
    return "";
  },
  email(v) {
    v = v.trim();
    if (!v) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email (e.g. you@example.com).";
    return "";
  },
  phone(v) {
    const digits = v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, "");
    if (!v.trim()) return "Please enter your phone number.";
    if (!/^\d+$/.test(digits)) return "Phone number can only contain digits.";
    if (!/^[6-9]\d{9}$/.test(digits)) return "Enter a valid 10-digit mobile number.";
    return "";
  },
  event(v) { return v ? "" : "Please select an event."; }
};

function validateField(name) {
  const input = form.elements[name];
  const msg = validators[name](input.value);
  const field = input.closest(".field");
  $(`#e-${name}`).textContent = msg;
  field.classList.toggle("invalid", !!msg);
  field.classList.toggle("valid", !msg);
  input.setAttribute("aria-invalid", String(!!msg));
  return !msg;
}

["name", "email", "phone", "event"].forEach((n) => {
  form.elements[n].addEventListener("blur", () => validateField(n));
  form.elements[n].addEventListener("input", () => {
    if (form.elements[n].closest(".field").classList.contains("invalid")) validateField(n);
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const results = ["name", "email", "phone", "event"].map(validateField);
  if (results.includes(false)) {
    const firstBad = $(".field.invalid input, .field.invalid select", form);
    if (firstBad) firstBad.focus();
    return;
  }

  const ev = getEvent(form.elements.event.value);
  const email = form.elements.email.value.trim().toLowerCase();
  const regs = loadRegs();

  if (regs.some((r) => r.eventId === ev.id && r.email === email)) {
    const f = form.elements.email.closest(".field");
    f.classList.add("invalid"); f.classList.remove("valid");
    $("#e-email").textContent = "This email is already registered for this event.";
    return;
  }

  const reg = {
    ref: "EVT-" + Date.now().toString(36).toUpperCase().slice(-6),
    eventId: ev.id,
    name: form.elements.name.value.trim(),
    email,
    phone: form.elements.phone.value.trim(),
    registeredAt: new Date().toISOString()
  };
  regs.push(reg);
  saveRegs(regs);

  $("#success-msg").textContent = `Thanks ${reg.name}! You're registered for "${ev.title}" on ${formatDate(ev.date)}. A confirmation has been noted for ${reg.email}.`;
  $("#success-ref").textContent = `Booking reference: ${reg.ref}`;
  $("#form-view").hidden = true;
  $("#success-view").hidden = false;

  renderRegistrations();
});

function renderRegistrations() {
  const regs = loadRegs();
  const list = $("#reg-list");
  $("#reg-count").textContent = regs.length;
  $("#clear-regs").hidden = regs.length === 0;

  if (!regs.length) {
    list.innerHTML = '<div class="reg-empty">You haven\'t registered for any events yet. Pick one above to get started! 🎟️</div>';
    return;
  }

  list.innerHTML = regs
    .slice().reverse()
    .map((r) => {
      const ev = getEvent(r.eventId);
      return `
        <div class="reg-item">
          <div>
            <h3>${escapeHTML(ev ? ev.title : "Event")}</h3>
            <p>${ev ? formatDate(ev.date) + " · " + escapeHTML(ev.venue) : ""}</p>
            <p>${escapeHTML(r.name)} · ${escapeHTML(r.email)} · Ref: <strong>${escapeHTML(r.ref)}</strong></p>
          </div>
          <button class="btn btn-ghost btn-sm" data-cancel="${escapeHTML(r.ref)}">Cancel</button>
        </div>`;
    })
    .join("");
}

$("#reg-list").addEventListener("click", (e) => {
  const btn = e.target.closest("[data-cancel]");
  if (!btn) return;
  saveRegs(loadRegs().filter((r) => r.ref !== btn.dataset.cancel));
  renderRegistrations();
  showToast("Registration cancelled.");
});

$("#clear-regs").addEventListener("click", () => {
  if (confirm("Remove all your registrations from this browser?")) {
    saveRegs([]);
    renderRegistrations();
    showToast("All registrations cleared.");
  }
});

let countdownTimer;
function initCountdown() {
  const next = upcoming()[0];
  const nameEl = $("#next-event-name");
  if (!next) {
    nameEl.textContent = "No upcoming events";
    $("#next-event-meta").textContent = "Check back soon!";
    $("#next-event-btn").hidden = true;
    return;
  }
  nameEl.textContent = next.title;
  $("#next-event-meta").textContent = `${formatDate(next.date)} · ${next.venue}`;
  $("#next-event-btn").onclick = () => openModal(next.id);

  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const diff = new Date(next.date) - new Date();
    if (diff <= 0) { clearInterval(countdownTimer); initCountdown(); renderEvents(); return; }
    $("#cd-days").textContent = pad(Math.floor(diff / 864e5));
    $("#cd-hours").textContent = pad(Math.floor((diff % 864e5) / 36e5));
    $("#cd-mins").textContent = pad(Math.floor((diff % 36e5) / 6e4));
    $("#cd-secs").textContent = pad(Math.floor((diff % 6e4) / 1e3));
  };
  clearInterval(countdownTimer);
  tick();
  countdownTimer = setInterval(tick, 1000);
}

let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("visible")); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

initTheme();
renderFilters();
renderEvents();
renderRegistrations();
initCountdown();
initReveal();
