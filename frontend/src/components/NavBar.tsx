import {useNavigate} from "react-router-dom";

export default function NavBar() {
    const navigate = useNavigate()

    return(
        <nav>
            <button onClick={() => navigate("/list")}>
                List
            </button>

            <button onClick={() => navigate("/map")}>
                Map
            </button>

        </nav>
    )
}