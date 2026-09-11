import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    CircleMarker,
    Polyline,
    useMap
} from "react-leaflet";
import type {Route} from "../types/Route.ts";
import type {Location} from "../types/Location.ts";
import type {Restaurant} from "../types/Restaurant.ts";
import {useEffect, useRef, useState} from "react";
import {getRoute} from "../service/RouteService.ts";
import L from "leaflet";
import {X} from "lucide-react";
import RestaurantPopupCard from "../components/RestaurantPopupCard.tsx";
import LocateControl from "../components/LocateControl.tsx";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Vite inlines these PNGs as base64 in prod, breaking Leaflet's icon path
// detection. _getIconUrl also prepends that path to our full URLs, so delete
// it before overriding.
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

type RestaurantMapProps = {
    userLocation: Location;
    searchLocation?: Location | null;
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
    setSelectedRestaurant: (restaurant: Restaurant | null) => void;
};

type TransportMode = "walk" | "drive" | "bicycle";

// MapContainer's `center` prop only applies once, on mount. When a search
// resolves to a new location after the map is already showing, fly there.
function RecenterMap({position}: Readonly<{ position: [number, number] }>) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position);
    }, [map, position]);

    return null;
}

export default function RestaurantMap({
                                          userLocation,
                                          searchLocation,
                                          restaurants,
                                          selectedRestaurant,
                                          setSelectedRestaurant
                                      }: Readonly<RestaurantMapProps>) {

    const [route, setRoute] = useState<Route | null>(null);
    const [selectedMode, setSelectedMode] = useState<TransportMode>("walk");
    const [isRouteLoading, setIsRouteLoading] = useState(false);
    const [routeError, setRouteError] = useState<string | null>(null);
    const markerRefs = useRef<Map<string, L.Marker>>(new Map());

    useEffect(() => {
        if (!selectedRestaurant) {
            return;
        }

        const loadRoute = async () => {
            setIsRouteLoading(true);
            setRouteError(null);

            try {
                const newRoute = await getRoute(
                    userLocation.latitude,
                    userLocation.longitude,
                    selectedRestaurant.latitude,
                    selectedRestaurant.longitude,
                    selectedMode
                );

                setRoute(newRoute);
            } catch (error) {
                console.error("Could not load route:", error);
                setRouteError("Could not load route. Please try again.");
            } finally {
                setIsRouteLoading(false);
            }
        };

        void loadRoute();

    }, [userLocation, selectedRestaurant, selectedMode]);

    const mapPosition: [number, number] = [
        userLocation.latitude,
        userLocation.longitude
    ];

    // MapContainer only reads `center` once, on mount - so the initial center
    // must already account for an active search, or remounting this component
    // (e.g. toggling List -> Map) would start at userLocation and jump from there.
    const initialCenter: [number, number] = searchLocation
        ? [searchLocation.latitude, searchLocation.longitude]
        : mapPosition;

    const routePositions: [number, number][] =
        route?.coordinates?.map(([longitude, latitude]) => [
            latitude,
            longitude
        ]) ?? [];

    return (
        <div>
            <MapContainer
                center={initialCenter}
                zoom={17}
                className="h-[450px] w-full rounded-xl md:h-[600px]"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <LocateControl userLocation={userLocation}/>

                {searchLocation && (
                    <>
                        <RecenterMap position={[searchLocation.latitude, searchLocation.longitude]}/>

                        {/* Searched address marker */}
                        <CircleMarker
                            center={[searchLocation.latitude, searchLocation.longitude]}
                            radius={9}
                            pathOptions={{
                                color: "white",
                                weight: 3,
                                fillColor: "#768190",
                                fillOpacity: 1
                            }}
                        >
                            <Popup>Searched location</Popup>
                        </CircleMarker>
                    </>
                )}

                {/* User marker */}
                <CircleMarker
                    center={mapPosition}
                    radius={9}
                    pathOptions={{
                        color: "white",
                        weight: 3,
                        fillColor: "#4285F4",
                        fillOpacity: 1
                    }}
                >
                    <Popup>You are here</Popup>
                </CircleMarker>

                {/* Restaurant markers */}
                {restaurants.map((restaurant) => (
                    <Marker
                        key={restaurant.id}
                        position={[
                            restaurant.latitude,
                            restaurant.longitude
                        ]}
                        ref={(marker) => {
                            if (marker) {
                                markerRefs.current.set(restaurant.id, marker);
                            } else {
                                markerRefs.current.delete(restaurant.id);
                            }
                        }}
                    >
                        <Popup className="restaurant-popup" closeButton={false} minWidth={224} maxWidth={224}>
                            <RestaurantPopupCard
                                restaurant={restaurant}
                                onSelectRestaurant={() => {
                                    setSelectedRestaurant(restaurant);
                                    markerRefs.current.get(restaurant.id)?.closePopup();
                                }}
                                onClose={() => markerRefs.current.get(restaurant.id)?.closePopup()}
                            />
                        </Popup>
                    </Marker>
                ))}

                {/* Selected route */}
                {routePositions.length > 0 && (
                    <Polyline positions={routePositions}/>
                )}
            </MapContainer>

            {selectedRestaurant && (
                <div className="mx-auto mt-4 max-w-md px-4">

                    <div className="mb-3 flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedMode("walk")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                selectedMode === "walk"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                        >
                            🚶 Walk
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedMode("drive")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                selectedMode === "drive"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                        >
                            🚗 Drive
                        </button>

                        <button
                            type="button"
                            onClick={() => setSelectedMode("bicycle")}
                            className={`rounded-lg px-4 py-2 text-sm font-medium ${
                                selectedMode === "bicycle"
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-700"
                            }`}
                        >
                            🚲 Bicycle
                        </button>
                    </div>

                    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setRoute(null);
                                setSelectedRestaurant(null);
                            }}
                            aria-label="Close route"
                            className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <X className="size-4"/>
                        </button>

                        <p className="pr-6 font-semibold text-slate-900">
                            {selectedMode === "walk" && "🚶 Walking Route"}
                            {selectedMode === "drive" && "🚗 Driving Route"}
                            {selectedMode === "bicycle" && "🚲 Bicycle Route"}
                        </p>

                        {routeError ? (
                            <p className="mt-2 text-sm text-red-600">
                                {routeError}
                            </p>
                        ) : isRouteLoading ? (
                            <p className="mt-2 text-sm text-slate-500">
                                Loading route...
                            </p>
                        ) : route ? (
                            <>
                                <p className="mt-2 text-sm text-slate-600">
                                    Distance: {Math.round(route.distance)} m
                                </p>

                                <p className="text-sm text-slate-600">
                                    Estimated time: {Math.round(route.duration / 60)} min
                                </p>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}