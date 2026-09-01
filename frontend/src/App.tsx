import './App.css'
import {Route, Routes} from "react-router-dom";
import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

function App() {

  return (
    <>
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    <Route path="/list" element={<RestaurantList />} />
                    <Route path="/map" element={<RestaurantMap />} />
                </Routes>
            </main>

            <Footer/>
        </div>
    </>
  )
}

export default App
