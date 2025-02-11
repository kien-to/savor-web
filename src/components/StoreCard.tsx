import React from 'react';
import { Store } from '../types';

interface StoreCardProps {
  store: Store;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  function handleReserve(): void {
    throw new Error('Function not implemented.');
  }

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-28"> {/* Reduced height */}
          <img
            src={store.imageUrl}
            alt={store.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-0.5 rounded-full text-xs">
            <span className="font-medium">1 left</span>
          </div>
          <button 
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white bg-opacity-90 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            🤍
          </button>
        </div>
        <div className="p-2"> {/* Reduced padding */}
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
              {/* Store logo */}
            </div>
            <div className="min-w-0">
              <h3 className="font-medium text-sm truncate">{store.title}</h3>
            </div>
          </div>
          <div className="mb-1">
            <h4 className="font-medium text-sm">Surprise Bag</h4>
            <p className="text-xs text-gray-600">
              Pick up {store.pickupTime}
            </p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <span className="text-green-600 text-xs">★</span>
              <span className="font-medium text-xs">4.6</span>
              <span className="text-gray-500 text-xs">{store.distance}</span>
            </div>
            <span className="font-semibold text-teal-700">${store.price.toFixed(2)}</span>
          </div>
          <button
            onClick={() => handleReserve()}
            className="mt-1.5 w-full bg-teal-600 text-white text-xs py-1.5 rounded hover:bg-teal-700 transition-colors"
          >
            Reserve
          </button>
        </div>
      </div>
    );
  };

export default StoreCard; 
