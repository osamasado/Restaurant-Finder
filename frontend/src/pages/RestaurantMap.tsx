import {MapContainer, TileLayer, Marker, Popup, CircleMarker} from "react-leaflet";
import type {Location} from "../types/Location.ts";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";
import type {Restaurant} from "../types/Restaurant.ts";

type RestaurantMapProps = {
    userLocation: Location;
    restaurants: Restaurant[];
};

export default function RestaurantMap({userLocation, restaurants}: Readonly<RestaurantMapProps>) {

    const mapPosition: [number, number] = [
        userLocation.latitude,
        userLocation.longitude
    ];

    return (
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
                    position={[restaurant.latitude, restaurant.longitude]}
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
        </MapContainer>
    );
}