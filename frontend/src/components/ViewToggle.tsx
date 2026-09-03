import type {ViewMode} from "../types/ViewMode.ts";

export default function ViewToggle({
    view,
    onChangeView
}: Readonly<{
    view: ViewMode;
    onChangeView: (view: ViewMode) => void;
}>) {
    return (
        <nav>
            <button
                key="list-btn"
                onClick={() => onChangeView("list")}
                className={`border px-1 border-amber-500 ${
                    view === "list"
                        ? "bg-blue-500 text-white"
                        : " hover:text-blue-400"
                }`}
            >
                List
            </button>

            <button
                key="map-btn"
                onClick={() => onChangeView("map")}
                className={`border px-1 border-amber-500 ${
                    view === "map"
                        ? "bg-blue-500 text-white"
                        : " hover:text-blue-400"
                }`}
            >
                Map
            </button>
        </nav>
    )
}
