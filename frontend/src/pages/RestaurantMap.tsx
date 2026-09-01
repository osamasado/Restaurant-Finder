import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import type {Location} from "../types/Location.ts";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";

type RestaurantMapProps = {
    location: Location | null;
};

export default function RestaurantMap({location}: Readonly<RestaurantMapProps>) {

    if (!location) {
        return <p>Getting your location...</p>;
    }

    const mapPosition: [number, number] = [
        location.latitude,
        location.longitude
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