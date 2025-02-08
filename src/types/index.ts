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
  isSaved: boolean;
} 