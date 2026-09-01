import './App.css'
import {Route, Routes} from "react-router-dom";
import RestaurantList from "./pages/RestaurantList.tsx";
import RestaurantMap from "./pages/RestaurantMap.tsx";
import NavBar from "./components/NavBar.tsx";

function App() {

  return (
    <>
     <NavBar/>
     <Routes>
         <Route path="/list" element={<RestaurantList />} />
         <Route path="/map" element={<RestaurantMap />} />
     </Routes>
    </>
  )
}

export default App
