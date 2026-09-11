import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, readCsrfToken, resolveBackendHost } from "../service/AuthService";

export function useAuth() {
    const query = useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        retry: false,
    });

    const login = useCallback(() => {
        window.open(resolveBackendHost() + "/oauth2/authorization/github", "_self");
    }, []);

    const logout = useCallback(async () => {
        try {
            const csrfToken = readCsrfToken();
            await fetch("/logout", {
                method: "POST",
                credentials: "include",
                headers: csrfToken ? { "X-XSRF-TOKEN": csrfToken } : undefined,
            });
        } finally {
            window.location.href = "/";
        }
    }, []);

    return {
        authenticated: query.isSuccess,
        user: query.data,
        isLoading: query.isLoading,
        login,
        logout,
    };
}
