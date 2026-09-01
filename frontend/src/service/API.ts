import axios from "axios";

const API_URL = "/api/restaurants";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;