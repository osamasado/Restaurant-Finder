import { SearchX } from "lucide-react";

type EmptyStateProps = {
    title: string;
    description: string;
}

export default function EmptyState({ title, description }: Readonly<EmptyStateProps>) {
    return (
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-6 py-24 text-center">
            <SearchX className="size-10 text-slate-400" />
            <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
            </div>
        </div>
    );
}
