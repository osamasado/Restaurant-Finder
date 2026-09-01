import {useLocation, useNavigate} from "react-router-dom";

export default function NavBar() {
    const navigator = useNavigate();

    const location = useLocation();

    function navigateTo(url: string) {
        navigator(url);
    }

    const isList:boolean = location.pathname === "/list";
    const isMap:boolean = location.pathname === "/map";

    return(
        <nav>


            <button
                key="list-btn"
                onClick={() => navigateTo("/list")}
                className={`border px-1 border-amber-500 ${
                    isList
                        ? "bg-blue-500 text-white"
                        : " hover:text-blue-400"
                }`}
            >
                List
            </button>

            <button
                key="map-btn"
                onClick={() => navigateTo("/map")}
                className={`border px-1 border-amber-500 ${
                    isMap
                        ? "bg-blue-500 text-white"
                        : " hover:text-blue-400"
                }`}
            >
                Map
            </button>
        </nav>
    )
}