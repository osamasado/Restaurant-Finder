import type { Route } from "../types/Route";
import API from "./API";

export async function getWalkingRoute(
    startLat: number,
    startLon: number,
    destinationLat: number,
    destinationLon: number
): Promise<Route> {

    const response = await API.get<Route>("/routes", {
        params: {
            startLat,
            startLon,
            destinationLat,
            destinationLon
        }
    });

    return response.data;
}