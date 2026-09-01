import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNearbyRestaurants } from "../service/RestaurantService";
import RestaurantCard from "../components/RestaurantCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";

export default function RestaurantList() {
    const [coords, setCoords] = useState<[number, number] | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords([position.coords.latitude, position.coords.longitude]);
            },
            (error) => {
                console.error(error);
                setGeoError(
                    error.code === error.PERMISSION_DENIED
                        ? "Location access was denied. Please allow location access in your browser settings and reload the page."
                        : "Unable to determine your location. Please try again."
                );
            }
        );
    }, []);

    const {
        data: restaurants,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["nearbyRestaurants", coords],
        queryFn: () => getNearbyRestaurants(coords![0], coords![1]),
        enabled: coords !== null,
    });

    if (geoError) {
        return <ErrorState message={geoError} />;
    }

    if (!coords) {
        return <LoadingState message="Getting your location..." />;
    }

    if (isPending) {
        return <LoadingState message="Loading nearby restaurants..." />;
    }

    if (isError) {
        return (
            <ErrorState
                message={`Failed to load restaurants${error instanceof Error ? `: ${error.message}` : "."}`}
            />
        );
    }

    if (restaurants.length === 0) {
        return <EmptyState message="No restaurants found nearby." />;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
}
