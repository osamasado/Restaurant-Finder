import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import type {Location} from "../types/Location.ts";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";

export default function RestaurantMap({ userLocation }: Readonly<{userLocation: Location | null}>) {

    if (!userLocation) {
        return <p>Getting your location...</p>;
    }

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

            <Marker position={mapPosition}>
                <Popup>
                    You are here 📍
                </Popup>
            </Marker>
        </MapContainer>
    );
}