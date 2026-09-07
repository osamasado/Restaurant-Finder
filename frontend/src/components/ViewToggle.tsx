import {List, Map} from "lucide-react";
import type {ViewMode} from "../types/ViewMode.ts";

type ViewToggleProps = {
    view: ViewMode;
    onChangeView: (view: ViewMode) => void;
}

const OPTIONS: { value: ViewMode; label: string; icon: typeof Map }[] = [
    {value: "map", label: "Map", icon: Map},
    {value: "list", label: "List", icon: List},
];

export default function ViewToggle({
    view,
    onChangeView
}: Readonly<ViewToggleProps>) {
    return (
        <div
            role="radiogroup"
            aria-label="View mode"
            className="inline-flex gap-1 rounded-full bg-white/10 p-1"
        >
            {OPTIONS.map(({value, label, icon: Icon}) => {
                const active = view === value;
                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => onChangeView(value)}
                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                            active
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-200 hover:text-white"
                        }`}
                    >
                        <Icon className="size-4"/>
                        {label}
                    </button>
                );
            })}
        </div>
    )
}
