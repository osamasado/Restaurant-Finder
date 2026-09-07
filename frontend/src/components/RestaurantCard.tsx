import {Clock, Globe, Leaf, MapPin, Navigation, Phone, UtensilsCrossed} from "lucide-react";
import type {Restaurant} from "../types/Restaurant";

type RestaurantCardProps = {
    restaurant: Restaurant,
    setSelectedRestaurant: (restaurant: Restaurant) => void,
    onSelectRestaurant: () => void
}

export default function RestaurantCard(
    {
        restaurant,
        setSelectedRestaurant,
        onSelectRestaurant
    }: Readonly<RestaurantCardProps>) {

    return (
        <div
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <img
                src={restaurant.imageUrl ?? "/images/restaurant-placeholder.svg"}
                alt={restaurant.name}
                className="h-36 w-full object-cover"
            />

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{restaurant.name}</h2>
                    <button
                        onClick={() => {
                            setSelectedRestaurant(restaurant);
                            onSelectRestaurant();
                        }}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <Navigation className="size-3"/>
                        {Math.round(restaurant.distance)} m
                    </button>
                </div>

                <div className="mt-2 flex flex-col gap-1">
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="size-4 shrink-0 text-slate-400"/>
                        {restaurant.address}
                    </p>

                    {restaurant.cuisine && (
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                            <UtensilsCrossed className="size-4 shrink-0 text-slate-400"/>
                            {restaurant.cuisine}
                        </p>
                    )}

                    {restaurant.openingHours && (
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                            <Clock className="size-4 shrink-0 text-slate-400"/>
                            {restaurant.openingHours}
                        </p>
                    )}

                    {restaurant.phone && (
                        <p className="flex items-center gap-2 text-sm text-slate-500">
                            <Phone className="size-4 shrink-0 text-slate-400"/>
                            {restaurant.phone}
                        </p>
                    )}

                    {restaurant.website && (
                        <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <Globe className="size-4 shrink-0 text-slate-400"/>
                            Website
                        </a>
                    )}
                </div>

                {(restaurant.vegetarian || restaurant.vegan) && (
                    <div className="mt-2 flex gap-2">
                        {restaurant.vegetarian && (
                            <span
                                className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                                <Leaf className="size-3"/>
                                Vegetarian
                            </span>
                        )}
                        {restaurant.vegan && (
                            <span
                                className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                                <Leaf className="size-3"/>
                                Vegan
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
