import ViewToggle from "./ViewToggle.tsx";
import RadiusSlider from "./RadiusSlider.tsx";
import type {ViewMode} from "../types/ViewMode.ts";

type HeaderProps = {
    view: ViewMode;
    onChangeView: (view: ViewMode) => void;
    radius: number;
    onChangeRadius: (radius: number) => void;
    isLoadingRestaurants?: boolean;
    resultCount?: number;
}

export default function Header({
    view,
    onChangeView,
    radius,
    onChangeRadius,
    isLoadingRestaurants,
    resultCount
}: Readonly<HeaderProps>) {
    return (
        <header className="bg-slate-900 px-6 py-8 text-white sm:py-12">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Restaurant Finder
                </p>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Find great restaurants nearby
                    </h1>
                    <p className="mt-2 text-sm text-slate-300 sm:text-base">
                        Discover restaurants around your location
                    </p>
                </div>

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
