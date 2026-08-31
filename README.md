# Restaurant Finder

Find the nearest and best-rated restaurants around you. On load, Restaurant Finder uses your
browser's location to show restaurants nearby; you can also search any other address from the
home page to see restaurants around that location instead.

## Tech stack

**Backend** — Java 25, Spring Boot, Maven, Lombok
- `spring-boot-starter-web` — REST API
- `spring-boot-starter-validation` — request validation
- Spring `RestClient` — calls out to the Geoapify Places API (restaurant search) and Geoapify
  Geocoding API (address search)
- `spring-boot-starter-cache` + Caffeine — in-memory response caching (no database; keeps the
  backend a stateless proxy/aggregator over Geoapify and helps stay within its free-tier request
  quota)
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

**Why Geoapify?** Geoapify wraps OpenStreetMap place data behind a single Places + Geocoding API
with a generous free tier (3,000 requests/day), including contact details (phone/email) alongside
each place — unlike calling Nominatim/Overpass directly, it needs no per-service rate-limit
handling on our side. The trade-off: it requires a free API key (sign up at
[geoapify.com](https://www.geoapify.com/)) and still has no star ratings, reviews, or photos —
restaurant cards show name, address, phone, and email (when available), not ratings. Map tiles
remain OpenStreetMap-based via Leaflet.

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
- A free [Geoapify](https://www.geoapify.com/) API key

## Running the app

**Backend** (from `backend/`):
```bash
export API_KEY=your-geoapify-api-key
./mvnw spring-boot:run
```
Starts on `http://localhost:8080`. The key is read via `geoapify.app.key=${API_KEY}` in
`application.properties`.

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

- No ratings, reviews, or photos — Geoapify's place data doesn't provide them.
- Geoapify's free tier caps requests at 3,000/day; the backend caches responses to help stay
  within this limit.
- Map tiles are OpenStreetMap-based (via Leaflet) and require attribution to OpenStreetMap
  contributors, shown in the app's map/footer.
- The address-search endpoint (Geoapify Geocoding API) is not yet implemented — only the
  location-based nearby search exists so far.
