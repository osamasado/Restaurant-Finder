import {Clock, Globe, Leaf, MapPin, Navigation, Phone, UtensilsCrossed} from "lucide-react";
import type {Restaurant} from "../types/Restaurant";

type RestaurantPopupCardProps = {
    restaurant: Restaurant,
    onSelectRestaurant: () => void,
}

export default function RestaurantPopupCard(
    {restaurant, onSelectRestaurant}: Readonly<RestaurantPopupCardProps>
) {
    return (
        <div className="w-56">
            <img
                src={restaurant.imageUrl ?? "/images/restaurant-placeholder.svg"}
                alt={restaurant.name}
                className="h-28 w-full object-cover"
            />

            <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{restaurant.name}</p>
                    <button
                        onClick={onSelectRestaurant}
                        className="flex shrink-0 items-center gap-1 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <Navigation className="size-3"/>
                        {Math.round(restaurant.distance)} m
                    </button>
                </div>

                <div className="mt-1.5 flex flex-col gap-1">
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="size-3.5 shrink-0 text-slate-400"/>
                        {restaurant.address}
                    </p>

                    {restaurant.cuisine && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <UtensilsCrossed className="size-3.5 shrink-0 text-slate-400"/>
                            {restaurant.cuisine}
                        </p>
                    )}

                    {restaurant.openingHours && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="size-3.5 shrink-0 text-slate-400"/>
                            {restaurant.openingHours}
                        </p>
                    )}

                    {restaurant.phone && (
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone className="size-3.5 shrink-0 text-slate-400"/>
                            {restaurant.phone}
                        </p>
                    )}

                    {restaurant.website && (
                        <a
                            href={restaurant.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline"
                        >
                            <Globe className="size-3.5 shrink-0 text-slate-400"/>
                            Website
                        </a>
                    )}
                </div>

                {(restaurant.vegetarian || restaurant.vegan) && (
                    <div className="mt-2 flex gap-1.5">
                        {restaurant.vegetarian && (
                            <span
                                className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">
                                <Leaf className="size-3"/>
                                Vegetarian
                            </span>
                        )}
                        {restaurant.vegan && (
                            <span
                                className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">
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
