'use client';

import { useEffect, useState, useCallback } from 'react';
import { HomePageData, Store } from '../types';
import { getHomePageData } from '../utils/api';
import Link from 'next/link';
import StoreCard from './StoreCard';
import '../styles/HomePage.scss';

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [filteredHomeData, setFilteredHomeData] = useState<HomePageData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      // Mock location for demo - replace with actual geolocation
      const mockLocation = {
        latitude: 37.7749,
        longitude: -122.4194
      };
      
      const data = await getHomePageData(mockLocation.latitude, mockLocation.longitude);
      setHomeData(data);
      setFilteredHomeData(data);
    } catch (err) {
      setError('Failed to fetch home data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchHomeData();
    }
  }, [fetchHomeData]);

  useEffect(() => {
    if (!homeData) {
      setFilteredHomeData(null);
      return;
    }

    if (!searchText.trim()) {
      setFilteredHomeData(homeData);
      return;
    }

    const searchLower = searchText.toLowerCase().trim();
    
    const filteredRecommended = homeData.recommendedStores.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      store.description.toLowerCase().includes(searchLower)
    );

    const filteredPickUpTomorrow = homeData.pickUpTomorrow.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      store.description.toLowerCase().includes(searchLower)
    );

    setFilteredHomeData({
      ...homeData,
      recommendedStores: filteredRecommended,
      pickUpTomorrow: filteredPickUpTomorrow,
    });
  }, [searchText, homeData]);

  const handleReserve = (store: Store) => {
    setSelectedStore(store);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (method: string) => {
    // TODO: Implement payment processing
    console.log('Processing payment with method:', method);
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="home-page__header">
        <div className="home-page__header-location">
          <span>📍</span>
          <h2>{homeData?.userLocation?.city || 'Loading location...'}</h2>
        </div>
        <p className="home-page__header-distance">
          within {homeData?.userLocation?.distance || 0} mi
        </p>
      </div>

      <div className="home-page__search">
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="home-page__search-icon">🔍</span>
      </div>

      {searchText.trim().length > 0 && 
       filteredHomeData?.recommendedStores.length === 0 && 
       filteredHomeData?.pickUpTomorrow.length === 0 && (
        <div className="home-page__no-results">
          No stores found matching &quot;{searchText}&quot;
        </div>
      )}

      <main>
        <section className="home-page__section">
          <div className="home-page__section-header">
            <h2>Recommended for you</h2>
            <Link href="/stores/recommended">See all</Link>
          </div>
          <div className="home-page__section-scroll">
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--left"
              onClick={() => {
                const container = document.getElementById('recommended-scroll');
                if (container) {
                  container.scrollBy({ left: -280, behavior: 'smooth' });
                }
              }}
            >
              ←
            </button>
            <div 
              id="recommended-scroll"
              className="home-page__section-scroll-container"
            >
              {filteredHomeData?.recommendedStores.map(store => (
                <StoreCard key={store.id} store={store} onReserve={handleReserve} />
              ))}
            </div>
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--right"
              onClick={() => {
                const container = document.getElementById('recommended-scroll');
                if (container) {
                  container.scrollBy({ left: 280, behavior: 'smooth' });
                }
              }}
            >
              →
            </button>
          </div>
        </section>

        <section className="home-page__section">
          <div className="home-page__section-header">
            <h2>Pick up tomorrow</h2>
            <Link href="/stores/tomorrow">See all</Link>
          </div>
          <div className="home-page__section-scroll">
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--left"
              onClick={() => {
                const container = document.getElementById('tomorrow-scroll');
                if (container) {
                  container.scrollBy({ left: -280, behavior: 'smooth' });
                }
              }}
            >
              ←
            </button>
            <div 
              id="tomorrow-scroll"
              className="home-page__section-scroll-container"
            >
              {filteredHomeData?.pickUpTomorrow.map(store => (
                <StoreCard key={store.id} store={store} onReserve={handleReserve} />
              ))}
            </div>
            <button 
              className="home-page__section-scroll-button home-page__section-scroll-button--right"
              onClick={() => {
                const container = document.getElementById('tomorrow-scroll');
                if (container) {
                  container.scrollBy({ left: 280, behavior: 'smooth' });
                }
              }}
            >
              →
            </button>
          </div>
        </section>
      </main>

      {showPaymentModal && selectedStore && (
        <div className="payment-modal">
          <div className="payment-modal__content">
            <div className="payment-modal__header">
              <div className="payment-modal__header-inner">
                <button onClick={() => setShowPaymentModal(false)}>✕</button>
                <h2>{selectedStore.title}</h2>
                <div></div>
              </div>
              <p className="payment-modal__header-pickup">
                Pick up {selectedStore.pickUpTime}
              </p>
            </div>

            <div className="payment-modal__body">
              <h3>PAYMENT METHOD</h3>
              <div className="payment-modal__methods">
                {[
                  { id: 'card', name: 'Payment card', icon: '💳' },
                  { id: 'apple', name: 'Apple Pay', icon: '' },
                  { id: 'paypal', name: 'PayPal', icon: '' },
                  { id: 'cash', name: 'Cash App Pay', icon: '💵' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentSubmit(method.id)}
                  >
                    <div className="method-info">
                      <span>{method.icon}</span>
                      <span>{method.name}</span>
                    </div>
                    <span className="arrow">›</span>
                  </button>
                ))}
              </div>

              <div className="payment-modal__summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${selectedStore.price.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Sales taxes</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row">
                  <span className="total">Total</span>
                  <span className="total">${selectedStore.price.toFixed(2)}</span>
                </div>
              </div>

              <p className="payment-modal__terms">
                By reserving this meal you agree to the Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 