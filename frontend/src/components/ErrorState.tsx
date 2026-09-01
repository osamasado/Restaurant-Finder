import { CircleAlert } from "lucide-react";

export default function ErrorState({ message }: { message: string }) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-4 text-center">
            <CircleAlert className="size-10 text-red-500" />
            <p className="text-sm font-medium text-red-600 max-w-md">{message}</p>
        </div>
    );
}
