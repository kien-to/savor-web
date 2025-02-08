'use client';

import { Store } from '../types';
import '../styles/StoreCard.scss';

interface StoreCardProps {
  store: Store;
  onReserve?: (store: Store) => void;
}

export default function StoreCard({ store, onReserve }: StoreCardProps) {
  return (
    <div className="store-card">
      <div className="store-card__image-container">
        <img
          src={store.imageUrl}
          alt={store.title}
        />
        <div className="store-card__badge">
          <span>1 left</span>
        </div>
        <button 
          className="store-card__favorite"
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement save functionality
          }}
        >
          🤍
        </button>
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
              <span>{store.distance}</span>
            </div>
          </div>
          <div className="store-card__price">
            ${store.price.toFixed(2)}
          </div>
        </div>
        <button
          onClick={() => onReserve?.(store)}
          className="store-card__reserve"
        >
          Reserve
        </button>
      </div>
    </div>
  );
} 