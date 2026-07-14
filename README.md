# Comfit

Fitness & nutrition tracker — food, workouts, supplements, planning, progress
reports and personalized recommendations. Offline-first: all data lives in the
browser's `localStorage`, no backend.

## Run

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the built dist/ locally
```

Needs a static server (ES modules don't load from `file://`). `npm run dev`
provides one; any static host works for the built `dist/`.

## Architecture

Previously a single ~1500-line `index.html`. Now split into ES modules bundled
by Vite:

```
index.html            markup only (no inline JS/CSS)
src/
  main.js             composition root: action registry + event delegation + wiring
  state.js            localStorage data model
  i18n.js             translations lookup + language switch
  calc.js             shared BMR/TDEE/macros engine (Mifflin-St Jeor)
  selects.js          <select> population
  ui.js               small DOM helpers
  styles/             base.css · auth.css · app.css
  data/               translations · foods · supps · floatIcons (pure data)
  features/           auth · nav · food · workout · supps · plan · report · foryou · settings
```

Two things the split fixed beyond file separation:

- **No duplicated logic** — the calorie/macro math lived in two places; it's now
  one `calc.js` used by both the calculator and the "For You" screen.
- **No global namespace** — instead of hundreds of inline `onclick="fn()"`,
  markup carries `data-action` attributes and one delegated listener in `main.js`
  dispatches them. Feature modules communicate via `document` custom events
  (`cf:login`, `cf:nav`, `cf:langchange`, `cf:goals-changed`).
