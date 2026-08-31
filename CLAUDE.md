# CLAUDE.md

Working notes for Claude Code (or any agent) in this repo. See `README.md` for user-facing
setup/run instructions.

## Repo layout

Two independently built/run modules, not a monorepo-tooled workspace:
- `backend/` — Spring Boot 4.1.1, Java 25, Maven (`./mvnw`), Lombok enabled.
- `frontend/` — React 19 + TypeScript, Vite. `vite.config.ts` proxies `/api/*` to
  `http://localhost:8080`, so the backend must expose all endpoints under `/api`.

The frontend is still an unmodified Vite/React template. The backend has an initial
`RestaurantService`/`RestaurantController`/`Restaurant` slice wired to Geoapify (see Architecture
below) — most other domain code is still to be built.

## Tech stack decisions (already made — don't re-litigate without discussion)

- **Restaurant data:** Geoapify Places API (search by radius) + Geoapify Geocoding API (geocode a
  typed address to coordinates) — a paid-tier-capable provider wrapping OpenStreetMap data behind
  one API and one API key. Requires an `API_KEY` env var (see `application.properties`:
  `geoapify.app.key=${API_KEY}`). Free tier: 3,000 requests/day. Trade-off: no ratings/reviews/
  photos in the data. (Originally planned as raw Nominatim + Overpass calls — switched to
  Geoapify to get both geocoding and places search behind one authenticated API.)
- **Map:** Leaflet via `react-leaflet`, OSM tile layer (independent of the Geoapify choice above).
- **Persistence:** none for v1. The backend is a stateless proxy/aggregator over the Geoapify
  API — do not introduce a database, JPA, or entities without discussing it first.
- **Backend HTTP client:** Spring `RestClient` (built-in, no extra dependency) to call Geoapify.
- **Backend caching:** `spring-boot-starter-cache` + Caffeine, in-memory only — used to avoid
  re-hitting Geoapify on repeated searches and to help stay within the free-tier daily quota, not
  as a data store.
- **Frontend styling:** Tailwind CSS — prefer utility classes over custom CSS files.
- **Frontend server state:** `@tanstack/react-query` for API calls (loading/error/caching), not
  raw `useEffect` + `useState` fetch logic.

## Architecture

**Endpoints (target design):**
- `GET /api/restaurants/nearby?lat={lat}&lon={lon}&radius={m}` — Geoapify Places query
  (`categories=catering.restaurant`) within `radius` meters of the given point. Backs the
  "use my current location" flow (browser Geolocation API gives lat/lon directly to the
  frontend, which calls this endpoint).
  - **Current status:** `RestaurantService.getRestaurants(lon, lat, radiusMeters)` implements
    this call against Geoapify, but `RestaurantController` (mapped at `/api/restaurant`) doesn't
    yet expose a method calling it — still needs a `@GetMapping` wired up (and its path aligned
    to `/api/restaurants/nearby` per this doc, or this doc updated to match the chosen path).
- `GET /api/restaurants/search?address={text}&radius={m}` — geocode `address` via the Geoapify
  Geocoding API, then run the same nearby search from the resolved coordinates. Backs the
  home-page search field. **Not implemented yet.**

**Backend layering:** Controller → Service (orchestrates geocode + search + distance sort where
applicable) → thin `RestClient`-based calls to Geoapify → response DTOs
(`GeoapifyPlacesResponse` and friends) mapped to the domain `Restaurant` record. Domain records
cross layer boundaries, not raw external API response shapes — see
`model/GeoapifyPlacesResponse.java` for the Geoapify response shape and
`RestaurantService.toRestaurant()` for the mapping. Distance/nearest-first sorting is not yet
implemented (Geoapify's `bias=proximity` biases results but doesn't guarantee a sorted response).

**Frontend flow:** Home page requests browser Geolocation API on load → calls
`/api/restaurants/nearby` → renders results as cards + a Leaflet map. The search field submits an
address → calls `/api/restaurants/search` → same card/map rendering, re-centered on the searched
location.

## External API constraints (must respect)

- **Geoapify:** free tier caps at 3,000 requests/day across all endpoints (Places + Geocoding
  share the quota) — cache responses (`spring-boot-starter-cache` + Caffeine) rather than
  re-querying on every render, and don't add features that call it in a loop.
- **API key:** never hardcode it — it's injected via constructor `@Value("${geoapify.app.key}")`
  in `RestaurantService`, sourced from the `API_KEY` env var. Don't log the key or include it in
  error messages that could reach the frontend.
- **Attribution:** OpenStreetMap requires "© OpenStreetMap contributors" to be visible in the UI
  for the map (Leaflet's default tile attribution control satisfies this — don't remove it).

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
