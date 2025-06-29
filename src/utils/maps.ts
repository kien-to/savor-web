import { DistanceResult, Store } from '../../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class MapsService {
  static async calculateDistance(
    userLat: number,
    userLng: number,
    storeLat: number,
    storeLng: number
  ): Promise<DistanceResult> {
    const response = await fetch(
      `${API_BASE_URL}/api/maps/distance?userLat=${userLat}&userLng=${userLng}&storeLat=${storeLat}&storeLng=${storeLng}`
    );

    if (!response.ok) {
      throw new Error('Failed to calculate distance');
    }

    return response.json();
  }

  static async getStoreWithDistance(
    storeId: string,
    userLat: number,
    userLng: number
  ): Promise<{
    store: Store;
    distance?: DistanceResult;
  }> {
    const response = await fetch(
      `${API_BASE_URL}/api/maps/stores/${storeId}?userLat=${userLat}&userLng=${userLng}`
    );

    if (!response.ok) {
      throw new Error('Failed to get store with distance');
    }

    return response.json();
  }

  static generateGoogleMapsURL(
    userLat: number,
    userLng: number,
    storeLat: number,
    storeLng: number
  ): string {
    const origin = `${userLat},${userLng}`;
    const destination = `${storeLat},${storeLng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  }
} 