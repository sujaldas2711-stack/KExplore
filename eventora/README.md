# ✦ Eventora – Responsive Event Management Website

A modern, fully responsive event management website built for the **K Explore – Web Designing** challenge. Users can explore upcoming events, search and filter them, view full details, and register through a validated form — all with a clean UI, smooth animations and dark/light mode.

🔗 **Live Demo:** https://sujaldas2711-stack.github.io/Kexplore/eventora/
📦 **Repository:** https://github.com/sujaldas2711-stack/Kexplore
---

## ✨ Features

### Core
- **Hero section** introducing the platform with clear calls to action.
- **Upcoming & featured events** displayed as cards (name, date, venue, image/banner, short description, price).
- **Search** by name, venue or keyword (debounced, instant results).
- **Category filters** (Tech, Music, Sports, Business, Cultural, Workshop).
- **Event details modal** with full description, venue, price and seats.
- **Registration form** collecting name, email, phone number and selected event.
- **JavaScript form validation** with inline error messages and valid/invalid styling.
- **Confirmation message** with a booking reference after a successful registration.
- **Fully responsive** — mobile, tablet and desktop layouts.
- **Dark / light mode** (remembers your choice, respects system preference).
- **Live countdown timer** to the next upcoming event.
- **Animations** — scroll-reveal, card hover effects, floating hero blobs, modal transitions.
- **Local Storage** registration management — view and cancel registrations, with a duplicate-registration check.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic elements, `<dialog>`) |
| Styling | CSS3 (Grid, Flexbox, custom properties, media queries) |
| Logic | Vanilla JavaScript (ES6+) |
| Storage | Browser Local Storage |
| Version control | Git & GitHub |

No frameworks or build step required.

---

## 📁 Project Structure

```
eventora/
├── index.html    # Page structure, hero, event grid, modal & form markup
├── style.css     # Theming, layout, responsive design, animations
├── script.js     # Event data, rendering, filtering, validation, storage, countdown
└── README.md
```

---

## ⚙️ How It Works (Implementation)

1. **Data** – Events live in an `EVENTS` array in `script.js`. Cards are generated from it, so adding an event is just adding an object. Optionally add `image: "https://…"` for a real photo; otherwise a gradient + emoji banner is shown.
2. **Search & filter** – `renderEvents()` combines the active category chip and the search text, then re-renders the matching cards (and an empty state when nothing matches).
3. **Modal** – Clicking *View & Register* opens a native `<dialog>` populated with that event's details. The event dropdown in the form is pre-selected.
4. **Validation** – Each field has a validator function:
   - *Name*: ≥ 2 characters, letters/spaces only
   - *Email*: standard email pattern
   - *Phone*: valid 10-digit Indian mobile number (optional `+91`/`0` prefix)
   - *Event*: must be selected

   Fields validate on blur, re-validate live once invalid, and everything is checked again on submit.
5. **Registration storage** – Valid submissions are saved in Local Storage (`eventora_registrations`) with a generated booking reference. Duplicate email + event combinations are rejected.
6. **Countdown** – `setInterval` updates days/hours/minutes/seconds to the nearest upcoming event; past events are automatically hidden.
7. **Theme** – A `data-theme` attribute on `<html>` switches CSS variable sets; the choice is saved to Local Storage.
8. **Security** – All dynamic text is escaped before being injected into the DOM to prevent XSS.

### Responsive breakpoints
- **Mobile (< 640px):** single column, hamburger menu, scrollable filter chips
- **Tablet (≥ 640px):** two-column event grid
- **Desktop (≥ 900px):** three-column grid, inline nav, two-column hero & modal

### Accessibility
Semantic HTML, skip link, visible focus states, ARIA labels/live regions, keyboard-friendly modal (Esc to close), and `prefers-reduced-motion` support.

---

## 🚀 Run Locally

```bash
git clone https://github.com/sujaldas2711-stack/KExplore
cd eventora
# just open index.html in a browser, or use a local server:
npx serve .
```

