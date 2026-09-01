import { SearchX } from "lucide-react";

export default function EmptyState({ message }: { message: string }) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-4 text-center">
            <SearchX className="size-10 text-slate-400" />
            <p className="text-sm font-medium text-slate-500 max-w-md">{message}</p>
        </div>
    );
}
