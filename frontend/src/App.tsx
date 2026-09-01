import './App.css'
import {Route, Routes} from "react-router-dom";
import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import {useEffect, useState} from "react";
import type {Position} from "./types/Position.ts";

function App() {

    const [position, setPosition] = useState<Position | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (location) => {
                setPosition({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
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
                    <Route path="/map" element={<RestaurantMap position={position}/>} />
                </Routes>
            </main>

            <Footer/>
        </div>
    </>
  )
}

export default App
