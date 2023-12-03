export interface RestaurantListItem {
  restaurant_id: number;
  restaurant_name: string;
  city: string;
  cuisine: string;
}

export function isRestaurantListItem(obj: any): obj is RestaurantListItem {
  return (
    typeof obj === "object" &&
    typeof obj.restaurant_id === "number" &&
    typeof obj.restaurant_name === "string" &&
    typeof obj.city === "string" &&
    typeof obj.cuisine === "string"
  );
}
