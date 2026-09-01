import { Clock, Leaf, MapPin, Navigation, Phone, UtensilsCrossed } from "lucide-react";
import type { Restaurant } from "../types/Restaurant";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    return (
        <div className="border border-amber-500 rounded-xl p-4 shadow-sm bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold text-slate-900">{restaurant.name}</h2>
                <span className="shrink-0 flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    <Navigation className="size-3" />
                    {Math.round(restaurant.distance)} m
                </span>
            </div>

            <div className="flex flex-col gap-1.5 mt-3">
                <p className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="size-4 text-slate-400 shrink-0" />
                    {restaurant.address}
                </p>

                {restaurant.cuisine && (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                        <UtensilsCrossed className="size-4 text-slate-400 shrink-0" />
                        {restaurant.cuisine}
                    </p>
                )}

                {restaurant.openingHours && (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="size-4 text-slate-400 shrink-0" />
                        {restaurant.openingHours}
                    </p>
                )}

                {restaurant.phone && (
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                        <Phone className="size-4 text-slate-400 shrink-0" />
                        {restaurant.phone}
                    </p>
                )}
            </div>

            {(restaurant.vegetarian || restaurant.vegan) && (
                <div className="flex gap-2 mt-3">
                    {restaurant.vegetarian && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            <Leaf className="size-3" />
                            Vegetarian
                        </span>
                    )}
                    {restaurant.vegan && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            <Leaf className="size-3" />
                            Vegan
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
