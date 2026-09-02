import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    CircleMarker,
    Polyline
} from "react-leaflet";
import type {Route} from "../types/Route.ts";
import type {Location} from "../types/Location.ts";
import type {Restaurant} from "../types/Restaurant.ts";
import {useEffect, useState} from "react";
import {getRoute} from "../service/RouteService.ts";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";

type RestaurantMapProps = {
    userLocation: Location;
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
};

export default function RestaurantMap({
                                          userLocation,
                                          restaurants,
                                          selectedRestaurant
                                      }: Readonly<RestaurantMapProps>) {

    const [walkingRoute, setWalkingRoute] = useState<Route | null>(null);

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

    const routePositions: [number, number][] =
        walkingRoute?.coordinates?.map(([longitude, latitude]) => [
            latitude,
            longitude
        ]) ?? [];

    return (
        <div>
            <MapContainer
                center={mapPosition}
                zoom={17}
                className="restaurant-map"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

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
                    >
                        <Popup>
                            <strong>{restaurant.name}</strong>
                            <br/>
                            📍 {restaurant.address}

                            {restaurant.openingHours && (
                                <>
                                    <br/>
                                    🕒 {restaurant.openingHours}
                                </>
                            )}
                        </Popup>
                    </Marker>
                ))}

                {/* Walking route */}
                {routePositions.length > 0 && (
                    <Polyline positions={routePositions}/>
                )}
            </MapContainer>

            {walkingRoute && (
                <div className="max-w-md mx-auto mt-4 px-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
                        <p className="font-semibold">
                            🚶 Walking Route
                        </p>

                        <p className="mt-2">
                            Distance: {Math.round(walkingRoute.distance)} m
                        </p>

                        <p>
                            Estimated time: {Math.round(walkingRoute.duration / 60)} min
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}