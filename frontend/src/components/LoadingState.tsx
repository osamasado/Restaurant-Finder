import { LoaderCircle } from "lucide-react";

export default function LoadingState({ message }: { message: string }) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-4 text-slate-500">
            <LoaderCircle className="size-10 animate-spin text-blue-500" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
