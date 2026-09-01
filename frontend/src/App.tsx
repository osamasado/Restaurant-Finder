import './App.css'
import {Route, Routes} from "react-router-dom";
import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import {useEffect, useState} from "react";
import type {Location} from "./types/Location.ts";

function App() {

    const [userLocation, setUserLocation] = useState<Location | null>(null);

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
            }
        );
    }, []);

  return (
    <>
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    <Route path="/list" element={<RestaurantList />} />
                    <Route path="/map" element={<RestaurantMap userLocation={userLocation}/>} />
                </Routes>
            </main>

            <Footer/>
        </div>
    </>
  )
}

export default App
