export interface Store {
  id: string;
  title: string;
  description: string;
  pickupTime: string;
  price: number;
  originalPrice: number;
  backgroundUrl: string;
  avatarUrl: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  address: string;
  itemsLeft: number;
  latitude: number;
  longitude: number;
  distance: string;
  googleMapsUrl?: string;
  isSaved: boolean;
}

export interface DistanceResult {
  distance: string;
  duration: string;
  meters: number;
  seconds: number;
}

export interface DirectionsResult {
  googleMapsUrl: string;
  distance: string;
  duration: string;
} 