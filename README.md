# Investment app — frontend

A React + Vite + Tailwind frontend for a warm, ledger-styled investment
app. Real client-side routing via `react-router-dom`, and a data layer
that talks to a backend if you have one — or falls back to mock data
if you don't.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Connecting a backend (optional)

```bash
cp .env.local.example .env.local
```

Then set `VITE_API_URL` inside `.env.local` to your backend's base URL.
Every function in `src/api.js` will start hitting real endpoints
(`GET /portfolio`, `GET /holdings`, `GET /products`, `GET /activity`,
`POST /products/subscribe`) instead of the mock data.

Leave `.env.local` unset (or don't create it) and the app runs entirely
on the mock data in `src/mockData.js` — nothing breaks.

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Routes

| Path        | Screen                                  |
|-------------|------------------------------------------|
| `/`         | Home — balance, growth chart, holdings   |
| `/grow`     | Investment product cards                 |
| `/activity` | Transaction ledger                       |
| `/you`      | Profile / settings                       |

## Structure

```
src/
  api.js                 data layer — real API calls if VITE_API_URL is
                          set, mock data otherwise
  mockData.js             mock portfolio / product / activity data
  App.jsx                 router + page shell
  components/
    Stamp.jsx              circular badge — the app's signature visual element
    Sparkline.jsx           mini line chart used in the holdings list
    PrimaryButton.jsx       shared CTA button
    TopNav.jsx               nav bar with real links (react-router NavLink)
  screens/
    Home.jsx                 balance, growth chart, holdings list
    AssetDetail.jsx            modal: buy/sell a basket
    Grow.jsx                   investment product cards
    Activity.jsx                 transaction ledger
    You.jsx                       profile / settings list
```

## Design tokens

Colors and fonts are defined in `tailwind.config.js` under `theme.extend`
(`paper`, `ink`, `forest`, `gold`, `rust`, etc., plus `font-display` /
`font-body` / `font-mono`). Change them there to re-theme the whole app.
