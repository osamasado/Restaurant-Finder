import RestaurantCard from "../components/RestaurantCard";
import type {Restaurant} from "../types/Restaurant.ts";
import type { Location } from "../types/Location.ts";

export default function RestaurantList({
                                           restaurants,
                                           userLocation
                                       }: Readonly<{
    restaurants: Restaurant[],
    userLocation: Location
}>) {
    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        userLocation={userLocation}
                    />
                ))}
            </div>
        </div>
    );
}
