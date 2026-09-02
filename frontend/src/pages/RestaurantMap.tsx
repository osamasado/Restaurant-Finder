import {MapContainer, TileLayer, Marker, Popup, Polyline} from "react-leaflet";
import type {Route} from "../types/Route.ts";
import type {Location} from "../types/Location.ts";
import type {Restaurant} from "../types/Restaurant.ts";
import {useEffect, useState} from "react";
import {getRoute} from "../service/RouteService.ts";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";

export default function RestaurantMap(
    {
        userLocation,
        selectedRestaurant
    }: Readonly<{
        userLocation: Location | null,
        selectedRestaurant: Restaurant | null
    }>) {

    const [walkingRoute, setWalkingRoute] = useState<Route | null>(null);

    useEffect(() => {
        if (!userLocation || !selectedRestaurant) {
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

    if (!userLocation) {
        return <p>Getting your location...</p>;
    }

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

                <Marker position={mapPosition}>
                    <Popup>
                        You are here 📍
                    </Popup>
                </Marker>

                {selectedRestaurant && (
                    <Marker
                        position={[
                            selectedRestaurant.latitude,
                            selectedRestaurant.longitude
                        ]}
                    >
                        <Popup>
                            {selectedRestaurant.name}
                        </Popup>
                    </Marker>
                )}

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