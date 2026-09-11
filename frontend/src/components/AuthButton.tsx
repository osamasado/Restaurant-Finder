import {LogIn, LogOut} from "lucide-react";
import type {User} from "../types/User.ts";

type AuthButtonProps = {
    authenticated: boolean;
    user?: User;
    isLoading: boolean;
    onLogin: () => void;
    onLogout: () => void;
}

export default function AuthButton({
    authenticated,
    user,
    isLoading,
    onLogin,
    onLogout
}: Readonly<AuthButtonProps>) {

    if (isLoading) {
        return <div className="h-7 w-16 sm:h-9 sm:w-24" aria-hidden="true"/>;
    }

    if (authenticated) {
        return (
            <div className="flex items-center gap-2 sm:gap-3">
                <span className="hidden text-sm text-slate-300 sm:inline">
                    Hallo, {user?.username}
                </span>
                <button
                    type="button"
                    onClick={onLogout}
                    className="flex shrink-0 items-center gap-1 rounded-full bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-1.5 sm:px-3 sm:py-2"
                >
                    <LogOut className="size-3 sm:size-3.5"/>
                    Log out
                </button>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onLogin}
            className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:gap-1.5 sm:px-3 sm:py-2 sm:text-sm"
        >
            <LogIn className="size-3.5 sm:size-4"/>
            Log in<span className="hidden sm:inline"> with GitHub</span>
        </button>
    );
}
