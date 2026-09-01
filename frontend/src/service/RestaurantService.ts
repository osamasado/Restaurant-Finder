import api from "./API";
import type { Restaurant } from "../types/Restaurant";

export async function getNearbyRestaurants(lat: number, lon: number, radius?: number): Promise<Restaurant[]> {
    const { data } = await api.get<Restaurant[]>("/restaurants/nearby", {
        params: { lat, lon, radius },
    });
    return data;
}
