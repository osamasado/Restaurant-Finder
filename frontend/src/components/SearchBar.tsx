import {useEffect, useRef, useState} from "react";
import type {FormEvent} from "react";
import {useQuery} from "@tanstack/react-query";
import {Loader2, MapPin, Search, X} from "lucide-react";
import {useDebounce} from "../hooks/useDebounce.ts";
import {getAddressSuggestions} from "../service/RestaurantService.ts";
import type {AddressSuggestion} from "../types/AddressSuggestion.ts";

type SearchBarProps = {
    onSearch: (address: string) => void;
    isSearching: boolean;
    isSearchActive: boolean;
    onClearSearch: () => void;
}

export default function SearchBar({
    onSearch,
    isSearching,
    isSearchActive,
    onClearSearch
}: Readonly<SearchBarProps>) {

    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounce(query.trim(), 400);

    const {data: suggestions = [], isFetching: isFetchingSuggestions} = useQuery({
        queryKey: ["addressSuggestions", debouncedQuery],
        queryFn: () => getAddressSuggestions(debouncedQuery),
        enabled: debouncedQuery.length >= 3,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    // Close the suggestions dropdown when clicking anywhere outside the search bar.
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function runSearch(address: string) {
        const trimmed = address.trim();
        if (!trimmed) {
            return;
        }
        setIsOpen(false);
        onSearch(trimmed);
    }

    function selectSuggestion(suggestion: AddressSuggestion) {
        setQuery(suggestion.formattedAddress);
        runSearch(suggestion.formattedAddress);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        runSearch(query);
    }

    function handleClear() {
        setQuery("");
        setIsOpen(false);
        onClearSearch();
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                    {isFetchingSuggestions ? (
                        <Loader2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400"/>
                    ) : (
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"/>
                    )}
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search by address..."
                        aria-label="Search by address"
                        className="w-full rounded-full bg-white py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                    />
                    {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-slate-400"/>
                    )}
                </div>

                {isSearchActive && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:text-white"
                    >
                        <X className="size-3.5"/>
                        Clear
                    </button>
                )}
            </form>

            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-lg">
                    {suggestions.map((suggestion) => (
                        <li key={suggestion.formattedAddress}>
                            <button
                                type="button"
                                onClick={() => selectSuggestion(suggestion)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                                <MapPin className="size-4 shrink-0 text-slate-400"/>
                                <span className="truncate">{suggestion.formattedAddress}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
