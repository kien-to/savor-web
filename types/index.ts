export interface Store {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  pickUpTime: string | null;
  distance: string;
  price: number;
  originalPrice?: number;
  discountedPrice?: number;
  backgroundUrl?: string;
  avatarUrl?: string | null;
  rating?: number;
  reviews?: number;
  address?: string;
  itemsLeft?: number;
  highlights?: string[];
  isSaved?: boolean;
  latitude: number;
  longitude: number;
  is_selling: boolean;
}

export interface HomePageData {
  emailVerified: boolean;
  userLocation: {
    city: string;
    distance: number;
  };
  recommendedStores: Store[];
  pickUpTomorrow: Store[];
}

export interface SurpriseBag {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  quantity: number;
  pickupTime: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  bagId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  pickupTime: string;
  quantity: number;
} 