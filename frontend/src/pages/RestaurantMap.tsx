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

    const [walkingRoute, setWalkingRoute] = useState<Route | null>(null);
    const markerRefs = useRef<Map<string, L.Marker>>(new Map());

    useEffect(() => {
        if (!selectedRestaurant) {
            return;
        }

        getRoute(
            userLocation.latitude,
            userLocation.longitude,
            selectedRestaurant.latitude,
            selectedRestaurant.longitude,
            "walk"
        )
            .then((route) => {
                setWalkingRoute(route);
            })
            .catch((error) => {
                console.error("Could not load route:", error);
            });

    }, [userLocation, selectedRestaurant]);

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
        walkingRoute?.coordinates?.map(([longitude, latitude]) => [
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

                {/* Walking route */}
                {routePositions.length > 0 && (
                    <Polyline positions={routePositions}/>
                )}
            </MapContainer>

            {walkingRoute && (
                <div className="mx-auto mt-4 max-w-md px-4">
                    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <button
                            type="button"
                            onClick={() => {
                                setWalkingRoute(null);
                                setSelectedRestaurant(null);
                            }}
                            aria-label="Close walking route"
                            className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <X className="size-4"/>
                        </button>

                        <p className="pr-6 font-semibold text-slate-900">
                            🚶 Walking Route
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                            Distance: {Math.round(walkingRoute.distance)} m
                        </p>

                        <p className="text-sm text-slate-600">
                            Estimated time: {Math.round(walkingRoute.duration / 60)} min
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}