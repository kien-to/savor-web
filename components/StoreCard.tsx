'use client';

import { useEffect, useState } from 'react';
import { Store } from '../types';
import { MapsService } from '../src/utils/maps';
import { useLocation } from '../src/hooks/useLocation';
import '../styles/StoreCard.scss';

interface StoreCardProps {
  store: Store;
  onReserve?: (store: Store) => void;
}

export default function StoreCard({ store, onReserve }: StoreCardProps) {
  const { location } = useLocation();
  const [distance, setDistance] = useState<string>('');
  const [directionsUrl, setDirectionsUrl] = useState<string>('');
  const [distanceLoading, setDistanceLoading] = useState(false);

  useEffect(() => {
    const fetchDistance = async () => {
      if (location && store.latitude && store.longitude) {
        setDistanceLoading(true);
        try {
          const result = await MapsService.calculateDistance(
            location.latitude,
            location.longitude,
            store.latitude,
            store.longitude
          );
          setDistance(result.distance);
          setDirectionsUrl(
            MapsService.generateGoogleMapsURL(
              location.latitude,
              location.longitude,
              store.latitude,
              store.longitude
            )
          );
        } finally {
          setDistanceLoading(false);
        }
      }
    };
    fetchDistance();
  }, [location, store.latitude, store.longitude]);

  return (
    <div className="store-card">
      <div className="store-card__image-container">
        <img
          src={store.imageUrl}
          alt={store.title}
        />
        <div className="store-card__badge">
          <span>Còn {store.bagsAvailable} túi</span>
        </div>
        {/* Directions button at top right */}
        {directionsUrl && (
          <button
            className="store-card__directions-btn"
            onClick={() => window.open(directionsUrl, '_blank')}
            title="Chỉ đường"
          >
            Chỉ đường
          </button>
        )}
      </div>
      <div className="store-card__content">
        <div className="store-card__header">
          <div className="store-card__logo">
            {/* Store logo would go here */}
          </div>
          <div className="store-card__info">
            <h3 className="store-card__title">{store.title}</h3>
            <div className="store-card__meta">
              <span className="rating">★</span>
              <span className="rating">4.6</span>
              <span>·</span>
              <span>{distanceLoading ? '...' : distance || '0 km'}</span>
            </div>
          </div>
          <div className="store-card__price">
            <span className="store-card__price-original">
              {/* {69}k đ */}
              {store.originalPrice?.toFixed(2)}k đ
            </span>
            <span className="store-card__price-discounted">
              {/* {60}k đ */}
              {store.discountedPrice?.toFixed(2)}k đ
            </span>
          </div>
        </div>
        
        <button
          onClick={() => onReserve?.(store)}
          className="store-card__reserve"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
} 