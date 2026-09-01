import './App.css'
import {Route, Routes} from "react-router-dom";
import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import {useEffect, useState} from "react";
import type {Location} from "./types/Location.ts";
import {useQuery} from "@tanstack/react-query";
import {getNearbyRestaurants} from "./service/RestaurantService.ts";
import ErrorState from "./components/ErrorState.tsx";
import LoadingState from "./components/LoadingState.tsx";
import EmptyState from "./components/EmptyState.tsx";

function App() {

    const [userLocation, setUserLocation] = useState<Location | null>(null);
    const [geoError, setGeoError] = useState<string | null>(null);

    useEffect(() => {
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



    const {
        data: restaurants,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["nearbyRestaurants", userLocation],
        queryFn: () => getNearbyRestaurants(userLocation!.latitude, userLocation!.longitude),
        enabled: userLocation !== null,
    });

    if (geoError) {
        return <ErrorState message={geoError} />;
    }

    if (!userLocation) {
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
    <>
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    <Route path="/list" element={<RestaurantList restaurants={restaurants} />} />
                    <Route path="/map" element={<RestaurantMap userLocation={userLocation} restaurants={restaurants} />} />
                </Routes>
            </main>

            <Footer/>
        </div>
    </>
  )
}

export default App
