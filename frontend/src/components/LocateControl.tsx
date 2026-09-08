import {useEffect} from "react";
import {useMap} from "react-leaflet";
import L from "leaflet";
import type {Location} from "../types/Location.ts";

type LocateControlProps = {
    userLocation: Location;
}

const LOCATE_ICON_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="2" x2="5" y1="12" y2="12"/>
        <line x1="19" x2="22" y1="12" y2="12"/>
        <line x1="12" x2="12" y1="2" y2="5"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
        <circle cx="12" cy="12" r="7"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
`;

export default function LocateControl({userLocation}: Readonly<LocateControlProps>) {
    const map = useMap();

    useEffect(() => {
        const control = new L.Control({position: "topleft"});

        control.onAdd = () => {
            const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
            const link = L.DomUtil.create("a", "leaflet-bar-part", container);

            link.href = "#";
            link.title = "Center on my location";
            link.setAttribute("role", "button");
            link.setAttribute("aria-label", "Center on my location");
            link.innerHTML = LOCATE_ICON_SVG;
            link.style.display = "flex";
            link.style.alignItems = "center";
            link.style.justifyContent = "center";

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.on(link, "click", (event) => {
                L.DomEvent.preventDefault(event);
                map.flyTo([userLocation.latitude, userLocation.longitude], 17);
            });

            return container;
        };

        control.addTo(map);

        return () => {
            control.remove();
        };
    }, [map, userLocation]);

    return null;
}
