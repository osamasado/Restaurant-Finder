import ViewToggle from "./ViewToggle.tsx";
import type {ViewMode} from "../types/ViewMode.ts";

export default function Header({
    view,
    onChangeView
}: Readonly<{
    view: ViewMode;
    onChangeView: (view: ViewMode) => void;
}>) {
    return (
        <header className="bg-slate-900 text-white py-10 px-6 shadow-lg">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Restaurant Finder
                </h1>
                <ViewToggle view={view} onChangeView={onChangeView} />
            </div>
        </header>
    )
}