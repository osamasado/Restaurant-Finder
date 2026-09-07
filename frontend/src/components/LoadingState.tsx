import { LoaderCircle } from "lucide-react";

type LoadingStateProps = {
    message: string;
    variant?: "spinner" | "cards";
}

export default function LoadingState({ message, variant = "spinner" }: Readonly<LoadingStateProps>) {
    if (variant === "cards") {
        return (
            <div className="mx-auto max-w-5xl px-6 py-8" role="status" aria-label={message}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                            <div className="h-36 w-full animate-pulse bg-slate-200" />
                            <div className="flex flex-col gap-2 p-4">
                                <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-6 py-24 text-slate-500" role="status">
            <LoaderCircle className="size-10 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
