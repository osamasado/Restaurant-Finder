import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import {useCallback, useEffect, useState} from "react";
import type {Location} from "./types/Location.ts";
import type {Restaurant} from "./types/Restaurant.ts";
import type {ViewMode} from "./types/ViewMode.ts";
import {useQuery} from "@tanstack/react-query";
import {getNearbyRestaurants, searchRestaurantsByAddress} from "./service/RestaurantService.ts";
import ErrorState from "./components/ErrorState.tsx";
import LoadingState from "./components/LoadingState.tsx";
import EmptyState from "./components/EmptyState.tsx";

function getErrorMessage(error: unknown, fallback: string): string {
    if (error && typeof error === "object" && "response" in error) {
        const response = (error as { response?: { data?: { message?: string } } }).response;
        if (response?.data?.message) {
            return response.data.message;
        }
    }
    return fallback;
}

function App() {

    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [view, setView] = useState<ViewMode>("map");
    const [radius, setRadius] = useState<number>(2000);
    const [searchAddress, setSearchAddress] = useState<string | null>(null);

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

    const isSearching = searchAddress !== null;

    const handleSearch = useCallback((address: string) => {
        setSearchAddress(address);
    }, []);

    const handleClearSearch = useCallback(() => {
        setSearchAddress(null);
    }, []);

    const nearbyQuery = useQuery({
        queryKey: ["nearbyRestaurants", userLocation, radius],
        queryFn: () => getNearbyRestaurants(
            userLocation!.latitude,
            userLocation!.longitude,
            radius
        ),
        enabled: userLocation !== null && !isSearching,
    });

    const searchQuery = useQuery({
        queryKey: ["addressSearch", searchAddress, radius],
        queryFn: () => searchRestaurantsByAddress(searchAddress!, radius),
        enabled: isSearching,
    });

    const activeQuery = isSearching ? searchQuery : nearbyQuery;
    const restaurants = isSearching ? searchQuery.data?.restaurants : nearbyQuery.data;
    const {isPending, isError} = activeQuery;

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
                onSearch={handleSearch}
                isSearching={isSearching && searchQuery.isFetching}
                isSearchActive={isSearching}
                searchError={isSearching && isError
                    ? getErrorMessage(searchQuery.error, "We couldn't find that address. Try a different search.")
                    : null}
                onClearSearch={handleClearSearch}
            />

            <main className="flex-1">
                {isPending ? (
                    <LoadingState message={isSearching ? "Searching restaurants..." : "Loading nearby restaurants..."} variant="cards" />
                ) : isError ? (
                    isSearching ? (
                        <EmptyState
                            title="Address not found"
                            description={getErrorMessage(searchQuery.error, "We couldn't find that address. Try a different search.")}
                        />
                    ) : (
                        <ErrorState
                            message={`We couldn't load nearby restaurants${nearbyQuery.error instanceof Error ? `: ${nearbyQuery.error.message}` : "."}`}
                            onRetry={() => nearbyQuery.refetch()}
                        />
                    )
                ) : restaurants && restaurants.length === 0 ? (
                    <EmptyState
                        title="No restaurants found"
                        description="We couldn't find any restaurants near this location. Try moving to another area or searching again."
                    />
                ) : view === "list" ? (
                    <RestaurantList
                        restaurants={restaurants!}
                        setSelectedRestaurant={setSelectedRestaurant}
                        onSelectRestaurant={() => setView("map")}
                    />
                ) : (
                    <RestaurantMap
                        userLocation={userLocation}
                        searchLocation={isSearching ? searchQuery.data?.location : null}
                        restaurants={restaurants!}
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
