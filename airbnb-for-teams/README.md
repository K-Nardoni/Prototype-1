# Airbnb for Teams — Intake prototype

An interactive React prototype (extracted from the original single-file bundle
into editable source). A mobile intake flow — group size, length of stay,
location, budget, amenities — that produces a ranked list of matching venues.

## Run it

It must be served over HTTP (Babel fetches the `.jsx` files, which `file://`
blocks). From this folder:

```bash
python3 -m http.server 8001
```

Then open http://localhost:8001

## Project structure

```
index.html              Loads vendored libs + CSS, mounts the app
resources.js            window.__resources: image id -> file path
css/
  fonts.css             Self-hosted Inter @font-face
  app.css               :root design tokens + layout/component styles
src/
  ios-device.jsx        iOS device frame + status bar/nav (shared components)
  tweaks-panel.jsx      In-app "Tweaks" design panel (dev tooling)
  intake.jsx            Intake screen — ENTRY POINT (mounts <App/> to #root)
  results.jsx           Results screen — venue cards, ranking, summary
assets/
  images/               14 photos (regions + properties), referenced by id
  fonts/                7 Inter woff2 subsets
vendor/                 React 18.3.1, ReactDOM 18.3.1, Babel standalone, Lucide
```

## How it works

- JSX is compiled **in the browser** by Babel (`type="text/babel"` scripts).
  No build step — edit a `.jsx` file and refresh.
- The four source files run as classic scripts sharing one global scope, so
  components defined in one file are usable in another (no imports/exports).
  Load order matters: shared components first, `intake.jsx` mounts the app last,
  `results.jsx` is used when navigating to results.
- Images are looked up via `window.__resources.<id>` (defined in `resources.js`).
  To add an image: drop it in `assets/images/` and add an entry there.

## Notes

- Vendored libraries are the exact versions from the original bundle, so it runs
  fully offline and behaves identically.
- The original single-file export is preserved at
  `../Airbnb for Teams (1).html` as a backup.
