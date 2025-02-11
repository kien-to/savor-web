'use client';

import { useEffect, useState, useCallback } from 'react';
import { HomePageData, Store } from '../types';
import { getHomePageData } from '../utils/api';
import Link from 'next/link';
import StoreCard from './StoreCard';
import '../styles/HomePage.scss';

const HANOI_DISTRICTS = [
  { name: 'Ba Đình', coordinates: { lat: 21.0337, lng: 105.8140 } },
  { name: 'Hoàn Kiếm', coordinates: { lat: 21.0287, lng: 105.8514 } },
  { name: 'Tây Hồ', coordinates: { lat: 21.0811, lng: 105.8185 } },
  { name: 'Long Biên', coordinates: { lat: 21.0381, lng: 105.8865 } },
  { name: 'Cầu Giấy', coordinates: { lat: 21.0359, lng: 105.7946 } },
  { name: 'Đống Đa', coordinates: { lat: 21.0180, lng: 105.8298 } },
  { name: 'Hai Bà Trưng', coordinates: { lat: 21.0088, lng: 105.8619 } },
  { name: 'Hoàng Mai', coordinates: { lat: 20.9762, lng: 105.8544 } },
  { name: 'Thanh Xuân', coordinates: { lat: 20.9961, lng: 105.8087 } },
];

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit Card', icon: '💳' },
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
  { id: 'zalopay', name: 'ZaloPay', icon: '📱' },
  { id: 'momo', name: 'Momo', icon: '💜' },
];

export default function HomePage() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [filteredHomeData, setFilteredHomeData] = useState<HomePageData | null>(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Hoàn Kiếm');
  const [locationLoading, setLocationLoading] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [guestInfoErrors, setGuestInfoErrors] = useState({
    name: '',
    contact: '',
  });
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]);

  const handleLocationSelect = async (district: typeof HANOI_DISTRICTS[0]) => {
    setSelectedLocation(district.name);
    setShowLocationDropdown(false);
    setLoading(true);
    
    try {
      console.log("district", district);
      const data = await getHomePageData(
        district.coordinates.lat,
        district.coordinates.lng
      );
      console.log("home page data", data);
      setHomeData(data);
      setFilteredHomeData(data);
    } catch (err) {
      setError('Failed to fetch data for selected location');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getHomePageData(
            position.coords.latitude,
            position.coords.longitude
          );
          setHomeData(data);
          setFilteredHomeData(data);
          setSelectedLocation('Current Location');
        } catch (err) {
          setError('Failed to fetch data for your location');
          console.error(err);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please select a district instead.');
        setLocationLoading(false);
      }
    );
  };

  const fetchHomeData = useCallback(async () => {
    try {
      setLoading(true);
      // Mock location for demo - replace with actual geolocation
      const mockLocation = {
        latitude: 37.7749,
        longitude: -122.4194
      };
      console.log("mock location", mockLocation);
      const data = await getHomePageData(mockLocation.latitude, mockLocation.longitude);
      // console.log("home page data", data);
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
      (store.description?.toLowerCase() || '').includes(searchLower)
    );

    const filteredPickUpTomorrow = homeData.pickUpTomorrow.filter(store =>
      store.title.toLowerCase().includes(searchLower) ||
      (store.description?.toLowerCase() || '').includes(searchLower)
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

  const validateGuestInfo = () => {
    const errors = {
      name: '',
      contact: '',
    };
    let isValid = true;

    if (!guestInfo.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!guestInfo.email && !guestInfo.phone) {
      errors.contact = 'Either email or phone is required';
      isValid = false;
    }

    setGuestInfoErrors(errors);
    return isValid;
  };

  const handlePaymentSubmit = async (method: string) => {
    if (!validateGuestInfo()) {
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement payment and reservation creation
      console.log('Processing reservation with:', {
        paymentMethod: method,
        guestInfo,
        store: selectedStore,
      });
      setShowPaymentModal(false);
      // Reset guest info after successful reservation
      setGuestInfo({
        name: '',
        email: '',
        phone: '',
      });
    } catch (err) {
      console.error('Error processing reservation:', err);
      alert('Failed to process reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method: typeof PAYMENT_METHODS[0]) => {
    console.log('Selected payment method:', method);
    setSelectedPaymentMethod(method);
    setShowPaymentMethodModal(false);
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
          <div className="home-page__location-selector">
            <button 
              className="home-page__location-btn"
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
            >
              <span>📍</span>
              <span>{selectedLocation}</span>
              <span className="home-page__location-arrow">▼</span>
            </button>
            {showLocationDropdown && (
              <div className="home-page__location-dropdown">
                <button 
                  className="home-page__location-option home-page__location-option--current"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? 'Getting location...' : '📱 Use current location'}
                </button>
                <div className="home-page__location-divider" />
                {HANOI_DISTRICTS.map((district) => (
                  <button
                    key={district.name}
                    className="home-page__location-option"
                    onClick={() => handleLocationSelect(district)}
                  >
                    {district.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="home-page__header-distance">
            within {homeData?.userLocation?.distance || 0} mi
          </p>
        </div>
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
                {selectedStore.pickUpTime}
              </p>
            </div>

            <div className="payment-modal__body">
              <div className="payment-modal__guest-info">
                <h3>YOUR INFORMATION</h3>
                <div className="payment-modal__form">
                  <div className="payment-modal__form-group">
                    <label htmlFor="name">Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={guestInfo.name}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                    />
                    {guestInfoErrors.name && (
                      <span className="payment-modal__error">{guestInfoErrors.name}</span>
                    )}
                  </div>
                  <div className="payment-modal__form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={guestInfo.email}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="payment-modal__form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      value={guestInfo.phone}
                      onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+84 123 456 789"
                    />
                  </div>
                  {guestInfoErrors.contact && (
                    <span className="payment-modal__error">{guestInfoErrors.contact}</span>
                  )}
                  
                  <button 
                    className="payment-modal__method-selector"
                    type="button"
                    onClick={() => {
                      console.log('Opening payment method modal');
                      setShowPaymentMethodModal(true);
                    }}
                  >
                    <div className="payment-modal__method-info">
                      <span>{selectedPaymentMethod.icon}</span>
                      <span>{selectedPaymentMethod.name}</span>
                    </div>
                    <span>Change</span>
                  </button>
                </div>
              </div>

              <div className="payment-modal__summary">
                <div className="summary-row">
                  <span>Original price</span>
                  <span className="payment-modal__price-original">
                    ${selectedStore?.originalPrice?.toFixed(2) || selectedStore?.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Discount</span>
                  <span className="payment-modal__price-discount">
                    -${((selectedStore?.originalPrice || selectedStore?.price || 0) - 
                       (selectedStore?.discountedPrice || selectedStore?.price || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Sales taxes</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span>
                    ${selectedStore?.discountedPrice?.toFixed(2) || selectedStore?.price?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>

              <button 
                className="payment-modal__pay-button"
                onClick={() => handlePaymentSubmit(selectedPaymentMethod.id)}
                disabled={loading}
              >
                Pay ${selectedStore?.discountedPrice?.toFixed(2) || selectedStore?.price?.toFixed(2) || '0.00'}
              </button>

              <p className="payment-modal__terms">
                By reserving this meal you agree to the Terms and Conditions.
              </p>
            </div>
          </div>
        </div>
      )}

      {showPaymentMethodModal && (
        <div className="payment-method-modal">
          <div className="payment-method-modal__content">
            <div className="payment-method-modal__header">
              <h3>Select Payment Method</h3>
              <button onClick={() => setShowPaymentMethodModal(false)}>✕</button>
            </div>
            <div className="payment-method-modal__body">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  className={`payment-method-modal__option ${
                    method.id === selectedPaymentMethod.id ? 'payment-method-modal__option--selected' : ''
                  }`}
                  onClick={() => handlePaymentMethodSelect(method)}
                >
                  <div className="payment-method-modal__option-info">
                    <span>{method.icon}</span>
                    <span>{method.name}</span>
                  </div>
                  {method.id === selectedPaymentMethod.id && (
                    <span className="payment-method-modal__check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 