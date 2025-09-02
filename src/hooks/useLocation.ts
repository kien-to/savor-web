import { useState, useEffect, useCallback } from 'react';
import { MapsService } from '../utils/maps';
import { DistanceResult } from '../../types';

interface Location {
  latitude: number;
  longitude: number;
}

interface UseLocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => void;
  calculateDistance: (storeLat: number, storeLng: number) => Promise<DistanceResult | null>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    console.log('[useLocation] Requesting user location...');
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      console.error('[useLocation] Geolocation not supported');
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('[useLocation] Location obtained:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            console.warn('[useLocation] Location permission denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            console.warn('[useLocation] Location information unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            console.warn('[useLocation] Location request timed out');
            break;
        }
        console.error('[useLocation] Location error:', errorMessage);
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  const calculateDistance = useCallback(
    async (storeLat: number, storeLng: number): Promise<DistanceResult | null> => {
      if (!location) {
        setError('Location not available');
        return null;
      }

      try {
        return await MapsService.calculateDistance(
          location.latitude,
          location.longitude,
          storeLat,
          storeLng
        );
      } catch (err) {
        console.error(err);
        setError('Failed to calculate distance');
        return null;
      }
    },
    [location]
  );

  // Auto-request location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    calculateDistance,
  };
}; 