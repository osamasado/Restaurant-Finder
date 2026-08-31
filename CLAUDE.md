# CLAUDE.md

Working notes for Claude Code (or any agent) in this repo. See `README.md` for user-facing
setup/run instructions.

## Repo layout

Two independently built/run modules, not a monorepo-tooled workspace:
- `backend/` — Spring Boot 4.1.1, Java 25, Maven (`./mvnw`), Lombok enabled.
- `frontend/` — React 19 + TypeScript, Vite. `vite.config.ts` proxies `/api/*` to
  `http://localhost:8080`, so the backend must expose all endpoints under `/api`.

Both are early-stage scaffolds (Spring Initializr / `npm create vite`) — no domain code exists
yet beyond generator defaults.

## Tech stack decisions (already made — don't re-litigate without discussion)

- **Restaurant data:** OpenStreetMap Overpass API (search by radius) + Nominatim (geocode a typed
  address to coordinates). Free, no API key. Trade-off: no ratings/reviews/photos in the data.
- **Map:** Leaflet via `react-leaflet`, OSM tile layer.
- **Persistence:** none for v1. The backend is a stateless proxy/aggregator over the OSM APIs —
  do not introduce a database, JPA, or entities without discussing it first.
- **Backend HTTP client:** Spring `RestClient` (built-in, no extra dependency) to call Nominatim
  and Overpass.
- **Backend caching:** `spring-boot-starter-cache` + Caffeine, in-memory only — used to avoid
  re-hitting OSM APIs on repeated searches, not as a data store.
- **Frontend styling:** Tailwind CSS — prefer utility classes over custom CSS files.
- **Frontend server state:** `@tanstack/react-query` for API calls (loading/error/caching), not
  raw `useEffect` + `useState` fetch logic.

## Architecture

**Endpoints:**
- `GET /api/restaurants/nearby?lat={lat}&lon={lon}&radius={m}` — Overpass query for
  `amenity=restaurant` (and similar tags) within `radius` meters of the given point. Backs the
  "use my current location" flow (browser Geolocation API gives lat/lon directly to the
  frontend, which calls this endpoint).
- `GET /api/restaurants/search?address={text}&radius={m}` — geocode `address` via Nominatim,
  then run the same nearby search from the resolved coordinates. Backs the home-page search
  field.

**Backend layering:** Controller → Service (orchestrates geocode + search + distance sort) →
`NominatimClient` / `OverpassClient` (thin `RestClient` wrappers) → DTOs (`RestaurantDto`,
`SearchRequest`) with a mapper. DTOs cross layer boundaries, not raw external API response
shapes. Distance is computed server-side with the Haversine formula and results are sorted
nearest-first.

**Frontend flow:** Home page requests browser Geolocation API on load → calls
`/api/restaurants/nearby` → renders results as cards + a Leaflet map. The search field submits an
address → calls `/api/restaurants/search` → same card/map rendering, re-centered on the searched
location.

## External API constraints (must respect)

- **Nominatim:** max 1 request/second, requires a descriptive `User-Agent` header on every
  request (not the default HTTP client one) — set this in the `RestClient` config, not per call.
- **Overpass:** has fair-use rate/timeout limits; keep queries scoped (bounded radius) and cache
  responses rather than re-querying on every render.
- **Attribution:** OpenStreetMap requires "© OpenStreetMap contributors" to be visible in the UI
  (Leaflet's default tile attribution control satisfies this — don't remove it).

## Conventions

- Lombok: use `@Data`/`@Value`/`@RequiredArgsConstructor`/`@Builder` etc. to avoid boilerplate on
  DTOs and services; don't hand-write getters/setters/constructors Lombok can generate.
- Keep controller → service → client layering; don't call `RestClient` directly from controllers.
- Validate inputs (lat/lon ranges, non-blank address, radius bounds) with
  `spring-boot-starter-validation` annotations, not manual `if` checks.
- Tailwind utility classes for styling; avoid introducing a second styling approach (CSS modules,
  styled-components, etc.).

## Commands

**Backend** (from `backend/`):
```bash
./mvnw spring-boot:run   # run on :8080
./mvnw test               # run tests
```

**Frontend** (from `frontend/`):
```bash
npm install
npm run dev       # run on :5173, proxies /api to :8080
npm run build      # production build
npm run lint       # eslint
```
