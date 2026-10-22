# Couch Cushion

An AI-powered micro-savings feature concept for a consumer banking app — built for everyday Americans living paycheck to paycheck who want to save but can't get started.

This prototype explores a core question in consumer AI: how do you make an AI financial assistant trustworthy enough that people will let it move their money?

**[View the live prototype →](https://k-nardoni.github.io/Prototypes/couch-cushion/)**

---

## What is this?

Traditional savings products fail people who need them most — they require minimum balances, separate accounts, and lump sum contributions. The barrier isn't motivation. It's accessibility and psychology.

Couch Cushion sits inside a banking app and uses existing transaction intelligence to find the surplus left over at month's end, then gives the user one simple decision: how to split it between checking, a named savings cushion, or an index fund. No new account. No minimum balance. No cognitive overhead.

**Target user:** Rebecca — a 20-something community college student working two jobs, living paycheck to paycheck, who wants to build a safety net and save for real goals without opening another account or learning another app.

---

## Prototype

The prototype demonstrates the full month-end allocation flow:

- **Notification** — surfaces the leftover surplus at the end of the month
- **Decide** — a draggable bar allocator across checking / cushion / invest, with an AI-recommended split pre-filled
- **Confirm** — shows the final split and projected growth before committing
- **Goal** — names the cushion and ties it to a real goal (emergency fund, trip, etc.)
- **Done** — confirms the allocation and progress

The published version renders the **Bold** treatment — a dark, data-forward UI with bar-based visualizations. A second, lighter "Safe" treatment also exists in source (`safe.jsx`) from early design exploration but isn't the one currently published.

> Note: This is a front-end prototype. No live banking API or account data is connected.

---

## Run it locally

Scripts are JSX, compiled in-browser by Babel at runtime — this requires an HTTP server, not `file://`.

```bash
# Option 1 — Node
npx serve . -p 3000

# Option 2 — Python
python3 -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000)

---

## Project structure

```
index.html              Loads vendored libs + CSS, mounts <BoldFlow/>
colors_and_type.css      Design tokens, fonts, color system
shared.jsx                KN UI kit primitives (buttons, cards, icons, sheets)
ios-frame.jsx             iOS device frame + status bar/nav chrome
flow.jsx                  Shared state machine, math helpers, AI recommendation logic
bold.jsx                  Bold (dark) visual treatment — published live
safe.jsx                  Safe (cream) visual treatment — design exploration, not published
design-canvas.jsx         Side-by-side comparison canvas (dev tooling)
tweaks-panel.jsx          In-app design tweaks panel (dev tooling)
screenshots/              Process captures from design iteration
```

---

## Measuring

```
If built: success would be measured by cushion-creation rate, goal-completion rate, and retention lift , with guardrails on ensuring users never over-allocate below their safe-to-spend threshold.
```
---

## Author

Kelby Nardoni, AI Product Manager with 9+ years building enterprise and consumer GenAI products in regulated financial services. Led AI products from 6-person teams to 25M+ users.
