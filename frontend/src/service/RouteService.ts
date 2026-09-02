import type { Route } from "../types/Route";
import API from "./API";

export async function getRoute(
    startLat: number,
    startLon: number,
    destinationLat: number,
    destinationLon: number,
    mode: string = "walk"
): Promise<Route> {

    const response = await API.get<Route>("/routes", {
        params: {
            startLat,
            startLon,
            destinationLat,
            destinationLon,
            mode
        }
    });

    return response.data;
}