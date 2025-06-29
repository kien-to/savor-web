import React, { useState, useEffect } from 'react';
import { Store, DistanceResult } from '../../types';
import { useLocation } from '../hooks/useLocation';
import { MapsService } from '../utils/maps';

interface StoreLocationProps {
  store: Store;
  showDirections?: boolean;
}

export const StoreLocation: React.FC<StoreLocationProps> = ({ store, showDirections = true }) => {
  const { location, calculateDistance, error: locationError, requestLocation } = useLocation();
  const [distance, setDistance] = useState<DistanceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      requestLocation();
    }
  }, [location, requestLocation]);

  const handleGetDistance = async () => {
    if (!location || !store.latitude || !store.longitude) return;

    setIsLoading(true);
    setApiError(null);
    try {
      const distanceResult = await calculateDistance(store.latitude, store.longitude);
      if (distanceResult) {
        setDistance(distanceResult);
      } else {
        setApiError("Could not calculate distance.");
      }
    } catch (error) {
      console.error('Failed to calculate distance:', error);
      setApiError("Could not calculate distance.");
    } finally {
      setIsLoading(false);
    }
  };

  const openDirections = () => {
    if (location && store.latitude && store.longitude) {
      const url = MapsService.generateGoogleMapsURL(
        location.latitude,
        location.longitude,
        store.latitude,
        store.longitude
      );
      window.open(url, '_blank');
    } else if (store.latitude && store.longitude) {
      // Fallback if user location is not available, open store location on map
      const destination = `${store.latitude},${store.longitude}`;
      const url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
      window.open(url, '_blank');
    }
  };
  
  if (!store.latitude || !store.longitude) {
    return null;
  }

  if (distance) {
    return (
      <div className="text-xs text-gray-600 py-2">
        <span>{distance.distance} - {distance.duration} away</span>
        <button onClick={openDirections} className="text-blue-500 hover:underline ml-2">
          Directions
        </button>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="flex items-center space-x-2">
        {location && (
          <button
            onClick={handleGetDistance}
            disabled={isLoading}
            className="px-2 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Show Distance'}
          </button>
        )}
        {showDirections && (
          <button
            onClick={openDirections}
            className="px-2 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Directions
          </button>
        )}
      </div>
      {(locationError || apiError) && <p className="text-xs text-red-500 mt-1">{locationError || apiError}</p>}
    </div>
  );
}; 