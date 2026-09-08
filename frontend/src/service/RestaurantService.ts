import api from "./API";
import type { Restaurant } from "../types/Restaurant";
import type { Location } from "../types/Location";
import type { AddressSuggestion } from "../types/AddressSuggestion";

export async function getNearbyRestaurants(lat: number, lon: number, radius?: number): Promise<Restaurant[]> {
    const { data } = await api.get<Restaurant[]>("/restaurants/nearby", {
        params: { lat, lon, radius },
    });
    return data;
}

export async function getAddressSuggestions(text: string): Promise<AddressSuggestion[]> {
    const { data } = await api.get<AddressSuggestion[]>("/restaurants/autocomplete", {
        params: { text },
    });
    return data;
}

type RestaurantSearchApiResponse = {
    location: { lat: number; lon: number };
    restaurants: Restaurant[];
};

export async function searchRestaurantsByAddress(
    address: string,
    radius?: number
): Promise<{ location: Location; restaurants: Restaurant[] }> {
    const { data } = await api.get<RestaurantSearchApiResponse>("/restaurants/search", {
        params: { address, radius },
    });
    return {
        location: { latitude: data.location.lat, longitude: data.location.lon },
        restaurants: data.restaurants,
    };
}
