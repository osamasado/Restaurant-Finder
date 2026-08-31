# Restaurant Finder

Find the nearest and best-rated restaurants around you. On load, Restaurant Finder uses your
browser's location to show restaurants nearby; you can also search any other address from the
home page to see restaurants around that location instead.

## Tech stack

**Backend** — Java 25, Spring Boot, Maven, Lombok
- `spring-boot-starter-web` — REST API
- `spring-boot-starter-validation` — request validation
- Spring `RestClient` — calls out to OpenStreetMap's Nominatim (geocoding) and Overpass
  (restaurant search) APIs
- `spring-boot-starter-cache` + Caffeine — in-memory response caching (no database; keeps the
  backend a stateless proxy/aggregator over OSM data and respects Nominatim's rate limits)
- `springdoc-openapi` — Swagger UI / OpenAPI docs
- JUnit 5, Mockito, MockMvc — testing

**Frontend** — React 19, TypeScript, Vite
- Tailwind CSS — styling
- `leaflet` + `react-leaflet` — map display
- `axios` — HTTP client to the backend API
- `@tanstack/react-query` — server-state caching, loading/error handling for searches
- `react-hook-form` — the address search form
- `lucide-react` — icons
- Vitest + React Testing Library — testing

**Why OpenStreetMap?** Nominatim (geocoding) and Overpass (restaurant search) are free and
require no API key, which keeps the project runnable by anyone without signing up for a paid
map/places provider. The trade-off: OSM has no star ratings, reviews, or photos — restaurant
cards show name, cuisine/type, address, distance, and opening hours (when tagged), not ratings.

## Project structure

```
Restaurant-Finder/
├── backend/    Spring Boot REST API (Maven)
└── frontend/   React + TypeScript app (Vite)
```

## Prerequisites

- JDK 25
- Node.js (LTS) and npm
- Maven is not required to be installed globally — use the included wrapper (`./mvnw`)

## Running the app

**Backend** (from `backend/`):
```bash
./mvnw spring-boot:run
```
Starts on `http://localhost:8080`.

**Frontend** (from `frontend/`):
```bash
npm install
npm run dev
```
Starts on `http://localhost:5173` (Vite dev server). API calls to `/api/*` are proxied to the
backend on port 8080 (see `frontend/vite.config.ts`).

## API

- `GET /api/restaurants/nearby?lat={lat}&lon={lon}&radius={m}` — restaurants near the given
  coordinates (used for the "use my location" flow).
- `GET /api/restaurants/search?address={text}&radius={m}` — geocodes `address`, then returns
  restaurants near the resolved location (used for the home-page search field).

## Known limitations

- No ratings, reviews, or photos — OpenStreetMap doesn't provide them.
- Nominatim's usage policy caps requests to 1/second and requires a descriptive `User-Agent`;
  heavy or rapid searching may be throttled. The backend caches responses to help stay within
  this limit.
- Map tiles and search results require attribution to OpenStreetMap contributors, shown in the
  app's map/footer.
