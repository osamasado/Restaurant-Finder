import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import type {Position} from "../types/Position.ts";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";

type RestaurantMapProps = {
    position: Position | null;
};

export default function RestaurantMap({position}: Readonly<RestaurantMapProps>) {

    if (!position) {
        return <p>Getting your location...</p>;
    }

    const mapPosition: [number, number] = [
        position.latitude,
        position.longitude
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