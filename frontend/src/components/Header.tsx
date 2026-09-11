import ViewToggle from "./ViewToggle.tsx";
import RadiusSlider from "./RadiusSlider.tsx";
import SearchBar from "./SearchBar.tsx";
import AuthButton from "./AuthButton.tsx";
import type {ViewMode} from "../types/ViewMode.ts";
import type {User} from "../types/User.ts";

type HeaderProps = {
    view: ViewMode;
    onChangeView: (view: ViewMode) => void;
    radius: number;
    onChangeRadius: (radius: number) => void;
    isLoadingRestaurants?: boolean;
    resultCount?: number;
    onSearch: (address: string) => void;
    isSearching: boolean;
    isSearchActive: boolean;
    searchError: string | null;
    onClearSearch: () => void;
    authenticated: boolean;
    user?: User;
    isAuthLoading: boolean;
    onLogin: () => void;
    onLogout: () => void;
}

export default function Header({
    view,
    onChangeView,
    radius,
    onChangeRadius,
    isLoadingRestaurants,
    resultCount,
    onSearch,
    isSearching,
    isSearchActive,
    searchError,
    onClearSearch,
    authenticated,
    user,
    isAuthLoading,
    onLogin,
    onLogout
}: Readonly<HeaderProps>) {
    return (
        <header className="bg-slate-900 px-6 py-8 text-white sm:py-12">
            <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between sm:mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Restaurant Finder
                </p>

                <AuthButton
                    authenticated={authenticated}
                    user={user}
                    isLoading={isAuthLoading}
                    onLogin={onLogin}
                    onLogout={onLogout}
                />
            </div>

            <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Find great restaurants nearby
                    </h1>
                    <p className="mt-2 text-sm text-slate-300 sm:text-base">
                        Discover restaurants around your location, or search near an address
                    </p>
                </div>

                <SearchBar
                    onSearch={onSearch}
                    isSearching={isSearching}
                    isSearchActive={isSearchActive}
                    onClearSearch={onClearSearch}
                />
                {searchError && (
                    <p className="max-w-md text-sm text-red-400" role="alert">
                        {searchError}
                    </p>
                )}

                <ViewToggle view={view} onChangeView={onChangeView}/>

                <RadiusSlider
                    value={radius}
                    onChange={onChangeRadius}
                    disabled={isLoadingRestaurants}
                />

                {resultCount !== undefined && (
                    <p className="text-sm text-slate-300">
                        <span className="font-semibold text-white">{resultCount}</span>{" "}
                        restaurant{resultCount === 1 ? "" : "s"} found
                    </p>
                )}
            </div>
        </header>
    )
}
