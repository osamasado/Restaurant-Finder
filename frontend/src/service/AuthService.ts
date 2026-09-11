import api from "./API";
import type { User } from "../types/User";

export async function getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>("/auth");
    return data;
}

export function resolveBackendHost(): string {
    return window.location.host === "localhost:5174"
        ? "http://localhost:8080"
        : window.location.origin;
}

export function readCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
}
