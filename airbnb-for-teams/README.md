# Airbnb for Teams

A native mobile prototype for a corporate team event booking experience built on top of Airbnb's existing inventory and infrastructure.

**[View the live prototype →](https://k-nardoni.github.io/Prototype-1/)**

---

## What is this?

Small business founders and team leads spend weeks manually researching venues for corporate retreats — with no headcount filtering, no culture fit, and no understanding of what makes a space right for a specific company. Airbnb for Teams solves this with a purpose-built intake flow that captures group size, duration, region, budget, and ethos-aligned amenities, then surfaces a ranked list of matching spaces.

This prototype demonstrates the core mobile intake and results experience described in the [Product Requirements Document](PRD.md).

**Target user:** Matt, founder of The Feed — a wellness company with a team of up to 300. He wants to book a meaningful annual retreat that reflects his company's culture. Today there's no platform built for him or companies like his.

---

## Prototype

The prototype covers:
- **Intake flow** — group size, length of stay, geographic region, budget range, and amenity preferences (outdoor spaces, wellness, meeting rooms, kitchen access)
- **Results screen** — ranked venue cards with capacity, key amenities, and match score
- **iOS device frame** — presented as a native mobile experience
- **Tweaks panel** — in-app design controls for rapid iteration

> Note: This is a front-end prototype only. Venue data is static and not connected to a live API.

---

## Run it locally

The app runs in the browser with no build step required.

```bash
# Option 1 — Node
npx serve . -p 3000

# Option 2 — Python
python3 -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000)

> Must be served over HTTP — Babel fetches `.jsx` files at runtime, which `file://` blocks.

---

## Project structure

```
index.html          Loads vendored libs + CSS, mounts the app
resources.js        window.__resources: image id → file path
css/
  fonts.css         Self-hosted Inter @font-face declarations
  app.css           Design tokens + layout and component styles
src/
  ios-device.jsx    iOS device frame + status bar/nav (shared)
  tweaks-panel.jsx  In-app design tweaks panel (dev tooling)
  intake.jsx        Intake screen — ENTRY POINT (mounts <App/>)
  results.jsx       Results screen — venue cards and ranking
assets/
  images/           14 photos (regions + properties)
  fonts/            7 Inter woff2 subsets
vendor/             React 18.3.1, ReactDOM, Babel standalone, Lucide
```

---

## Documentation

- [PRD.md](PRD.md) — full product requirements document including problem statement, goals, metrics, scope, and experiment plan

---

## Author

Kelby Nardoni — MBA candidate, aspiring product manager
