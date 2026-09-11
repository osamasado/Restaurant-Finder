import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, resolveBackendHost } from "../service/AuthService";

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
            await fetch("/logout", {
                method: "POST",
                credentials: "include",
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
