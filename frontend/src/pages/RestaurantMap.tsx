import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";
import {useEffect, useState} from "react";
import "leaflet/dist/leaflet.css";
import "./RestaurantMap.css";

export default function RestaurantMap() {

    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setPosition([
                    position.coords.latitude,
                    position.coords.longitude
                ]);
            },
            (error) => {
                console.error(error);
            }
        );
    }, []);

    if (!position) {
        return <p>Getting your location...</p>;
    }

    return (
        <MapContainer
            center={position}
            zoom={17}
            className="restaurant-map"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
                <Popup>
                    You are here 📍
                </Popup>
            </Marker>

        </MapContainer>
    );
}