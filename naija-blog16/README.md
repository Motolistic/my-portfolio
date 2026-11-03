# Naija Blog — Frontend

Multi-author publishing platform UI, built with React + Vite + Tailwind.
Design direction: "Adire & Danfo" — see `src/theme.js` for the token system.

## Setup

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. `npm run build` produces a production build in `dist/`.

## Project layout

```
src/
  theme.js            — colors + category accents (shared, avoid editing without syncing)
  data/mockData.js     — placeholder posts/authors/comments (swap for Supabase later)
  lib/supabaseClient.js — stub for when backend wiring starts
  components/          — shared building blocks (Masthead, Footer, PostCard, PatternCover, Ticker, Badges)
  pages/
    Home.jsx            — landing / feed
    Post.jsx            — single article + comments
    Category.jsx        — category listing
    Author.jsx           — author profile
    Search.jsx           — search
    Auth.jsx             — login / signup
    Dashboard.jsx        — author's post list + editor
    Admin.jsx             — categories, authors, moderation
  App.jsx               — routes (react-router-dom)
```

## Splitting the work

Each file in `src/pages/` is a self-contained page — good boundaries for two
people to work in parallel without touching the same lines. Suggested split
for a first pass:

- **Person A:** `Home.jsx`, `Category.jsx`, `Author.jsx`, `Search.jsx`
- **Person B:** `Auth.jsx`, `Dashboard.jsx`, `Admin.jsx`, `Post.jsx`

Shared files (`theme.js`, `components/*`, `App.jsx`) are the ones most likely
to cause conflicts if you both edit them at once — treat changes to those as
something to flag to each other first, or make them together in a short call.

### Suggested git workflow

1. One of you creates the repo and pushes this as the initial commit on `main`.
2. Each person branches per page: `git checkout -b feature/dashboard-page`.
3. Small, frequent PRs (one page or one component at a time) beat one giant PR —
   easier to review, easier to merge.
4. Pull `main` before starting a new page in case shared files changed.

## Next steps (not done yet)

- Wire `src/lib/supabaseClient.js` up to a real Supabase project and swap
  `data/mockData.js` imports for real queries, matching the schema in the SAD.
- Add the RLS policies from the SAD before any real user data goes in.
- Decide on the SEO/pre-render approach for post pages (see SAD §6) before
  launch, since this is a plain client-rendered SPA right now.
