import axios from "axios";

const API_URL = "/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;