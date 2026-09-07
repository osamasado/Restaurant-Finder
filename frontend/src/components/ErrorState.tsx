import { CircleAlert, RefreshCw } from "lucide-react";

type ErrorStateProps = {
    message: string;
    onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: Readonly<ErrorStateProps>) {
    return (
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-6 py-24 text-center">
            <CircleAlert className="size-10 text-red-500" />
            <div>
                <p className="font-semibold text-slate-900">Something went wrong</p>
                <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
            </div>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    <RefreshCw className="size-4" />
                    Try again
                </button>
            )}
        </div>
    );
}
