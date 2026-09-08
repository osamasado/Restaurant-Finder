import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import {useCallback, useEffect, useState} from "react";
import type {Location} from "./types/Location.ts";
import type {Restaurant} from "./types/Restaurant.ts";
import type {ViewMode} from "./types/ViewMode.ts";
import {useQuery} from "@tanstack/react-query";
import {getNearbyRestaurants} from "./service/RestaurantService.ts";
import ErrorState from "./components/ErrorState.tsx";
import LoadingState from "./components/LoadingState.tsx";
import EmptyState from "./components/EmptyState.tsx";

function App() {

    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [view, setView] = useState<ViewMode>("map");
    const [radius, setRadius] = useState<number>(2000);

    const fetchLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition(
            (currentPosition) => {
                setUserLocation({
                    latitude: currentPosition.coords.latitude,
                    longitude: currentPosition.coords.longitude
                });
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

    useEffect(() => {
        fetchLocation();
    }, [fetchLocation]);

    const retryLocation = useCallback(() => {
        setGeoError(null);
        fetchLocation();
    }, [fetchLocation]);

    const {
        data: restaurants,
        isPending,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["nearbyRestaurants", userLocation, radius],
        queryFn: () => getNearbyRestaurants(
            userLocation!.latitude,
            userLocation!.longitude,
            radius
        ),
        enabled: userLocation !== null,
    });

    if (geoError) {
        return <ErrorState message={geoError} onRetry={retryLocation} />;
    }

    if (!userLocation) {
        return <LoadingState message="Getting your location..." />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header
                view={view}
                onChangeView={setView}
                radius={radius}
                onChangeRadius={setRadius}
                isLoadingRestaurants={isPending}
                resultCount={restaurants?.length}
            />

            <main className="flex-1">
                {isPending ? (
                    <LoadingState message="Loading nearby restaurants..." variant="cards" />
                ) : isError ? (
                    <ErrorState
                        message={`We couldn't load nearby restaurants${error instanceof Error ? `: ${error.message}` : "."}`}
                        onRetry={() => refetch()}
                    />
                ) : restaurants.length === 0 ? (
                    <EmptyState
                        title="No restaurants found"
                        description="We couldn't find any restaurants near your location. Try moving to another area or searching again."
                    />
                ) : view === "list" ? (
                    <RestaurantList
                        restaurants={restaurants}
                        setSelectedRestaurant={setSelectedRestaurant}
                        onSelectRestaurant={() => setView("map")}
                    />
                ) : (
                    <RestaurantMap
                        userLocation={userLocation}
                        restaurants={restaurants}
                        selectedRestaurant={selectedRestaurant}
                        setSelectedRestaurant={setSelectedRestaurant}
                    />
                )}
            </main>

            <Footer/>
        </div>
    );
}

export default App
